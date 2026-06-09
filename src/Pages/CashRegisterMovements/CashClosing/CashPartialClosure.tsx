import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { Card, CardBody, Button, Input, Table, Badge, Spinner, Alert } from 'reactstrap';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { OBTENER_CAJA_BY_ID } from '@/services/CajasService';
import { OBTENER_GESTION_ACTUAL, CIERRE_PARCIAL } from '@/services/GestionCajasService';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '@/services/FacturasParametrosService';
import { OBTENER_USUARIO_CODIGO } from '@/services/UsuarioService';
import { CERRAR_PARCIALMENTE_CAJA } from '@/services/CajasService';
import { OBTENER_MOVIMIENTOS_DE_GESTION } from '@/services/MovimientosCajasService';
import { getSimboloMoneda } from '@/helpers/helpers';
import Swal from 'sweetalert2';
import { Query, Usuario } from '@/gql/graphql';

function formatDateTime(value: string | number | null | undefined) {
  if (!value) return '';
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return String(value);
  const d = new Date(num);
  return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour12: false });
}

const CashPartialClosure = () => {
  const navigate = useNavigate();
  const { cajaId } = useParams<{ cajaId: string }>();
  const location = useLocation();

  const { data: cajaData, loading: loadingCaja } = useQuery<Query>(OBTENER_CAJA_BY_ID, {
    variables: { id: cajaId },
    skip: !cajaId
  });

  const caja = cajaData?.obtenerCajaById;

  const [gestionActual, setGestionActual] = useState<any>(null);
  const [fetchGestion] = useLazyQuery(OBTENER_GESTION_ACTUAL);
  const [loadingGestion, setLoadingGestion] = useState(false);

  const { data: dataPaymentMethods } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'paymentMethods' }
  });
  const { data: dataCurrencyTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'currencyTypes' }
  });
  const { data: data_user } = useQuery<Query>(OBTENER_USUARIO_CODIGO, {
    variables: { codigo: localStorage.getItem('cedula') }
  });

  const [paymentAmounts, setPaymentAmounts] = useState<any[]>([]);
  const [currencyAmounts, setCurrencyAmounts] = useState<any[]>([]);
  const [user, setUser] = useState<Usuario>(null);

  useEffect(() => {
    if (dataPaymentMethods?.obtenerFacturasParametrosByType) {
      const initial = dataPaymentMethods.obtenerFacturasParametrosByType.map((m) => ({
        metodoId: m.id,
        metodo: m.value,
        detalles: []
      }));
      setPaymentAmounts(initial);
    }
  }, [dataPaymentMethods]);

  useEffect(() => {
    if (dataCurrencyTypes?.obtenerFacturasParametrosByType) {
      const initial = dataCurrencyTypes.obtenerFacturasParametrosByType.map((c) => ({
        monedaId: c.id,
        moneda: c.value,
        monto: '',
        detalles: []
      }));
      setCurrencyAmounts(initial);
    }
  }, [dataCurrencyTypes]);

  useEffect(() => {
    setUser(data_user?.obtenerUsuarioByCodigo || null);
  }, [data_user]);

  const getGestionActual = async (id) => {
    setLoadingGestion(true);
    try {
      const { data } = await fetchGestion({ variables: { caja: id } });
      if (data && data.obtenerGestionActual) {
        setGestionActual(data.obtenerGestionActual);
      }
    } catch (e) {
      console.error('error fetching gestion', e);
    } finally {
      setLoadingGestion(false);
    }
  };

  useEffect(() => {
    if (cajaId) {
      getGestionActual(cajaId);
    }
  }, [cajaId]);

  const calculateCurrencyTotal = (monedaId) => {
    let total = 0;
    paymentAmounts.forEach((p) => {
      const det = p.detalles.find((d) => d.monedaId === monedaId);
      if (det) total += parseFloat(det.monto) || 0;
    });
    return total.toFixed(2);
  };

  const handleDirectAmountChange = (paymentIndex, currencyId, value) => {
    const updated = [...paymentAmounts];
    const payment = updated[paymentIndex];
    const idx = payment.detalles.findIndex((d) => d.monedaId === currencyId);
    if (idx >= 0) {
      if (value === '' || parseFloat(value) <= 0) {
        payment.detalles.splice(idx, 1);
      } else {
        payment.detalles[idx].monto = parseFloat(value);
      }
    } else if (value !== '' && parseFloat(value) > 0) {
      payment.detalles.push({ monedaId: currencyId, monto: parseFloat(value) });
    }
    setPaymentAmounts(updated);
  };

  const [obtener_movimientos] = useLazyQuery(OBTENER_MOVIMIENTOS_DE_GESTION);
  const [cierreParcialGestion] = useMutation(CIERRE_PARCIAL);
  const [cierreParcialCaja] = useMutation(CERRAR_PARCIALMENTE_CAJA);

  const handleCierreParcial = async () => {
    // guard: caja must be open
    const cajaAbierta = caja?.estado === 'ABIERTA' || caja?.estado === 'CIERRE_PARCIAL';
    if (!cajaAbierta) {
      await Swal.fire('Error', 'La caja seleccionada no está abierta.', 'error');
      return;
    }
    if (!gestionActual) {
      await Swal.fire('Error', 'No existe una gestión activa para la caja.', 'error');
      return;
    }
    if (gestionActual.hora_cierre) {
      await Swal.fire('Error', 'La caja seleccionada no está abierta.', 'error');
      return;
    }

    // assemble datos_cierre_usuario array
    const datos = [];
    paymentAmounts.forEach((p) => {
      p.detalles.forEach((d) => {
        const moneda = currencyAmounts.find((c) => c.monedaId === d.monedaId)?.moneda || '';
        let entry = datos.find((e) => e.moneda === moneda);
        if (!entry) {
          entry = { moneda, detalles: [] };
          datos.push(entry);
        }
        entry.detalles.push({ metodo: p.metodo, monto: d.monto });
      });
    });

    try {
      const { data: cierreResp } = await cierreParcialGestion({
        variables: {
          id: gestionActual.id,
          input: {
            usuario: user ? { cedula: user.cedula, nombre: user.nombre } : null,
            datos_cierre_usuario: datos
          }
        }
      });
      if (!cierreResp?.cierreParcialCaja?.estado) {
        throw new Error(cierreResp?.cierreParcialCaja?.message || 'Error en el cierre parcial');
      }

      // mark caja itself as partial
      const { data: cajaResp } = await cierreParcialCaja({ variables: { id: caja.id } });
      if (!cajaResp?.cierreParcial?.estado) {
        console.warn('error marking caja partial', cajaResp?.cierreParcial?.message);
      }

      Swal.fire('Éxito', 'Cierre parcial guardado', 'success');
      navigate(-1);
    } catch (err) {
      console.error('error performing partial closure', err);
      Swal.fire('Error', err.message || 'Falló el cierre parcial', 'error');
    }
  };

  if (loadingCaja) return <Spinner />;

  return (
    <Card>
      <CardBody>
        <Breadcrumb
          title="Cajas"
          breadcrumbItem="Cierre Parcial"
          breadcrumbItemUrl="/cashmovements"
        />
        <h4 className="card-title mb-4">Cierre Parcial - {caja?.nombre}</h4>
        {/* info about gestion */}
        {loadingGestion ? (
          <Spinner size="sm" />
        ) : gestionActual ? (
          <div className="mb-3 text-muted">
            <strong>Gestión:</strong> {gestionActual.consecutivo} <strong>Fecha apertura:</strong>{' '}
            {formatDateTime(gestionActual.fecha)} {gestionActual.hora_apertura || ''}
          </div>
        ) : (
          <Alert color="danger">No existe gestión activa.</Alert>
        )}
        {/* table of amounts */}
        <div className="table-responsive">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Método de Pago</th>
                {currencyAmounts.map((currency) => (
                  <th key={currency.monedaId}>
                    {currency.moneda} ({getSimboloMoneda(currency.moneda)})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentAmounts.map((payment, pIndex) => (
                <tr key={pIndex}>
                  <td>{payment.metodo}</td>
                  {currencyAmounts.map((currency) => {
                    const detalle = payment.detalles.find((d) => d.monedaId === currency.monedaId);
                    return (
                      <td key={currency.monedaId}>
                        <Input
                          type="number"
                          value={detalle?.monto || ''}
                          onChange={(e) =>
                            handleDirectAmountChange(pIndex, currency.monedaId, e.target.value)
                          }
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="text-end"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="text-end">Total por Moneda</th>
                {currencyAmounts.map((currency) => (
                  <td key={currency.monedaId} className="text-end" style={{ fontSize: '1.2rem' }}>
                    <Badge color="primary">
                      {getSimboloMoneda(currency.moneda) +
                        Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                          parseFloat(calculateCurrencyTotal(currency.monedaId))
                        )}
                    </Badge>
                  </td>
                ))}
              </tr>
            </tfoot>
          </Table>
        </div>
        <div className="mt-3 d-flex justify-content-end gap-2">
          <Button color="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleCierreParcial}>
            Guardar Cierre Parcial
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CashPartialClosure;
