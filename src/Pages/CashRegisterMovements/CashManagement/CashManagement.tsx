import { useState, useEffect, Fragment, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Alert,
  Badge
} from 'reactstrap';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  OBTENER_GESTIONES_POR_RANGO,
  OBTENER_GESTIONES_CAJA,
  OBTENER_GESTIONES_POR_CAJA,
  CIERRE_CAJA
} from '@/services/GestionCajasService';
import { getSimboloMoneda } from '@/helpers/helpers';
import { generarPDFGestionesCajas } from '@/helpers/exportPDF';
import { GestionCaja, Query } from '@/gql/graphql';
import styles from './CashManagement.module.css';
import Swal from 'sweetalert2';
import { useDateUtils } from '../../../lib/hooks/useDateUtils';

// estados de caja/gestión
export enum EstadoCaja {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA',
  CIERRE_PARCIAL = 'CIERRE_PARCIAL'
}

// normaliza cadena de fecha a formato ISO yyyy-mm-dd
const isoDate = (str: string) => {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toISOString().slice(0, 10);
};

// --- custom types for closure data coming from the server ---
interface DetalleCierre {
  metodo?: string;
  monto?: number | string;
}

interface UsuarioDatos {
  moneda?: string;
  detalles?: DetalleCierre[];
  montoInicial?: number;
  ingresos?: number;
  egresos?: number;
  diferencia?: number;
  estado?: string;
}

// map of currency code to system/usuario values
interface MonedaMapItem {
  sistema?: UsuarioDatos;
  usuario?: UsuarioDatos;
}

// JSON payloads coming from the server; GraphQL defines them as `any` so we
// re-create their expected structure here in TS.  This keeps the rest of the
// component strongly typed even though the generated schema is loose.
interface CierreUsuarioMoneda {
  moneda: string;
  detalles: Array<{ metodo?: string; monto?: number }>; // monto sometimes string elsewhere
}

interface CierreSistemaMoneda {
  codigoMoneda: string;
  montoInicial?: number;
  ingresos?: number;
  egresos?: number;
  diferencia?: number;
  estado?: string;
}

// Extend the generated GestionCaja type to give concrete types for the JSON
// fields we need.  We use `Omit`/`&` to preserve all other properties.
type GestionCajaTyped = Omit<
  GestionCaja,
  'datos_cierre_usuario' | 'datos_cierre_sistema' | 'datos_inicio_usuario'
> & {
  datos_cierre_usuario?: CierreUsuarioMoneda[] | null;
  datos_cierre_sistema?: CierreSistemaMoneda[] | null;
  datos_inicio_usuario?: any; // left as any until needed
  estado?: string;
};

// props expected by the component
interface CashManagementProps {
  cajas: Array<{
    id: string;
    nombre: string;
    numero?: string;
    modulo?: string;
    estado?: string;
  }>;
  // when provided, automatically select this caja on mount
  initialCajaId?: string | null;
  // callback to notify parent that user clicked a caja link
  onSelectCaja?: (caja: {
    id: string;
    nombre?: string;
    numero?: string;
    modulo?: string;
    estado?: string;
  }) => void;
  // optional filter on gestion.estado (ABIERTA, CERRADA, ...)
  estadoFiltro?: string;
}

