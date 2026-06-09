import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { REGISTRAR_MOVIMIENTO_CAJA } from '@/services/MovimientosCajasService';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '@/services/FacturasParametrosService';
import { OBTENER_GESTION_ACTUAL } from '@/services/GestionCajasService';
import { OBTENER_CAJA_BY_MODULO } from '@/services/CajasService';
import { OBTENER_USUARIO_CODIGO } from '@/services/UsuarioService';
import Select from 'react-select';
import { Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import styles from './MovementRegistration.module.css';
import { showInfoAlert, showSweetConfirmation } from '@/helpers/alert';
import { OBTENER_CAJAS } from '@/services/CajasService';

// State for the form; tipo may be empty or one of the three kinds
interface FormState {
  tipo: '' | 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA';
  monto: number;
  medioPago: string;
  codigoMoneda: string;
  modulo: string;
  observaciones: string;
  // in a transfer, the user picks another caja by id; moduloDestino is derived
  cajaDestino: string;
  moduloDestino: string;
}

const MovementRegistration = () => {
  const navigate = useNavigate();

  const { data: dataCajas } = useQuery(OBTENER_CAJAS, { pollInterval: 1000 });
  const openCajas =
    dataCajas?.obtenerCajas
      ?.filter((c) => c.estado === 'ABIERTA')
      .slice()
      .sort((a, b) => {
        const ta = a.id ? parseInt(a.id.substring(0, 8), 16) : 0;
        const tb = b.id ? parseInt(b.id.substring(0, 8), 16) : 0;
        return tb - ta;
      }) || [];
  const cajaOptions = openCajas.map((c) => {
    const modText =
      c.modulo === 'Punto_Venta'
        ? 'Punto de Venta'
        : c.modulo === 'Sin_definir'
          ? 'Sin definir'
          : c.modulo;
    return {
      value: c.id,
      label: `${c.nombre} ${c.numero} (${modText})`,
      modulo: c.modulo
    };
  });
  const [selectedCaja, setSelectedCaja] = useState(null);

  const { data: dataCurrencyTypes, loading: loadingCurrencies } = useQuery(
    OBTENER_FACTURAS_PARAMETROS_BY_TYPE,
    { variables: { type: 'currencyTypes' }, pollInterval: 1000 }
  );

  const { data: dataPaymentMethods, loading: loadingPaymentMethods } = useQuery(
    OBTENER_FACTURAS_PARAMETROS_BY_TYPE,
    { variables: { type: 'paymentMethods' }, pollInterval: 1000 }
  );
  const { data: data_user } = useQuery(OBTENER_USUARIO_CODIGO, {
    variables: { codigo: localStorage.getItem('cedula') },
    pollInterval: 1000
  });

  const [formState, setFormState] = useState<FormState>({
    tipo: '',
    monto: 0,
    medioPago: '',
    codigoMoneda: '',
    modulo: '',
    observaciones: '',
    cajaDestino: '',
    moduloDestino: ''
  });

  // log and sanitize when the movement type changes; helps debugging why the
  // payment field might still render and ensures we don't keep a stale value.
  useEffect(() => {
    console.debug('tipo changed to', formState.tipo);
    if (formState.tipo !== 'ENTRADA' && formState.medioPago) {
      setFormState((prev) => ({ ...prev, medioPago: '' }));
    }
  }, [formState.tipo]);

  const [cajaActual, setCajaActual] = useState(null);
  const [gestionActual, setGestionActual] = useState(null);
  const [cajaDestino, setCajaDestino] = useState(null);
  const [gestionDestino, setGestionDestino] = useState(null);
  const [selectedCajaDestino, setSelectedCajaDestino] = useState(null);

  const handleCajaDestinoChange = (option) => {
    setSelectedCajaDestino(option);
    if (option) {
      const destObj = openCajas.find((c) => c.id === option.value);
      setCajaDestino(destObj || null);
      setFormState((prev) => ({
        ...prev,
        cajaDestino: option.value,
        moduloDestino: destObj?.modulo || ''
      }));
    } else {
      setCajaDestino(null);
      setFormState((prev) => ({
        ...prev,
        cajaDestino: '',
        moduloDestino: ''
      }));
    }
  };
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const { data: cajaData, loading: loadingCaja } = useQuery(OBTENER_CAJA_BY_MODULO, {
    variables: { modulo: formState.modulo },
    skip: !formState.modulo,
    onCompleted: (data) => {
      if (data?.obtenerCajaByModulo) {
        setCajaActual(data.obtenerCajaByModulo);
      } else {
        setError(`No se encontró caja para el módulo ${formState.modulo}`);
        setCajaActual(null);
        setGestionActual(null);
      }
    },
    onError: (error) => {
      setError(`Error al buscar caja: ${error.message}`);
    }
  });

  const { data: gestionData, loading: loadingGestion } = useQuery(OBTENER_GESTION_ACTUAL, {
    variables: { caja: cajaActual?.id },
    skip: !cajaActual?.id,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const gestion = data?.obtenerGestionActual;

      // Validación extra por si backend falla
      if (!gestion || gestion.hora_cierre || gestion.estado === 'CERRADA') {
        setError(`No hay una gestión abierta para la caja de ${formState.modulo}`);
        setGestionActual(null);
        return;
      }

      setGestionActual(gestion);
    },
    onError: (error) => {
      setError(`Error al buscar gestión: ${error.message}`);
    }
  });

  // when transfering we simply pick a destination caja directly; the object
  // is stored in `cajaDestino` state via the selector below.

  const { data: gestionDestinoData, loading: loadingGestionDestino } = useQuery(
    OBTENER_GESTION_ACTUAL,
    {
      variables: { caja: cajaDestino?.id },
      skip: !cajaDestino?.id || formState.tipo !== 'TRANSFERENCIA',
      onCompleted: (data) => {
        if (data?.obtenerGestionActual) {
          setGestionDestino(data.obtenerGestionActual);
        } else {
          setError('No hay una gestión abierta para la caja destino');
          setGestionDestino(null);
        }
      },
      onError: (error) => {
        setError(`Error al buscar gestión destino: ${error.message}`);
      }
    }
  );

  const [registrarMovimiento] = useMutation(REGISTRAR_MOVIMIENTO_CAJA);

  useEffect(() => {
    setUser(data_user?.obtenerUsuarioByCodigo || []);
  }, [data_user]);

  useEffect(() => {
    setError('');
  }, [formState.modulo, formState.cajaDestino, formState.tipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === 'monto' ? parseFloat(value) || 0 : value
    });
  };

  const handleSelectChange = (name: keyof FormState, selectedOption: { value: any } | null) => {
    setFormState({
      ...formState,
      [name]: selectedOption ? selectedOption.value : ''
    } as any);
  };

  const handleCajaChange = (option) => {
    setSelectedCaja(option);
    // when selecting a caja, set modulo so the other queries fire
    if (option) {
      setFormState((prev) => ({ ...prev, modulo: option.modulo }));
    } else {
      setFormState((prev) => ({ ...prev, modulo: '' }));
    }
    // also clear any previously chosen destination
    setSelectedCajaDestino(null);
    setCajaDestino(null);
    setFormState((prev) => ({
      ...prev,
      cajaDestino: '',
      moduloDestino: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!formState.tipo) {
      setError('Por favor seleccione un tipo de movimiento');
      return;
    }

    // ask user to confirm before proceeding
    const proceed = await showSweetConfirmation(
      'Confirmar movimiento',
      '¿Está seguro que desea registrar este movimiento de caja?'
    );
    if (!proceed) {
      return;
    }

    if (!gestionActual?.id) {
      setError('No hay una gestión de caja abierta para el módulo seleccionado');
      return;
    }

    if (formState.monto <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    if (formState.tipo === 'TRANSFERENCIA') {
      if (!formState.cajaDestino) {
        setError('Para transferencia debe seleccionar una caja destino');
        return;
      }

      if (!gestionDestino?.id) {
        setError('No hay una gestión abierta para la caja destino');
        return;
      }

      if (formState.cajaDestino === selectedCaja?.value) {
        setError('No puede transferir a la misma caja de origen');
        return;
      }

      if (!formState.codigoMoneda) {
        setError('Por favor seleccione una moneda para la transferencia');
        return;
      }
    } else {
      if (!formState.codigoMoneda) {
        setError('Por favor seleccione una moneda');
        return;
      }

      if (formState.tipo === 'ENTRADA' && !formState.medioPago) {
        setError('Por favor seleccione un método de pago');
        return;
      }
    }

    try {
      if (formState.tipo === 'TRANSFERENCIA') {
        const destinoModulo = cajaDestino?.modulo || '';
        const movimientoSalida = {
          gestionCaja: gestionActual.id,
          tipo: 'SALIDA',
          monto: formState.monto,
          medioPago: 'Efectivo',
          codigoMoneda: formState.codigoMoneda,
          modulo: formState.modulo,
          observaciones: `Transferencia a caja ${cajaDestino?.nombre || ''} ${
            cajaDestino?.numero || ''
          } (${destinoModulo === 'Punto_Venta' ? 'Punto de Venta' : destinoModulo}): ${
            formState.observaciones || 'Sin observaciones'
          }`,
          cedula: user.cedula
        };

        const movimientoEntrada = {
          gestionCaja: gestionDestino.id,
          tipo: 'ENTRADA',
          monto: formState.monto,
          medioPago: 'Efectivo',
          codigoMoneda: formState.codigoMoneda,
          modulo: destinoModulo,
          observaciones: `Transferencia desde módulo ${
            formState.modulo === 'Punto_Venta' ? 'Punto de Venta' : formState.modulo
          }: ${formState.observaciones || 'Sin observaciones'}`,
          cedula: user.cedula
        };
        const [salidaResult, entradaResult] = await Promise.all([
          registrarMovimiento({
            variables: { gestionCaja: gestionActual.id, input: movimientoSalida }
          }),
          registrarMovimiento({
            variables: { gestionCaja: gestionDestino.id, input: movimientoEntrada }
          })
        ]);

        if (
          salidaResult.data.registrarMovimiento.estado &&
          entradaResult.data.registrarMovimiento.estado
        ) {
          showInfoAlert({
            title: 'Excelente',
            text: 'Transferencia de cajas realizada correctamente',
            icon: 'success',
            timer: 3000,
            position: 'center'
          });
          resetForm();
        } else {
          setError(
            'Error en la transferencia: ' +
              (salidaResult.data.registrarMovimiento.message ||
                entradaResult.data.registrarMovimiento.message)
          );
        }
      } else {
        delete formState.moduloDestino;
        delete formState.cajaDestino;
        const { data } = await registrarMovimiento({
          variables: {
            gestionCaja: gestionActual.id,
            input: { gestionCaja: gestionActual.id, ...formState, cedula: user.cedula }
          }
        });

        if (data.registrarMovimiento.estado) {
          showInfoAlert({
            title: 'Excelente',
            text: 'Movimiento de caja enviado correctamente',
            icon: 'success',
            timer: 3000,
            position: 'center'
          });
          // notify other components (e.g. Movimientos) that a new record exists
          window.dispatchEvent(
            new CustomEvent('movimientoRegistrado', { detail: { cajaId: selectedCaja?.value } })
          );
          resetForm();
        } else {
          setError(data.registrarMovimiento.message);
        }
      }
    } catch (err) {
      setError('Error al registrar el movimiento: ' + err.message);
    }
  };

  const resetForm = (fullReset = true) => {
    setFormState((prev) => ({
      ...prev,
      monto: 0,
      observaciones: '',
      ...(fullReset
        ? {
            tipo: '',
            medioPago: '',
            codigoMoneda: '',
            modulo: '',
            cajaDestino: '',
            moduloDestino: ''
          }
        : {})
    }));
    if (fullReset) {
      setSelectedCajaDestino(null);
      setCajaDestino(null);
    }
  };

  const currencyOptions =
    dataCurrencyTypes?.obtenerFacturasParametrosByType.map((currency) => ({
      value: currency.value,
      label: currency.label || currency.value
    })) || [];

  const paymentMethodOptions =
    dataPaymentMethods?.obtenerFacturasParametrosByType.map((method) => ({
      value: method.value,
      label: method.label || method.value
    })) || [];

  const tipoMovimientoOptions = [
    { value: 'ENTRADA', label: 'Entrada' },
    { value: 'SALIDA', label: 'Salida' },
    { value: 'TRANSFERENCIA', label: 'Transferencia entre cajas' }
  ];

  if (loadingCurrencies || loadingPaymentMethods) {
    return <div>Cargando opciones...</div>;
  }

  return (
    <div className={styles.formContainer}>
      <h2 className="mb-4">Registrar Movimiento de Caja</h2>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className={styles.twoCol}>
        <div className={styles.formGroup + ' ' + styles.fullWidth}>
          <label className={styles.formLabel}>Caja (gestión activa):</label>
          {cajaOptions.length ? (
            <Select
              name="caja"
              value={cajaOptions.find((opt) => opt.value === selectedCaja?.value) || null}
              onChange={handleCajaChange}
              options={cajaOptions}
              classNamePrefix="select2-selection"
              className={styles.selectControl}
              isSearchable={true}
              menuPosition="fixed"
              placeholder="Seleccione una caja abierta"
            />
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-danger">No hay cajas abiertas.</span>
              <Button color="primary" size="sm" onClick={() => navigate('/apertura')}>
                Abrir caja
              </Button>
            </div>
          )}
        </div>

        {selectedCaja && (
          <div className={styles.formGroup + ' ' + styles.fullWidth}>
            <label className={styles.formLabel}>Tipo de Movimiento:</label>
            <Select
              name="tipo"
              value={tipoMovimientoOptions.find((option) => option.value === formState.tipo)}
              onChange={(selectedOption) => handleSelectChange('tipo', selectedOption)}
              options={tipoMovimientoOptions}
              classNamePrefix="select2-selection"
              className={styles.selectControl}
              isSearchable={true}
              menuPosition="fixed"
              placeholder="Seleccione tipo de movimiento"
            />
          </div>
        )}

        {formState.tipo && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Módulo Origen:</label>
              <Input
                type="text"
                readOnly
                value={selectedCaja?.modulo || ''}
                className={styles.inputPlain}
              />
            </div>

            {formState.tipo === 'TRANSFERENCIA' && formState.modulo && (
              <div className={styles.formGroup + ' ' + styles.fullWidth}>
                <label className={styles.formLabel}>Caja Destino:</label>
                <Select
                  name="cajaDestino"
                  value={
                    selectedCajaDestino ||
                    (cajaDestino
                      ? {
                          value: cajaDestino.id,
                          label: `${cajaDestino.nombre} ${cajaDestino.numero}`
                        }
                      : null)
                  }
                  onChange={handleCajaDestinoChange}
                  options={cajaOptions.filter((opt) => opt.value !== selectedCaja?.value)}
                  classNamePrefix="select2-selection"
                  className={styles.selectControl}
                  isSearchable={true}
                  menuPosition="fixed"
                  placeholder="Seleccione una caja destino"
                  isDisabled={loadingGestionDestino}
                />
                {loadingGestionDestino && (
                  <small className="text-muted">Buscando gestión destino...</small>
                )}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Moneda:</label>
              <Select
                id="tipo_moneda"
                value={currencyOptions.find((option) => option.value === formState.codigoMoneda)}
                onChange={(selectedOption) => handleSelectChange('codigoMoneda', selectedOption)}
                options={currencyOptions}
                classNamePrefix="select2-selection"
                className={styles.selectControl}
                isSearchable={true}
                menuPosition="fixed"
                placeholder="Seleccione una moneda"
              />
            </div>

            {/* only ask for payment method when it's a cash-in (ENTRADA) */}
            {formState.tipo === 'ENTRADA' && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Medio de Pago:</label>
                <Select
                  id="medio_pago"
                  value={paymentMethodOptions.find(
                    (option) => option.value === formState.medioPago
                  )}
                  onChange={(selectedOption) => handleSelectChange('medioPago', selectedOption)}
                  options={paymentMethodOptions}
                  classNamePrefix="select2-selection"
                  className={styles.selectControl}
                  isSearchable={true}
                  menuPosition="fixed"
                  placeholder="Seleccione un método"
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Monto:</label>
              <Input
                type="number"
                name="monto"
                value={formState.monto}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <small className={styles.helperText}>
                Ingrese el monto en la moneda seleccionada
              </small>
            </div>

            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label className={styles.formLabel}>Observaciones:</label>
              <textarea
                name="observaciones"
                value={formState.observaciones}
                onChange={handleChange}
                className="form-control"
                rows={3}
                placeholder="Descripción del movimiento"
              />
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !formState.tipo ||
                  !gestionActual ||
                  loadingCaja ||
                  loadingGestion ||
                  (formState.tipo === 'TRANSFERENCIA' &&
                    (!formState.cajaDestino || !gestionDestino || loadingGestionDestino)) ||
                  (formState.tipo === 'ENTRADA' && !formState.medioPago)
                }
              >
                {loadingCaja || loadingGestion || loadingGestionDestino
                  ? 'Cargando...'
                  : formState.tipo === 'TRANSFERENCIA'
                    ? 'Realizar Transferencia'
                    : 'Registrar Movimiento'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MovementRegistration;
