import { useEffect, useMemo, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import {
  OBTENER_RESERVA_HABITACIONES_POR_FECHA,
  OBTENER_FULL_RESERVAHABITACION
} from '@/services/ReservaHabitacionService';

export function useReservationBilling(reserva: any) {
  const client = useApolloClient();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomsSource, setRoomsSource] = useState<string | null>(null);

  const formattedDate = useMemo(() => {
    if (!reserva?.fechaReserva) return null;
    try {
      return new Date(Number(reserva.fechaReserva)).toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  }, [reserva]);

  const { data: dataRooms } = useQuery(OBTENER_RESERVA_HABITACIONES_POR_FECHA, {
    variables: { fecha: formattedDate },
    skip: !formattedDate,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (!reserva) return;

    if (dataRooms?.obtenerReservaHabitacionesPorFecha) {
      const list = dataRooms.obtenerReservaHabitacionesPorFecha.filter(
        (r: any) => r.reserva && r.reserva.id === reserva.id
      );
      if (list && list.length) {
        setRooms(list);
        setRoomsSource('date');
        return;
      }
    }

    let cancel = false;
    const fetchFull = async () => {
      try {
        const { data } = await client.query({
          query: OBTENER_FULL_RESERVAHABITACION,
          fetchPolicy: 'no-cache'
        });
        const list = data?.obtenerReservaHabitaciones || [];
        const filtered = list.filter((r: any) => r.reserva && r.reserva.id === reserva.id);
        if (!cancel) {
          setRooms(filtered);
          setRoomsSource(filtered && filtered.length ? 'full' : null);
        }
      } catch (e) {
        // ignore
      }
    };

    fetchFull();
    return () => {
      cancel = true;
    };
  }, [dataRooms, reserva, client]);

  // build lines from reserva + rooms
  const [lines, setLines] = useState<any[]>([]);
  const [selected, setSelected] = useState<{ [k: string]: boolean }>({});

  useEffect(() => {
    if (!reserva) return;

    const roomLines =
      rooms?.flatMap((rh: any) => {
        const fechaEntrada = Number(rh.fechaEntrada);
        const fechaSalida = Number(rh.fechaSalida);
        const nights = Math.max(
          1,
          Math.round((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24))
        );
        const unitPrice =
          rh.habitacion?.precioPorNoche || rh.habitacion?.tipoHabitacion?.precioBase || 0;
        const linesLocal: any[] = [
          {
            id: `room-${rh.id}`,
            descripcion: `Habitación ${rh.habitacion?.numeroHabitacion || ''} - ${rh.habitacion?.tipoHabitacion?.nombre || rh.habitacion?.descripcion || 'Habitación'}`,
            cantidadArticulo: nights,
            precioCompra: unitPrice,
            impuestos: [],
            guest: null,
            source: 'room',
            reservaHabitacionId: rh.id,
            huespedes: rh.huespedes || []
          }
        ];

        ['serviciosExtra', 'toursExtra', 'cargosHabitacion', 'serviciosExternos', 'items'].forEach(
          (key) => {
            if (Array.isArray(rh[key]) && rh[key].length) {
              rh[key].forEach((s: any, i: number) => {
                linesLocal.push({
                  id: `room-${rh.id}-${key}-${i}`,
                  descripcion: s.nombre || s.cargo || s.descripcion || s.detalle || key,
                  cantidadArticulo: s.extra || 1,
                  precioCompra: s.precio || s.monto || s.precioPorNoche || 0,
                  impuestos: s.impuestos || [],
                  guest: s.huespedId || null,
                  source: key,
                  reservaHabitacionId: rh.id,
                  huespedes: rh.huespedes || []
                });
              });
            }
          }
        );

        return linesLocal;
      }) || [];

    const extraResLines: any[] = [];
    if (Array.isArray(reserva?.serviciosGrupal) && reserva.serviciosGrupal.length) {
      reserva.serviciosGrupal.forEach((s: any, i: number) => {
        extraResLines.push({
          id: `res-srv-${i}`,
          descripcion: s.nombre || s.descripcion || `Servicio ${i + 1}`,
          cantidadArticulo: s.cantidad || 1,
          precioCompra: s.precio || s.monto || 0,
          impuestos: s.impuestos || [],
          guest: reserva?.cliente?.id || null,
          source: 'serviciosGrupal',
          raw: s,
          externalId: s.id || null,
          huespedes: []
        });
      });
    }
    if (Array.isArray(reserva?.paquetes) && reserva.paquetes.length) {
      reserva.paquetes.forEach((p: any, i: number) => {
        extraResLines.push({
          id: `res-pack-${i}`,
          descripcion: p.nombre || p.descripcion || `Paquete ${i + 1}`,
          cantidadArticulo: p.cantidad || 1,
          precioCompra: p.precio || p.monto || 0,
          impuestos: p.impuestos || [],
          guest: reserva?.cliente?.id || null,
          source: 'paquetes',
          raw: p,
          externalId: p.id || null,
          huespedes: []
        });
      });
    }
    if (Array.isArray(reserva?.tours) && reserva.tours.length) {
      reserva.tours.forEach((t: any, i: number) => {
        extraResLines.push({
          id: `res-tour-${i}`,
          descripcion: t.nombre || t.descripcion || `Tour ${i + 1}`,
          cantidadArticulo: t.cantidad || 1,
          precioCompra: t.precio || t.monto || 0,
          impuestos: t.impuestos || [],
          guest: reserva?.cliente?.id || null,
          source: 'tours',
          raw: t,
          externalId: t.id || null,
          huespedes: []
        });
      });
    }

    const merged = [...roomLines, ...extraResLines].map((l) => ({
      ...l,
      guest:
        l.guest || (l.huespedes && l.huespedes.length ? l.guest : reserva?.cliente?.id || null),
      category:
        l.source === 'room'
          ? 'Habitaciones'
          : l.source === 'serviciosExtra' ||
              l.source === 'serviciosExternos' ||
              l.source === 'serviciosGrupal'
            ? 'Servicios'
            : l.source === 'toursExtra' || l.source === 'tours'
              ? 'Tours'
              : l.source === 'paquetes' || l.source === 'items' || l.source === 'cargosHabitacion'
                ? 'Paquetes'
                : l.source === 'reserva'
                  ? 'Reserva'
                  : 'Otros'
    }));

    setLines(merged);
    const sel: { [k: string]: boolean } = {};
    merged.forEach((l) => (sel[l.id] = true));
    setSelected(sel);
  }, [reserva, rooms]);

  const toggleLine = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const updateLine = (id: string, field: string, value: any) => {
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const selectedArray = useMemo(() => lines.filter((l) => selected[l.id]), [lines, selected]);

  const selectedTotal = useMemo(
    () =>
      lines
        .filter((l) => selected[l.id])
        .reduce((s, l) => s + Number(l.precioCompra || 0) * Number(l.cantidadArticulo || 1), 0),
    [lines, selected]
  );

  const allLinesTotal = useMemo(
    () =>
      lines.reduce((s, l) => s + Number(l.precioCompra || 0) * Number(l.cantidadArticulo || 1), 0),
    [lines]
  );

  const { daysUntilCheckin, penaltyRate, penaltyOnSelected } = useMemo(() => {
    let checkInDate = null;
    try {
      if (rooms && rooms.length) {
        const earliest = rooms.reduce((min: any, r: any) => {
          const d = Number(r.fechaEntrada) || null;
          if (!d) return min;
          return min === null || d < min ? d : min;
        }, null);
        checkInDate = earliest ? new Date(Number(earliest)) : null;
      }
      if (!checkInDate && reserva?.fechaReserva)
        checkInDate = new Date(Number(reserva.fechaReserva));
    } catch (e) {
      checkInDate = null;
    }

    let days: any = null;
    if (checkInDate) {
      const now = new Date();
      const diff = Math.ceil(
        (checkInDate.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
      );
      days = diff < 0 ? 0 : diff;
    }

    const rate = days === null ? 0 : days >= 7 ? 0 : days >= 2 ? 0.5 : 1;
    const penalty = selectedTotal * rate;

    return { daysUntilCheckin: days, penaltyRate: rate, penaltyOnSelected: penalty };
  }, [rooms, reserva, selectedTotal]);

  const formatDate = (ts: any) => {
    if (!ts) return 'N/A';
    try {
      return new Date(Number(ts)).toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };

  return {
    lines,
    selected,
    toggleLine,
    updateLine,
    rooms,
    selectedArray,
    selectedTotal,
    allLinesTotal,
    daysUntilCheckin,
    penaltyRate,
    penaltyOnSelected,
    formatDate
  };
}
