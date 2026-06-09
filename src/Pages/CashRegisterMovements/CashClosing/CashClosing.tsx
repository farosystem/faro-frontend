import { useState, useEffect, useMemo } from 'react';
import { Button, Input, Alert, Table, Badge, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import RequestPermissions from '@/components/Common/RequestPermissions';

import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '@/services/FacturasParametrosService';
import { OBTENER_USUARIO_CODIGO } from '@/services/UsuarioService';
import { OBTENER_GESTION_ACTUAL, APERTURA_CAJA } from '@/services/GestionCajasService';
import { OBTENER_MOVIMIENTOS_DE_GESTION } from '@/services/MovimientosCajasService';

import { Query, Usuario } from '@/gql/graphql';
import ClosureDetails from './ClosureDetails';
import styles from './CashClosing.module.css';

function formatDateTime(value: string | number | null | undefined) {
  if (!value) return '';
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return String(value);
  const d = new Date(num);
  return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour12: false });
}

interface CashClosingProps {
  cajas: Array<{
    id: string;
    codigo?: string;
    nombre?: string;
    numero?: string;
    modulo?: string;
    estado?: string;
  }>;
  refetchCajas?: () => void;
  onShowGestiones?: (caja: {
    id: string;
    nombre?: string;
    numero?: string;
    modulo?: string;
    estado?: string;
  }) => void;
  initialCajaId?: string | null;
}

