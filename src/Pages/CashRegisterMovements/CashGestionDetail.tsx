import { Fragment, useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardBody, Spinner, Alert, Table, Button, Badge } from 'reactstrap';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { OBTENER_GESTION_CAJA_BY_ID } from '@/services/GestionCajasService';
import { OBTENER_CAJA_BY_ID } from '@/services/CajasService';

// reuse some of the helper types from CashManagement for typing
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
interface MonedaMapItem {
  sistema?: UsuarioDatos;
  usuario?: UsuarioDatos;
}

// generics to match what the server returns; we keep loose so the detail view
// doesn't depend on a generated schema file.
interface CierreUsuarioMoneda {
  moneda: string;
  detalles: Array<{ metodo?: string; monto?: number }>;
}
interface CierreSistemaMoneda {
  codigoMoneda: string;
  montoInicial?: number;
  ingresos?: number;
  egresos?: number;
  diferencia?: number;
  estado?: string;
}

// we don't need to export this type, but we duplicate the definition used in
// CashManagement because the query returns the same structure.
type GestionCajaTyped = {
  id: string;
  caja?: string;
  consecutivo?: string;
  fecha?: string;
  hora_apertura?: string;
  hora_cierre?: string;
  usuario?: { nombre?: string; cedula?: string };
  administrador?: { nombre?: string; cedula?: string };
  datos_inicio_usuario?: any;
  datos_cierre_usuario?: CierreUsuarioMoneda[] | null;
  datos_cierre_sistema?: CierreSistemaMoneda[] | null;
  observaciones?: string;
};

const CashGestionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // fetch gestion details
  const { data, loading, error } = useQuery<{ obtenerGestionCajaById: GestionCajaTyped }>(
    OBTENER_GESTION_CAJA_BY_ID,
    {
      variables: { id },
      skip: !id // do not run if id is undefined
    }
  );

  const gestion = data?.obtenerGestionCajaById;

  // look up caja metadata so we can display name/number instead of raw id
  const [cajaInfo, setCajaInfo] = useState<any>(null);
  const [fetchCajaById, { data: cajaData }] = useLazyQuery(OBTENER_CAJA_BY_ID);

  useEffect(() => {
    if (gestion && gestion.caja) {
      fetchCajaById({ variables: { id: gestion.caja } });
    }
  }, [gestion, fetchCajaById]);

  useEffect(() => {
    if (cajaData?.obtenerCajaById) {
      setCajaInfo(cajaData.obtenerCajaById);
    }
  }, [cajaData]);

  // debug output for development
  console.log('gestion detail page', { id, data, gestion, error });

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
            {Object.entries(monedasMap).map(([moneda, data], idx) => (
              <Fragment key={idx}>
                <tr>
                  <td rowSpan={2}>{moneda}</td>
                  <td>Sistema</td>
                  <td>{data.sistema?.montoInicial ?? 0}</td>
                  <td>{data.sistema?.ingresos ?? 0}</td>
                  <td>{data.sistema?.egresos ?? 0}</td>
                  <td>{data.sistema?.diferencia ?? 0}</td>
                  <td>
                    {data.sistema?.estado === 'A FAVOR' ? (
                      <Badge color="success">A FAVOR</Badge>
                    ) : (
                      data.sistema?.estado || '-'
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Usuario</td>
                  <td>{usuarioDetalles(data.usuario, 'Monto Inicial')}</td>
                  <td>{usuarioDetalles(data.usuario, 'Ingresos')}</td>
                  <td>{usuarioDetalles(data.usuario, 'Egresos')}</td>
                  <td>{usuarioDetalles(data.usuario, 'Acumulado')}</td>
                  <td>{data.usuario?.estado || '-'}</td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </Table>
      </Fragment>
    );
  };

  const renderJsonArray = (arr: any[]) => {
    if (!arr || !arr.length) return null;

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
              <th>Monto Inicial</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {arr.map((item, idx) => (
              <tr key={idx}>
                <td>{item.codigoMoneda || item.moneda}</td>
                <td>{item.montoInicial ?? '-'}</td>
                <td>{item.ingresos ?? '-'}</td>
                <td>{item.egresos ?? '-'}</td>
                <td>{item.diferencia ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

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
              <td>{item.moneda || item.codigoMoneda || idx}</td>
              <td>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(item, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderInicioUsuario = (arr: any[]) => {
    if (!arr || !arr.length) return null;
    return (
      <Fragment>
        <h5 className="mt-4">Montos iniciales del usuario</h5>
        <Table bordered responsive className="mb-0">
          <thead>
            <tr>
              <th>Moneda</th>
              <th>Método</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {arr.map((item, idx) =>
              item && item.moneda && item.detalles
                ? item.detalles.map((d, j) => (
                    <tr key={`${idx}-${j}`}>
                      <td>{item.moneda}</td>
                      <td>{d.metodo || '-'}</td>
                      <td>{d.monto ?? '-'}</td>
                    </tr>
                  ))
                : null
            )}
          </tbody>
        </Table>
      </Fragment>
    );
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
            <td>{g.consecutivo || '-'}</td>
          </tr>
          <tr>
            <th>Fecha</th>
            <td>{formatDate(g.fecha)}</td>
          </tr>
          <tr>
            <th>Hora apertura</th>
            <td>{g.hora_apertura || '-'}</td>
          </tr>
          <tr>
            <th>Hora cierre</th>
            <td>{g.hora_cierre || '-'}</td>
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
            <td>{g.ingresos ?? '-'}</td>
          </tr>
          <tr>
            <th>Egresos</th>
            <td>{g.egresos ?? '-'}</td>
          </tr>
          <tr>
            <th>Caja</th>
            <td>
              {cajaInfo ? (
                <Link to={`/editcashregister/${cajaInfo.id}`}>
                  {`${cajaInfo.nombre} ${cajaInfo.numero}`}
                </Link>
              ) : g.caja ? (
                <Link to={`/editcashregister/${g.caja}`}>{g.caja}</Link>
              ) : (
                '-'
              )}
            </td>
          </tr>
          {gestion.usuario && (gestion.usuario.nombre || gestion.usuario.cedula) && (
            <tr>
              <th>Usuario</th>
              <td>
                {(gestion.usuario.nombre || '-') +
                  (gestion.usuario.cedula ? ` (${gestion.usuario.cedula})` : '')}
              </td>
            </tr>
          )}
          {gestion.administrador &&
            (gestion.administrador.nombre || gestion.administrador.cedula) && (
              <tr>
                <th>Administrador</th>
                <td>
                  {(gestion.administrador.nombre || '-') +
                    (gestion.administrador.cedula ? ` (${gestion.administrador.cedula})` : '')}
                </td>
              </tr>
            )}
        </tbody>
      </Table>
    );
  };

  if (!id) {
    return (
      <Card>
        <CardBody>
          <Breadcrumb title="Cajas" breadcrumbItem="Detalle" breadcrumbItemUrl="/cashmovements" />
          <Button color="link" onClick={() => navigate(-1)} className="mb-3">
            &larr; Volver
          </Button>
          <Alert color="warning">ID de gestión inválido</Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Breadcrumb title="Cajas" breadcrumbItem="Detalle" breadcrumbItemUrl="/cashmovements" />
        <Button color="link" onClick={() => navigate(-1)} className="mb-3">
          &larr; Volver
        </Button>
        <h4 className="card-title mb-4">Detalles de gestión</h4>
        {loading ? (
          <div className="text-center my-5">
            <Spinner />
          </div>
        ) : error ? (
          <Alert color="danger">Error: {error.message}</Alert>
        ) : gestion ? (
          <Fragment>
            <h5>Detalles Generales</h5>
            {renderGestionMeta(gestion)}
            <h5 className="mt-4">Detalles Financieros</h5>
            {renderMonedaDetails(gestion)}
            {renderInicioUsuario(gestion.datos_inicio_usuario)}
          </Fragment>
        ) : (
          <Alert color="info">
            No se encontró la gestión solicitada.
            {id && (
              <div>
                ID buscada: <code>{id}</code>
              </div>
            )}
            {data && !gestion && (
              <div style={{ fontSize: '0.8em', marginTop: '0.5em' }}>
                <strong>Respuesta del servidor:</strong>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </Alert>
        )}
      </CardBody>
    </Card>
  );
};

export default CashGestionDetail;
