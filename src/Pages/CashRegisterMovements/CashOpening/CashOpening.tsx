import { useState, useEffect } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '@/services/FacturasParametrosService';
import { APERTURA_CAJA } from '@/services/GestionCajasService';
import { OBTENER_USUARIO_CODIGO } from '@/services/UsuarioService';
import { ABRIR_CAJA } from '@/services/CajasService';
import { useMutation, useQuery } from '@apollo/client';
import Select from 'react-select';
import Swal from 'sweetalert2';
import styles from './CashOpening.module.css';

const CashOpening = ({ cajas, refetchCajas, initialCajaId = '' }) => {
  const { data: dataPaymentMethods } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'paymentMethods' },
    pollInterval: 1000
  });

  const { data: dataCurrencyTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'currencyTypes' },
    pollInterval: 1000
  });

  const [formData, setFormData] = useState({
    cajaId: '',
    montoInicial: '',
    observaciones: ''
  });

  // paymentAmounts kept for compatibility but distribution now inline
  const [paymentAmounts, setPaymentAmounts] = useState([]);
  const [currencyAmounts, setCurrencyAmounts] = useState([]);
  const [apertura_caja] = useMutation(APERTURA_CAJA);
  const [abrir_caja] = useMutation(ABRIR_CAJA);
  const [user, setUser] = useState(null);
  const { data: data_user } = useQuery(OBTENER_USUARIO_CODIGO, {
    variables: { codigo: localStorage.getItem('cedula') },
    pollInterval: 1000
  });

  useEffect(() => {
    if (dataPaymentMethods?.obtenerFacturasParametrosByType) {
      const efectivoMethods = dataPaymentMethods.obtenerFacturasParametrosByType.filter(
        (method) => method.value.toLowerCase() === 'efectivo'
      );

      const initialAmounts = efectivoMethods.map((method) => ({
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
    setUser(data_user?.obtenerUsuarioByCodigo || []);
  }, [data_user]);

  // if parent wants to preselect a caja, do it and load its default amounts
  useEffect(() => {
    if (initialCajaId) {
      setFormData((prev) => ({ ...prev, cajaId: initialCajaId }));
      const cajaSeleccionada = cajas.find((c) => c.id === initialCajaId);
      if (cajaSeleccionada?.montos_apertura?.length > 0) {
        cargarMontosPorDefecto(cajaSeleccionada.montos_apertura);
      }
    }
  }, [initialCajaId, cajas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'cajaId' && value) {
      const cajaSeleccionada = cajas.find((c) => c.id === value);
      if (cajaSeleccionada?.montos_apertura?.length > 0) {
        cargarMontosPorDefecto(cajaSeleccionada.montos_apertura);
      }
    }
  };

  const cargarMontosPorDefecto = (montosApertura) => {
    const resetPaymentAmounts = paymentAmounts.map((p) => ({ ...p, detalles: [] }));
    const resetCurrencyAmounts = currencyAmounts.map((c) => ({ ...c, detalles: [], monto: '' }));

    montosApertura.forEach((montoApertura) => {
      const currencyIndex = resetCurrencyAmounts.findIndex(
        (c) => c.moneda.toLowerCase() === montoApertura.moneda.toLowerCase()
      );

      if (currencyIndex >= 0) {
        resetCurrencyAmounts[currencyIndex].monto = montoApertura.monto.toString();

        if (resetPaymentAmounts.length > 0) {
          const metodoEfectivo = resetPaymentAmounts[0];
          metodoEfectivo.detalles.push({
            monedaId: resetCurrencyAmounts[currencyIndex].monedaId,
            moneda: resetCurrencyAmounts[currencyIndex].moneda,
            monto: montoApertura.monto.toString()
          });
          resetCurrencyAmounts[currencyIndex].detalles = [
            {
              metodoId: metodoEfectivo.metodoId,
              monto: montoApertura.monto.toString()
            }
          ];
        }
      }
    });

    setPaymentAmounts(resetPaymentAmounts);
    setCurrencyAmounts(resetCurrencyAmounts);
  };

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

  const buildMontosHtml = () => {
    if (!currencyAmounts || !currencyAmounts.length) return '';
    let rows = '';
    currencyAmounts.forEach((c) => {
      const monto = parseFloat(c.monto || '0');
      rows += `<tr><td>${c.moneda}</td><td style="text-align:right">${monto.toFixed(2)}</td></tr>`;
    });
    return `<table style="width:100%;text-align:left;font-size:0.9em;border-collapse:collapse"><thead><tr><th>Moneda</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todosMontosEnCero = currencyAmounts.every((currency) => {
      const monto = parseFloat(currency.monto || '0');
      return isNaN(monto) || monto === 0;
    });
    // always show summary first
    const summaryHtml = buildMontosHtml();
    const { isConfirmed: okSummary } = await Swal.fire({
      title: 'Revisar montos de apertura',
      html: summaryHtml || '<em>No hay montos definidos</em>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal-lg' }
    });
    if (!okSummary) return;

    if (todosMontosEnCero) {
      const confirmZero = await Swal.fire({
        title: 'Montos en cero',
        text: 'Todos los montos están en cero. ¿Está seguro de abrir la caja?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f46a6a',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, abrir de todos modos',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmZero.isConfirmed) return;
    } else {
      const { isConfirmed } = await Swal.fire({
        title: '¿Abrir caja?',
        text: '¿Está seguro de realizar la apertura de caja?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Sí, abrir caja',
        cancelButtonText: 'Cancelar'
      });

      if (!isConfirmed) return;
    }

    const now = new Date();
    const aperturaData = {
      caja: formData.cajaId,
      fecha: now.toISOString().split('T')[0],
      hora_apertura: now.toTimeString().slice(0, 8),
      hora_cierre: '',
      usuario: null,
      administrador: null,
      datos_inicio_usuario: currencyAmounts.map((currency) => ({
        monedaId: currency.monedaId,
        moneda: currency.moneda,
        detalles: currency.detalles.map((detalle) => {
          const metodo = paymentAmounts.find((p) => p.metodoId === detalle.metodoId);
          return {
            metodoId: detalle.metodoId,
            metodo: metodo?.metodo || 'Método',
            monto: parseFloat(detalle.monto)
          };
        })
      })),
      datos_cierre_usuario: null,
      datos_cierre_sistema: null,
      cedula: user?.cedula || '',
      observaciones: ''
    };
    try {
      const response = await apertura_caja({ variables: { input: aperturaData } });
      const { estado, message } = response.data.aperturaCaja;

      if (!estado) {
        await Swal.fire('Error', message, 'error');
        return;
      }

      await abrir_caja({ variables: { id: formData.cajaId } });
      await Swal.fire('Éxito', 'Caja abierta correctamente', 'success');

      refetchCajas();
      setFormData({ cajaId: '', montoInicial: '', observaciones: '' });
      setPaymentAmounts(paymentAmounts.map((p) => ({ ...p, detalles: [] })));
      setCurrencyAmounts(currencyAmounts.map((c) => ({ ...c, detalles: [], monto: '' })));
    } catch (error) {
      console.log(error);
      await Swal.fire('Error', 'Ha ocurrido un error inesperado.', 'error');
    }
  };
  const cajaOptions = [
    { value: '', label: 'Seleccione una caja' },
    ...cajas
      .filter((c) => c.estado !== 'ABIERTA')
      .map((caja) => ({
        value: caja.id,
        label: `${caja.nombre} ${caja.numero} - ${caja.modulo === 'Punto_Venta' ? 'Punto de Venta' : caja.modulo}`,
        montos_apertura: caja.montos_apertura || []
      }))
  ];

  return (
    <div className={styles.container}>
      <h4 className="card-title mb-4">Apertura de Caja</h4>

      <div className={styles.cardBody}>
        <Form onSubmit={handleSubmit}>
          <Row className={styles.formSection}>
            <Col md="3" className={styles.selectWrapper}>
              <FormGroup>
                <Label>Caja</Label>
                <Select
                  name="cajaId"
                  value={cajaOptions.find((option) => option.value === formData.cajaId)}
                  onChange={(selectedOption) =>
                    handleChange({
                      target: {
                        name: 'cajaId',
                        value: selectedOption ? selectedOption.value : ''
                      }
                    })
                  }
                  options={cajaOptions}
                  placeholder="Seleccione una caja"
                  classNamePrefix="select2-selection"
                  isSearchable
                />
                {cajaOptions.length === 1 && (
                  <div className="text-muted small mt-1">
                    No hay cajas disponibles para apertura.
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* distribution inputs inline */}
          <Row className={`mt-3 ${styles.formSection}`}>
            <Col>
              <h5>Distribución por Moneda</h5>
              {currencyAmounts.length ? (
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>Moneda</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencyAmounts.map((currency) => (
                      <tr key={currency.monedaId}>
                        <td>{currency.moneda}</td>
                        <td className={styles.inputCell} style={{ width: '140px' }}>
                          <Input
                            type="number"
                            value={currency.monto}
                            onChange={(e) =>
                              handleDirectAmountChange(0, currency.monedaId, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-muted">Seleccione una caja para ver montos.</div>
              )}
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button type="submit" color="primary" disabled={!formData.cajaId}>
              <i className="bx bx-folder-plus me-1"></i> Abrir Caja
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CashOpening;