const CashClosing = ({ cajas, refetchCajas, onShowGestiones, initialCajaId }: CashClosingProps) => {
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCajaId, setSelectedFilterCajaId] = useState<string | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<'ALL' | 'ABIERTA' | 'CIERRE_PARCIAL'>('ALL');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (initialCajaId) {
      const caja = cajas.find((c) => c.id === initialCajaId);
      if (caja) {
        setSelectedCaja(caja);
        getGestionActual(caja.id);
      }
    }
  }, [initialCajaId, cajas]);
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const [currencyAmounts, setCurrencyAmounts] = useState([]);
  // used to swap from list to closure-details view after permission is granted
  const [hasPermissionToCloseCaja, setHasPermissionToCloseCaja] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [user, setUser] = useState<Usuario>(null);
  const [administrador, setAdministrador] = useState([]);
  const { data: dataPaymentMethods } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'paymentMethods' },
    pollInterval: 1000
  });
  // const [cierre_parcial] = useMutation(CIERRE_PARCIAL);
  // const [cierre_parcialCaja] = useMutation(CERRAR_PARCIALMENTE_CAJA);
  const [apertura_caja] = useMutation(APERTURA_CAJA);

  const { data: dataCurrencyTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'currencyTypes' },
    pollInterval: 1000
  });
  const { data: data_user } = useQuery<Query>(OBTENER_USUARIO_CODIGO, {
    variables: { codigo: localStorage.getItem('cedula') },
    pollInterval: 1000
  });
  const {
    refetch: obtener_gestion_actual,
    loading: loadingGestionQuery,
    error: errorGestionQuery
  } = useQuery(OBTENER_GESTION_ACTUAL, { skip: true });
  // lazy query for prefetching multiple cajas without interfering with the above refetch
  const [fetchGestion] = useLazyQuery(OBTENER_GESTION_ACTUAL);
  const [gestionActual, setGestionActual] = useState(null);
  const [cajaGestiones, setCajaGestiones] = useState<{ [id: string]: any }>({});
  const [loadingGestion, setLoadingGestion] = useState(false);
  const [obtener_movimientos] = useLazyQuery(OBTENER_MOVIMIENTOS_DE_GESTION);

  useEffect(() => {
    if (dataPaymentMethods?.obtenerFacturasParametrosByType) {
      const initialAmounts = dataPaymentMethods.obtenerFacturasParametrosByType.map((method) => ({
        metodoId: method.id,
        metodo: method.value,
        detalles: []
      }));
      setPaymentAmounts(initialAmounts);
    }

    if (dataCurrencyTypes?.obtenerFacturasParametrosByType) {
      const initialCurrencyAmounts = dataCurrencyTypes.obtenerFacturasParametrosByType.map(
        (currency) => ({
          monedaId: currency.id,
          moneda: currency.value,
          monto: '',
          detalles: []
        })
      );
      setCurrencyAmounts(initialCurrencyAmounts);
    }
  }, [dataPaymentMethods, dataCurrencyTypes]);

  useEffect(() => {
    setUser(data_user?.obtenerUsuarioByCodigo || null);
  }, [data_user]);

  const navigate = useNavigate();

  const handleOpenCierreModal = async (caja, isParcial) => {
    setSelectedCaja(caja);
    // make sure gestionActual is loaded before navigating or opening modal
    await getGestionActual(caja.id);
    if (isParcial) {
      // redirect to dedicated page for partial closures
      navigate(`/cierre-parcial/${caja.id}`);
    } else {
      setPermissionModal(true);
    }
  };

  const getGestionActual = async (cajaId) => {
    setLoadingGestion(true);
    try {
      const { data } = await obtener_gestion_actual({ caja: cajaId });
      console.debug('obtenerGestionActual result', data);
      if (data && data.obtenerGestionActual) {
        setGestionActual(data.obtenerGestionActual);
      } else {
        setGestionActual(null);
      }
    } catch (error) {
      console.error('Error fetching current management:', error);
      setGestionActual(null);
    } finally {
      setLoadingGestion(false);
    }
  };

  const handleChangeCaja = () => {
    setHasPermissionToCloseCaja(false);
    setSelectedCaja(null);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // list of open cajas for table and selectors
  const openCajas = useMemo(
    () => cajas.filter((c) => c.estado === 'ABIERTA' || c.estado === 'CIERRE_PARCIAL'),
    [cajas]
  );

  const filteredCajas = useMemo(() => {
    let list = openCajas;
    if (estadoFilter !== 'ALL') {
      list = list.filter((c) => c.estado === estadoFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.codigo?.toLowerCase().includes(term) ||
          c.nombre?.toLowerCase().includes(term) ||
          String(c.numero).includes(term)
      );
    }
    if (selectedFilterCajaId) {
      list = list.filter((c) => c.id === selectedFilterCajaId);
    }
    // generic sorting based on sortField and sortOrder
    return list.slice().sort((a, b) => {
      let va: any = a[sortField as keyof typeof a] || '';
      let vb: any = b[sortField as keyof typeof b] || '';
      if (sortField === 'id') {
        const ta = va ? parseInt(String(va).substring(0, 8), 16) : 0;
        const tb = vb ? parseInt(String(vb).substring(0, 8), 16) : 0;
        if (ta !== tb) return sortOrder === 'asc' ? ta - tb : tb - ta;
      }
      if (sortField === 'numero') {
        const na = parseInt(va as any, 10) || 0;
        const nb = parseInt(vb as any, 10) || 0;
        if (na !== nb) return sortOrder === 'asc' ? na - nb : nb - na;
      }
      const comp = String(va).localeCompare(String(vb));
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [openCajas, estadoFilter, searchTerm, selectedFilterCajaId, sortField, sortOrder]);

  // whenever the list of cajas or mode changes, load current gestion for each
  useEffect(() => {
    if (!cajas?.length) return;
    // reset map so we show placeholders while loading
    setCajaGestiones({});
    const openCajas = cajas.filter((c) => c.estado === 'ABIERTA' || c.estado === 'CIERRE_PARCIAL');
    console.debug(
      'loading gestiones for open cajas',
      openCajas.map((c) => c.id)
    );
    openCajas.forEach(async (caja) => {
      try {
        const { data } = await fetchGestion({ variables: { caja: caja.id } });
        console.debug('gestion fetched for', caja.id, data);
        let gestion = data?.obtenerGestionActual || null;
        // if we expect an active gestion but none exists, create a minimal one
        if (!gestion) {
          console.debug('no gestion found for', caja.id, 'creating default');
          const now = new Date();
          try {
            const resp = await apertura_caja({
              variables: {
                input: {
                  caja: caja.id,
                  fecha: now.toISOString().split('T')[0],
                  hora_apertura: now.toTimeString().slice(0, 8),
                  hora_cierre: '',
                  usuario: null,
                  administrador: null,
                  datos_inicio_usuario: [],
                  datos_cierre_usuario: null,
                  datos_cierre_sistema: null,
                  cedula: user?.cedula || '',
                  observaciones: ''
                }
              }
            });
            gestion = resp.data?.aperturaCaja?.data || null;
            console.debug('created gestion', gestion);
          } catch (e) {
            console.error('failed to auto-create gestion for', caja.id, e);
          }
        }
        setCajaGestiones((prev) => ({ ...prev, [caja.id]: gestion }));
      } catch (err) {
        console.error('failed to load gestion for', caja.id, err);
        setCajaGestiones((prev) => ({ ...prev, [caja.id]: null }));
      }
    });
  }, [cajas, fetchGestion, apertura_caja, user]);

  const handleDirectAmountChange = (paymentIndex, currencyId, value) => {
    const updatedPaymentAmounts = [...paymentAmounts];
    const payment = updatedPaymentAmounts[paymentIndex];

    const existingIndex = payment.detalles.findIndex((d) => d.monedaId === currencyId);

    if (existingIndex >= 0) {
      if (value === '' || parseFloat(value) <= 0) {
        payment.detalles.splice(existingIndex, 1);
      } else {
        payment.detalles[existingIndex].monto = value;
      }
    } else if (value !== '' && parseFloat(value) > 0) {
      const currency = currencyAmounts.find((c) => c.monedaId === currencyId);
      payment.detalles.push({
        monedaId: currencyId,
        moneda: currency.moneda,
        monto: value
      });
    }

    setPaymentAmounts(updatedPaymentAmounts);
    const updatedCurrencyAmounts = currencyAmounts.map((currency) => {
      if (currency.monedaId === currencyId) {
        const detalles = updatedPaymentAmounts
          .filter((payment) => payment.detalles.some((d) => d.monedaId === currencyId))
          .map((payment) => {
            const detalle = payment.detalles.find((d) => d.monedaId === currencyId);
            return detalle ? { metodoId: payment.metodoId, monto: detalle.monto } : null;
          })
          .filter(Boolean);

        const totalMonto = detalles.reduce(
          (sum, detalle) => sum + parseFloat(detalle.monto || 0),
          0
        );

        return { ...currency, detalles, monto: totalMonto.toFixed(2) };
      }
      return currency;
    });

    setCurrencyAmounts(updatedCurrencyAmounts);
  };

  const calculateCurrencyTotal = (monedaId) => {
    const total = paymentAmounts.reduce((sum, payment) => {
      const detalle = payment.detalles.find((d) => d.monedaId === monedaId);
      return sum + (detalle ? parseFloat(detalle.monto || 0) : 0);
    }, 0);
    return total.toFixed(2);
  };

  const handleCierreParcial = async () => {
    // guard: caja must be open
    const cajaAbierta =
      selectedCaja?.estado === 'ABIERTA' || selectedCaja?.estado === 'CIERRE_PARCIAL';

    // if we don't have an active gestion, try to create one if caja is open
    if (!gestionActual) {
      if (cajaAbierta) {
        const createResp = await Swal.fire({
          title: 'Gestión faltante',
          text: 'No se encontró una gestión activa. ¿Desea crear una apertura automática?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No'
        });
        if (!createResp.isConfirmed) {
          await Swal.fire(
            'Error',
            'La caja está marcada como abierta pero no existe gestión.',
            'error'
          );
          return;
        }
        // create minimal gestion
        const now = new Date();
        try {
          const result = await apertura_caja({
            variables: {
              input: {
                caja: selectedCaja.id,
                fecha: now.toISOString().split('T')[0],
                hora_apertura: now.toTimeString().slice(0, 8),
                hora_cierre: '',
                usuario: null,
                administrador: null,
                datos_inicio_usuario: [],
                datos_cierre_usuario: null,
                datos_cierre_sistema: null,
                cedula: user?.cedula || '',
                observaciones: ''
              }
            }
          });
          const { estado, data, message } = result.data.aperturaCaja;
          if (estado) {
            setGestionActual(data);
          } else {
            await Swal.fire('Error', message, 'error');
            return;
          }
        } catch (err) {
          console.error('auto apertura failed', err);
          await Swal.fire('Error', 'No se pudo crear la gestión automáticamente.', 'error');
          return;
        }
      } else {
        await Swal.fire('Error', 'La caja seleccionada no está abierta.', 'error');
        return;
      }
    }

    // At this point gestionActual should exist
    if (gestionActual.hora_cierre) {
      await Swal.fire('Error', 'La caja seleccionada no está abierta.', 'error');
      return;
    }
  };

  return (
    <div>
      <h4 className={`${styles.title} card-title mb-4`}>Cierre de Caja</h4>
      {!hasPermissionToCloseCaja ? (
        <div>
          <h5 className="mb-4">Seleccione una caja abierta</h5>
          {/* filter/search row */}
          <Row className={`${styles.filterRow} mb-3`}>
            <Col lg={4}>
              <Input
                placeholder="Buscar por código, nombre o número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col lg={4}>
              <Select
                isClearable
                options={openCajas
                  .slice()
                  .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
                  .map((caja) => ({ value: caja.id, label: caja.nombre || caja.codigo || '' }))}
                value={
                  selectedFilterCajaId
                    ? {
                        value: selectedFilterCajaId,
                        label:
                          openCajas.find((c) => c.id === selectedFilterCajaId)?.nombre ||
                          openCajas.find((c) => c.id === selectedFilterCajaId)?.codigo ||
                          ''
                      }
                    : null
                }
                onChange={(opt: any) => {
                  setSelectedFilterCajaId(opt ? opt.value : null);
                }}
                placeholder="Filtrar por caja"
              />
            </Col>
            <Col lg={4}>
              <Input
                type="select"
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value as any)}
              >
                <option value="ALL">Todas</option>
                <option value="ABIERTA">Abiertas</option>
                <option value="CIERRE_PARCIAL">Cierre parcial</option>
              </Input>
            </Col>
          </Row>
          <div className={`${styles.stats} mb-2 text-muted`}>
            {filteredCajas.length} caja(s) &mdash;{' '}
            {filteredCajas.filter((c) => c.estado === 'ABIERTA').length} abiertas,{' '}
            {filteredCajas.filter((c) => c.estado !== 'ABIERTA').length} en cierre parcial
          </div>
          {selectedCaja && (
            <div className="mb-3">
              <strong>Gestión actual de {selectedCaja.nombre}</strong>{' '}
              {loadingGestion ? (
                <span className="text-muted">cargando...</span>
              ) : errorGestionQuery ? (
                <span className="text-danger">error al cargar</span>
              ) : gestionActual ? (
                <>
                  <div>
                    <strong>Consecutivo: </strong>
                    {gestionActual.consecutivo || gestionActual.id}
                  </div>
                  <div>
                    <strong>Fecha: </strong>
                    {formatDateTime(gestionActual.fecha)} {gestionActual.hora_apertura || ''}
                  </div>
                </>
              ) : (
                <span className="text-danger">(no existe gestión)</span>
              )}
            </div>
          )}
          {/* botones de acción arriba */}
          {selectedCaja && (
            <div className={`${styles.actionArea} mb-3 d-flex gap-2`}>
              {selectedCaja.estado === 'ABIERTA' && (
                <Button color="warning" onClick={() => handleOpenCierreModal(selectedCaja, true)}>
                  <i className="bx bx-clipboard me-1"></i> Cierre Parcial
                </Button>
              )}
              {(selectedCaja.estado === 'ABIERTA' || selectedCaja.estado === 'CIERRE_PARCIAL') && (
                <Button color="danger" onClick={() => handleOpenCierreModal(selectedCaja, false)}>
                  <i className="bx bx-clipboard me-1"></i> Cerrar Caja
                </Button>
              )}
            </div>
          )}
          <div className={styles.tableContainer}>
            <Table hover responsive>
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('codigo')}>
                    Código{' '}
                    {sortField === 'codigo' &&
                      (sortOrder === 'asc' ? (
                        <i className="bx bx-up-arrow-alt"></i>
                      ) : (
                        <i className="bx bx-down-arrow-alt"></i>
                      ))}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('nombre')}>
                    Nombre{' '}
                    {sortField === 'nombre' &&
                      (sortOrder === 'asc' ? (
                        <i className="bx bx-up-arrow-alt"></i>
                      ) : (
                        <i className="bx bx-down-arrow-alt"></i>
                      ))}
                  </th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('numero')}>
                    Número{' '}
                    {sortField === 'numero' &&
                      (sortOrder === 'asc' ? (
                        <i className="bx bx-up-arrow-alt"></i>
                      ) : (
                        <i className="bx bx-down-arrow-alt"></i>
                      ))}
                  </th>
                  <th>Modulo</th>
                  <th>Gestión</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCajas.map((caja, index) => (
                  <tr
                    key={caja?.id}
                    className={selectedCaja?.id === caja.id ? 'table-active' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedCaja(caja);
                      getGestionActual(caja.id);
                    }}
                  >
                    <td>{caja?.codigo}</td>
                    <td>{caja?.nombre}</td>
                    <td>{caja?.numero}</td>
                    <td>
                      {cajaGestiones[caja.id] === undefined ? (
                        <span className="text-muted">...</span>
                      ) : cajaGestiones[caja.id] ? (
                        // clickable gestor link
                        <Button
                          color="link"
                          size="sm"
                          className="p-0"
                          onClick={() => onShowGestiones && onShowGestiones(caja)}
                        >
                          {cajaGestiones[caja.id].consecutivo || cajaGestiones[caja.id].id}
                        </Button>
                      ) : (
                        <span className="text-danger">n/a</span>
                      )}
                    </td>
                    <td>{caja?.modulo == 'Punto_Venta' ? 'Punto de Venta' : caja.modulo}</td>
                    <td>
                      <Badge color={caja.estado === 'ABIERTA' ? 'success' : 'warning'}>
                        {caja.estado === 'ABIERTA' ? 'ABIERTA' : 'CIERRE PARCIAL'}
                      </Badge>
                    </td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {openCajas.length === 0 && (
            <Alert color="info">No hay cajas disponibles para cerrar</Alert>
          )}
          {openCajas.length > 0 && filteredCajas.length === 0 && (
            <Alert color="warning">No se encontraron cajas con los criterios especificados</Alert>
          )}
        </div>
      ) : (
        <ClosureDetails
          gestionActual={gestionActual}
          selectedCaja={selectedCaja}
          onBack={handleChangeCaja}
          administrador={administrador}
          usuario={user}
        />
      )}
      <RequestPermissions
        modalOpen={permissionModal}
        setModalOpen={setPermissionModal}
        onSuccessConfirmation={(adminUser) => {
          setHasPermissionToCloseCaja(true);
          setAdministrador(adminUser);
        }}
        modules={['REGISTROS CONTABLES']}
        permissions={['editar']}
        enableConfirmationMessage
      />
    </div>
  );
};

export default CashClosing;
