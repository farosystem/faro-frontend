import { GestionCaja, MovimientoCaja, ModuloCaja } from '@/gql/graphql';

interface CierreUsuarioMoneda {
  moneda: string;
  detalles: Array<{ metodo?: string; monto?: number }>; // origin comes as JSON
}

interface MovimientoDetalle {
  tipo?: string | null;
  modulo?: ModuloCaja | null;
  concepto: string;
  monto?: number | null;
  fecha?: string | null;
  hora?: string | null;
}

interface MetodoPagoData {
  ingresos: number;
  egresos: number;
  totalUsuario: number;
  detalles: MovimientoDetalle[];
}

interface MovimientosPorMonedaItem {
  ingresosSistema: number;
  egresosSistema: number;
  metodosPago: Record<string, MetodoPagoData>;
}

type MovimientosPorMoneda = Record<string, MovimientosPorMonedaItem>;

interface ResumenMetodoPago {
  metodo: string;
  ingresos: number;
  egresos: number;
  totalUsuario: number;
  detalles: MovimientoDetalle[];
}

interface ResumenFinalItem {
  moneda: string;
  montoInicial: number;
  ingresosSistema: number;
  egresosSistema: number;
  totalSistema: number;
  totalUsuario: number;
  diferencia: number;
  metodosPago: ResumenMetodoPago[];
}

export const calcularResumenCierre = (
  gestionCaja: GestionCaja,
  movimientos: MovimientoCaja[]
): ResumenFinalItem[] => {
  const datosIniciales = (gestionCaja.datos_inicio_usuario || []) as CierreUsuarioMoneda[];
  const datosCierreUsuario = (gestionCaja.datos_cierre_usuario || []) as CierreUsuarioMoneda[];

  const movimientosPorMoneda: MovimientosPorMoneda = {};

  // Agrupar movimientos del sistema
  movimientos.forEach((movimiento) => {
    const moneda = movimiento.codigoMoneda;
    const metodoPago = movimiento.medioPago;
    const tipo = movimiento.tipo;
    const monto = movimiento.monto;

    if (!movimientosPorMoneda[moneda]) {
      movimientosPorMoneda[moneda] = {
        ingresosSistema: 0,
        egresosSistema: 0,
        metodosPago: {}
      };
    }

    const datos = movimientosPorMoneda[moneda];

    if (tipo === 'ENTRADA') {
      datos.ingresosSistema += monto;
    } else {
      datos.egresosSistema += monto;
    }

    if (!datos.metodosPago[metodoPago]) {
      datos.metodosPago[metodoPago] = {
        ingresos: 0,
        egresos: 0,
        totalUsuario: 0,
        detalles: []
      };
    }

    const metodo = datos.metodosPago[metodoPago];

    if (tipo === 'ENTRADA') {
      metodo.ingresos += monto;
    } else {
      metodo.egresos += monto;
    }

    metodo.detalles.push({
      tipo,
      modulo: movimiento.modulo,
      concepto: movimiento.observaciones || 'Sin descripción',
      monto,
      fecha: movimiento.fecha,
      hora: movimiento.hora
    });
  });

  // Agregar totalUsuario por método de pago (solo como referencia)
  datosCierreUsuario.forEach((monedaData) => {
    const moneda = monedaData.moneda;
    if (!movimientosPorMoneda[moneda]) {
      movimientosPorMoneda[moneda] = {
        ingresosSistema: 0,
        egresosSistema: 0,
        metodosPago: {}
      };
    }

    monedaData.detalles.forEach((detalle) => {
      const metodo = detalle.metodo;
      const monto = detalle.monto || 0;

      if (!movimientosPorMoneda[moneda].metodosPago[metodo]) {
        movimientosPorMoneda[moneda].metodosPago[metodo] = {
          ingresos: 0,
          egresos: 0,
          totalUsuario: 0,
          detalles: []
        };
      }

      movimientosPorMoneda[moneda].metodosPago[metodo].totalUsuario += monto;
    });
  });

  // Generar resumen final
  const resumenFinal: ResumenFinalItem[] = [];

  Object.keys(movimientosPorMoneda).forEach((moneda) => {
    const datos = movimientosPorMoneda[moneda];

    const montoInicial = datosIniciales.find((m) => m.moneda === moneda)?.detalles?.[0]?.monto || 0;
    const totalSistema = montoInicial + datos.ingresosSistema - datos.egresosSistema;

    const metodosPago: ResumenMetodoPago[] = Object.entries(datos.metodosPago).map(
      ([metodo, datosMetodo]) => ({
        metodo,
        ingresos: datosMetodo.ingresos,
        egresos: datosMetodo.egresos,
        totalUsuario: datosMetodo.totalUsuario,
        detalles: datosMetodo.detalles
      })
    );

    const totalUsuario = metodosPago.reduce((sum, m) => sum + (m.totalUsuario || 0), 0);

    resumenFinal.push({
      moneda,
      montoInicial,
      ingresosSistema: datos.ingresosSistema,
      egresosSistema: datos.egresosSistema,
      totalSistema,
      totalUsuario,
      diferencia: totalSistema - totalUsuario,
      metodosPago
    });
  });

  return resumenFinal;
};