const CashManagement = ({
  cajas,
  initialCajaId = null,
  onSelectCaja,
  estadoFiltro
}: CashManagementProps) => {
  // helper to extract string id from either raw ID or populated object
  const normalizeCajaId = (caja: any): string | undefined => {
    if (!caja) return undefined;
    if (typeof caja === 'object') {
      return caja.id || caja._id || (caja.toString && caja.toString());
    }
    return String(caja);
  };
  // utility to evaluate estadoFiltro based on hora_cierre
  const matchesEstado = (g: any) => {
    if (!estadoFiltro) return true;
    switch (estadoFiltro) {
      case EstadoCaja.ABIERTA:
        return !g.hora_cierre;
      case EstadoCaja.CERRADA:
        // treat any gestion with a closing timestamp or marked partial as closed
        return !!g.hora_cierre || !!g.cierreParcial;
      case EstadoCaja.CIERRE_PARCIAL:
        // only strictly those flagged partial (may also have hora_cierre)
        return !!g.cierreParcial;
      default:
        return true;
    }
  };
  // calculate default date range (past 7 days)

  const { weekAgoStr, monthAgoDateStr, today } = useDateUtils();

  const [filters, setFilters] = useState<{ fechaInicio: string; fechaFin: string }>({
    fechaInicio: monthAgoDateStr,
    fechaFin: today
  });
  // detail view is now handled via separate route; no local modal state
  const navigate = useNavigate();
  const [gestiones, setGestiones] = useState<GestionCajaTyped[] | null>(null);

  const [obtenerGestionesPorRangoFecha, { loading, error }] = useLazyQuery<Query>(
    OBTENER_GESTIONES_POR_RANGO,
    {
      fetchPolicy: 'network-only'
    }
  );
  const [obtenerTodasGestiones, { loading: loadingAll, error: errorAll }] = useLazyQuery<Query>(
    OBTENER_GESTIONES_CAJA,
    {
      fetchPolicy: 'network-only'
    }
  );
  const [obtenerGestionesPorCaja] = useLazyQuery<Query>(OBTENER_GESTIONES_POR_CAJA, {
    fetchPolicy: 'network-only'
  });
  const [cierreCaja] = useMutation(CIERRE_CAJA);

  // if parent requested a particular caja, apply that as a filter and reload
  useEffect(() => {
    if (initialCajaId) {
      // clear the date inputs so they don't mislead the user
      setFilters({ fechaInicio: '', fechaFin: '' });
      obtenerGestionesPorCaja({
        variables: { caja: initialCajaId }
      }).then((response) => {
        let data: any = response.data?.obtenerGestionesPorCaja;
        if (!data) {
          setGestiones([]);
          return;
        }
        if (!Array.isArray(data)) data = [data];
        if (estadoFiltro) {
          data = data.filter(matchesEstado);
        }
        setGestiones(data as GestionCajaTyped[]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCajaId, cajas]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    const { fechaInicio, fechaFin } = filters;

    // if both dates cleared, load everything (or limit to caja if provided)
    if (!fechaInicio && !fechaFin) {
      if (initialCajaId) {
        obtenerGestionesPorCaja({ variables: { caja: initialCajaId } }).then((resp) => {
          let d: any = resp.data?.obtenerGestionesPorCaja;
          if (!d) {
            setGestiones([]);
            return;
          }
          if (!Array.isArray(d)) d = [d];
          if (estadoFiltro) {
            d = d.filter(matchesEstado);
          }
          console.debug('loaded gestiones', d);
          setGestiones(d as GestionCajaTyped[]);
        });
      } else {
        obtenerTodasGestiones().then((resp) => {
          let data: any = resp.data?.obtenerGestionesCaja || [];
          if (estadoFiltro) {
            data = data.filter(matchesEstado);
          }
          setGestiones(data as GestionCajaTyped[]);
        });
      }
      return;
    }

    // only run range query when both endpoints are provided
    if (fechaInicio && fechaFin) {
      const vars: any = { fechaInicio: isoDate(fechaInicio), fechaFin: isoDate(fechaFin) };
      if (initialCajaId) vars.caja = initialCajaId;
      obtenerGestionesPorRangoFecha({
        variables: vars
      }).then((response) => {
        let data: any = response.data?.obtenerGestionesPorRangoFecha || [];
        if (estadoFiltro) {
          data = data.filter(matchesEstado);
        }
        setGestiones(data as GestionCajaTyped[]);
      });
    }
    // otherwise (partial date) do nothing until user completes both fields
  };

  // make sure we'll fetch everything on initial mount (unless we're scoped to a
  // specific caja); the inputs still display the one‑week default but we don't
  // apply it until the user modifies them.
  useEffect(() => {
    if (!initialCajaId) {
      obtenerTodasGestiones().then((resp) => {
        let data = resp.data?.obtenerGestionesCaja || [];
        if (estadoFiltro) {
          data = data.filter(matchesEstado);
        }
        console.debug('initial loaded gestiones', data);
        setGestiones(data as GestionCajaTyped[]);
      });
    }
    // run once; we include initialCajaId so the condition is respected if it changes
  }, [initialCajaId]);

  // auto-run filters when they change, but skip the first invocation (which is
  // just the default values) so we don't hide the full list immediately.
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      handleApplyFilters();
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({ fechaInicio: '', fechaFin: '' });
  };

  const openModal = (gestion: GestionCajaTyped) => {
    console.log('navigating to gestion detail with id', gestion.id);
    // navigate to standalone detail page
    navigate(`/cashmovements/gestion/${gestion.id}`);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case EstadoCaja.ABIERTA:
        return <Badge color="success">ABIERTA</Badge>;
      case EstadoCaja.CERRADA:
        return <Badge color="danger">CERRADA</Badge>;
      case EstadoCaja.CIERRE_PARCIAL:
        return <Badge color="warning">CIERRE PARCIAL</Badge>;
      default:
        return <Badge color="secondary">{estado}</Badge>;
    }
  };
  const handleExportarGestionesFiltradas = async () => {
    const blob = await generarPDFGestionesCajas(null, gestiones);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Gestiones.pdf`;
    link.click();
  };

  const renderMonedaDetails = (gestion: GestionCajaTyped): React.ReactNode => {
    const monedasMap: Record<string, MonedaMapItem> = {};

    gestion.datos_cierre_sistema?.forEach((item) => {
      monedasMap[item.codigoMoneda] = {
        ...monedasMap[item.codigoMoneda],
        sistema: item
      };
    });

    gestion.datos_cierre_usuario?.forEach((item) => {
      monedasMap[item.moneda] = {
        ...monedasMap[item.moneda],
        usuario: item
      };
    });

    const usuarioDetalles = (
      usuario: UsuarioDatos | undefined | null,
      tipo: 'Monto Inicial' | 'Ingresos' | 'Egresos' | 'Acumulado'
    ): number => {
      if (!usuario || !usuario.detalles) return 0;

      let monto = 0;

      usuario.detalles.forEach((detalle) => {
        const metodo = detalle.metodo?.toLowerCase() || '';
        const valor = parseFloat((detalle.monto as any) || 0);

        if (tipo === 'Monto Inicial' && metodo.includes('inicial')) monto += valor;
        if (tipo === 'Ingresos' && !metodo.includes('retiro') && !metodo.includes('inicial'))
          monto += valor;
        if (tipo === 'Egresos' && metodo.includes('retiro')) monto += valor;
      });

      if (tipo === 'Acumulado') {
        const inicial = usuarioDetalles(usuario, 'Monto Inicial');
        const ingresos = usuarioDetalles(usuario, 'Ingresos');
        const egresos = usuarioDetalles(usuario, 'Egresos');
        return inicial + ingresos - egresos;
      }

      return monto;
    };

    return (
      <Fragment>
        {gestion.observaciones && (
          <div className="mb-4 p-3 border rounded bg-light">
            <h5 className="mb-2 text-primary">Observaciones de la Gestión</h5>
            <p className="mb-0">{gestion.observaciones}</p>
          </div>
        )}

        <Table bordered responsive className="mb-0">
          <thead>
            <tr>
              <th>Moneda</th>
              <th>Concepto</th>
              <th>Monto Inicial</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Acumulado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monedasMap).map(([moneda, data], idx, arr) => {
              const usuario = data.usuario;
              const sistema = data.sistema;

              const sistemaEstado = sistema?.estado;
              const usuarioEstado = usuario?.detalles?.find((d) =>
                d.metodo?.toLowerCase().includes('estado')
              )?.monto; // Ajuste si tienes método "estado"

              const getBadgeColor = (estado) =>
                estado === 'A FAVOR' ? 'success' : estado === 'EN CONTRA' ? 'danger' : 'secondary';

              return (
                <Fragment key={moneda}>
                  <tr className="bg-light">
                    <td rowSpan={2} className="fw-bold">
                      {moneda + ' (' + getSimboloMoneda(moneda) + ')'}
                    </td>
                    <td>
                      <strong>Sistema</strong>
                    </td>
                    <td>
                      {getSimboloMoneda(moneda)}
                      {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                        sistema?.montoInicial ?? 0
                      )}
                    </td>
                    <td>
                      {getSimboloMoneda(moneda)}
                      {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                        sistema?.ingresos ?? 0
                      )}
                    </td>
                    <td>
                      {getSimboloMoneda(moneda)}
                      {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                        sistema?.egresos ?? 0
                      )}
                    </td>
                    <td className={sistema?.diferencia >= 0 ? 'text-success' : 'text-danger'}>
                      {getSimboloMoneda(moneda)}
                      {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                        sistema?.diferencia ?? 0
                      )}
                    </td>
                    <td>
                      {sistemaEstado ? (
                        <Badge color={getBadgeColor(sistemaEstado)}>{sistemaEstado}</Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Usuario</strong>
                    </td>
                    <td>
                      {getSimboloMoneda(moneda)}
                      {usuarioDetalles(usuario, 'Monto Inicial').toFixed(2)}
                    </td>
                    <td>
                      {getSimboloMoneda(moneda)}
                      {usuarioDetalles(usuario, 'Ingresos').toFixed(2)}
                    </td>
                    <td>
                      {getSimboloMoneda(moneda)}
                      {usuarioDetalles(usuario, 'Egresos').toFixed(2)}
                    </td>
                    <td
                      className={
                        usuarioDetalles(usuario, 'Acumulado') >= 0 ? 'text-success' : 'text-danger'
                      }
                    >
                      {getSimboloMoneda(moneda)}
                      {usuarioDetalles(usuario, 'Acumulado').toFixed(2)}
                    </td>
                    <td>
                      {usuarioEstado ? (
                        <Badge color={getBadgeColor(usuarioEstado)}>{usuarioEstado}</Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                  {idx !== arr.length - 1 && (
                    <tr>
                      <td colSpan={7} style={{ backgroundColor: '#f1f1f1', height: '4px' }}></td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </Fragment>
    );
  };

  const renderJsonArray = (arr: any[]) => {
    if (!arr || !arr.length) return null;

    // detect array produced by datos_cierre_sistema
    const first = arr[0];
    if (
      first &&
      typeof first === 'object' &&
      ('codigoMoneda' in first || 'moneda' in first) &&
      ('ingresos' in first || 'egresos' in first || 'diferencia' in first)
    ) {
      return (
        <Table size="sm" bordered className="mb-3">
          <thead>
            <tr>
              <th>Moneda</th>
              <th className="text-end">Ingresos</th>
              <th className="text-end">Egresos</th>
              <th className="text-end">Diferencia</th>
              <th className="text-center">Estado</th>
              <th className="text-end">Total usuario</th>
            </tr>
          </thead>
          <tbody>
            {arr.map((item, idx) => (
              <tr key={idx}>
                <td>{item.codigoMoneda || item.moneda || '-'}</td>
                <td className="text-end">
                  {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                    item.ingresos ?? 0
                  )}
                </td>
                <td className="text-end">
                  {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                    item.egresos ?? 0
                  )}
                </td>
                <td className="text-end">
                  {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                    item.diferencia ?? 0
                  )}
                </td>
                <td className="text-center">{item.estado || '-'}</td>
                <td className="text-end">
                  {Intl.NumberFormat('es-ES', { minimumFractionDigits: 0 }).format(
                    item.totalUsuario ?? 0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    // generic renderer (previous behavior)
    return (
      <Table size="sm" bordered className="mb-3">
        <thead>
          <tr>
            <th>Moneda</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {arr.map((item, idx) => (
            <tr key={idx}>
              <td>{item.moneda || item.codigoMoneda || '-'}</td>
              <td>
                {item.detalles ? (
                  <ul className="mb-0">
                    {item.detalles.map((d, j) => (
                      <li key={j}>
                        {d.metodo || d.metodoId || ''}: {d.monto ?? 0}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(item, null, 2)}
                  </pre>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const handleCerrarCaja = async (gestion: GestionCajaTyped) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Cerrar caja',
      text: '¿Seguro que desea cerrar esta caja? Se registrará hora de cierre ahora.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;

    try {
      const input = {
        caja: normalizeCajaId(gestion.caja),
        usuario: gestion.usuario || { nombre: '', cedula: '' },
        administrador: gestion.administrador || { nombre: '', cedula: '' },
        datos_cierre_sistema: [],
        observaciones: 'Cierre ejecutado desde gestor de gestiones'
      };
      const resp = await cierreCaja({ variables: { id: gestion.id, input } });
      if (resp.data?.cierreCaja?.estado) {
        Swal.fire('Listo', 'Caja cerrada correctamente', 'success');
        handleApplyFilters();
      } else {
        Swal.fire('Error', resp.data?.cierreCaja?.message || 'Fallo', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo cerrar la caja', 'error');
    }
  };

  const renderGestionMeta = (gestion: GestionCajaTyped): React.ReactNode => {
    const g: any = gestion;

    const formatDate = (ts?: string | number) => {
      if (!ts) return '-';
      const n = Number(ts);
      if (isNaN(n)) return String(ts);
      return new Date(n).toLocaleDateString(undefined, { timeZone: 'UTC' });
    };

    return (
      <Table size="sm" bordered className="mb-3">
        <tbody>
          <tr>
            <th>Consecutivo</th>
            <td>{gestion.consecutivo || '-'}</td>
          </tr>
          <tr>
            <th>Fecha</th>
            <td>{formatDate(gestion.fecha)}</td>
          </tr>
          <tr>
            <th>Hora apertura</th>
            <td>{gestion.hora_apertura || '-'}</td>
          </tr>
          <tr>
            <th>Hora cierre</th>
            <td>{gestion.hora_cierre || '-'}</td>
          </tr>
          <tr>
            <th>Monto inicial</th>
            <td>{g.monto_inicial ?? '-'}</td>
          </tr>
          <tr>
            <th>Monto total</th>
            <td>{g.monto_total ?? '-'}</td>
          </tr>
          <tr>
            <th>Ingresos</th>
            <td>{g.ingresos ?? 0}</td>
          </tr>
          <tr>
            <th>Egresos</th>
            <td>{g.egresos ?? 0}</td>
          </tr>
          <tr>
            <th>Caja</th>
            <td>
              {(() => {
                const cajaObj = cajas.find((c) => c.id === gestion.caja);
                if (cajaObj) {
                  return (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        // redirect to the cash registers page
                        navigate('/cashregisters');
                      }}
                    >
                      {cajaObj.nombre} {cajaObj.numero || ''}
                    </a>
                  );
                }
                return gestion.caja;
              })()}
            </td>
          </tr>
          {gestion.usuario && (
            <tr>
              <th>Usuario</th>
              <td>
                {gestion.usuario.nombre} ({gestion.usuario.cedula})
              </td>
            </tr>
          )}
          {gestion.administrador && (
            <tr>
              <th>Administrador</th>
              <td>
                {gestion.administrador.nombre} ({gestion.administrador.cedula})
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Gestiones de Caja</h4>

        <Row className={styles.filterRow + ' mb-3'}>
          <Col md="3">
            <FormGroup>
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                name="fechaInicio"
                value={filters.fechaInicio}
                onChange={handleFilterChange}
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Fecha Fin</Label>
              <Input
                type="date"
                name="fechaFin"
                value={filters.fechaFin}
                onChange={handleFilterChange}
              />
            </FormGroup>
          </Col>
          <Col md="6" className={'d-flex align-items-end ' + styles.filterButtons}>
            <Button color="primary" className="me-2" onClick={handleApplyFilters}>
              Buscar Gestiones
            </Button>
            <Button color="light" onClick={handleResetFilters}>
              Limpiar Filtros
            </Button>
            <Button color="success" className="ms-2" onClick={handleExportarGestionesFiltradas}>
              Imprimir PDF
            </Button>
          </Col>
        </Row>

        {loading || loadingAll ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : error || errorAll ? (
          <Alert color="danger">
            Error al cargar las gestiones: {(error || errorAll)?.message}
          </Alert>
        ) : gestiones?.length > 0 ? (
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Caja</th>
                  <th>Módulo</th>
                  <th>Fecha</th>
                  <th>Hora Apertura</th>
                  <th>Hora Cierre</th>
                  <th>Usuario</th>
                  <th>Administrador</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {gestiones.map((gestion, index) => (
                  <Fragment key={gestion.id}>
                    <tr>
                      <td>{index + 1}</td>
                      <td className="text-truncate" title={gestion.id}>
                        {gestion.id || '-'}
                      </td>
                      <td>
                        {(() => {
                          const cajaObj = cajas.find((c) => c.id === gestion.caja);
                          return cajaObj
                            ? `${cajaObj.nombre} ${cajaObj.numero}`
                            : gestion.caja || '-';
                        })()}
                      </td>
                      <td>
                        {(() => {
                          const cajaObj = cajas.find((c) => c.id === gestion.caja);
                          const modText = cajaObj
                            ? cajaObj.modulo === 'Punto_Venta'
                              ? 'Punto de Venta'
                              : cajaObj.modulo === 'Sin_definir'
                                ? 'Sin definir'
                                : cajaObj.modulo
                            : '';
                          return cajaObj ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                // map module text to route
                                const urlMap: { [key: string]: string } = {
                                  Restaurante: '/restaurant',
                                  Recepción: '/reception',
                                  'Punto de Venta': '/cashmovements'
                                };
                                const target = urlMap[modText] || '/';
                                navigate(target);
                              }}
                            >
                              {modText || '-'}
                            </a>
                          ) : (
                            '-'
                          );
                        })()}
                      </td>
                      <td>
                        {new Date(Number(gestion.fecha)).toLocaleDateString(undefined, {
                          timeZone: 'UTC'
                        })}
                      </td>
                      <td>{gestion.hora_apertura || '-'}</td>
                      <td>{gestion.hora_cierre || '-'}</td>
                      <td>
                        {gestion.usuario?.nombre} ({gestion.usuario?.cedula})
                      </td>
                      <td>
                        {gestion.administrador?.nombre
                          ? `${gestion.administrador.nombre} (${gestion.administrador.cedula})`
                          : '-'}
                      </td>
                      <td>
                        {gestion.hora_cierre ? (
                          <Badge color="danger">CERRADA</Badge>
                        ) : (
                          <Badge color="success">ABIERTA</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => openModal(gestion)}
                          title={gestion.id ? `id: ${gestion.id}` : 'sin id'}
                        >
                          Detalles
                        </Button>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Alert color="info" className="mt-3">
            No se encontraron gestiones con los filtros aplicados.
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default CashManagement;
