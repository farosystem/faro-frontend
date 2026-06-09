import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import Select from 'react-select';
import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '../../services/FacturasParametrosService';
import { OBTENER_TODAS_MATERIAS_PRIMAS } from '../../services/MateriaPrimaService';
import ButtonIconTable from '../../components/Common/ButtonIconTable';
import { OBTENER_CLIENTES } from '../../services/ClienteService';
import Swal from 'sweetalert2';
import { GUARDAR_PAGO_PARCIAL } from '../../services/PagoParcialService';
import { UPDATE_RESERVA_INFO } from '../../services/ReservaService';
import { useYupValidationResolver } from '../../helpers/yupValidations';
import * as yup from 'yup';
import { FfeClient } from '@/lib/ffeClient';

const validationSchema = yup.object({
  CondicionVenta: yup.object().required('Campo requerido'),
  TipoDocumento: yup.object().required('Campo requerido'),
  CodigoMoneda: yup.object().required('Campo requerido'),
  MedioPago: yup.object().required('Campo requerido')
});

const InvoiceMaintenanceInner = (props, ref) => {
  const {
    data,
    // optional props
    isModal,
    isInline,
    hideEmitButton,
    cliente,
    disableDeleteOption,
    enablePartialPayment,
    reserva,
    onPartialPaymentSuccess,
    enableClickDetails,
    onElectronicInvoiceSuccess
  } = props;
  document.title = 'Mantenimiento | FARO';

  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    resolver
  });

  const formRef = useRef(null);
  const [isSubmittingFacturaElectronica, setIsSubmittingFacturaElectronica] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

  const [savePartialPayment] = useMutation(GUARDAR_PAGO_PARCIAL);
  const [updateReserva] = useMutation(UPDATE_RESERVA_INFO);

  const [partialPaymentModal, setPartialPaymentModal] = useState(false);

  const [parcial, setParcial] = useState(0);

  const { data: dataCurrencyTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'CodigoMonedaTypes' },
    pollInterval: 1000
  });

  const { data: dataPaymentMethods } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'MedioPagos' },
    pollInterval: 1000
  });

  const { data: dataSaleConditions } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'saleConditions' },
    pollInterval: 1000
  });

  const { data: dataDocumentTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'documentTypes' },
    pollInterval: 1000
  });

  const { data: dataMateriasPrimas } = useQuery(OBTENER_TODAS_MATERIAS_PRIMAS, {
    pollInterval: 1000
  });

  const { data: dataAllClientes } = useQuery(OBTENER_CLIENTES, {
    pollInterval: 1000
  });

  console.log(dataAllClientes);

  useEffect(() => {
    if (isModal) {
      setClienteFacturar(cliente);
    }
  }, [isModal]);

  const handlePartialPaymentToggle = () => {
    setParcial(0);

    setPartialPaymentModal(false);
  };

  const handleChange = (e) => {
    setParcial(e.target.value);
  };

  const handleSubmitParcial = () => {
    if (parcial > 0) {
      setPartialPaymentModal(false);

      setParcial(0);
    } else {
      Swal.fire({
        title: 'Pago Parcial',

        text: `El monto a pagar debe ser mayor a 0`,

        icon: 'error',

        showConfirmButton: true,

        confirmButtonColor: '#0BB197'
      });
    }
  };

  useEffect(() => {
    if (dataCurrencyTypes) {
      const options = dataCurrencyTypes.obtenerFacturasParametrosByType.map((item) => ({
        value: item.id,
        label: item.value
      }));

      setTipoMonedas(options);
    }

    if (dataPaymentMethods) {
      const options = dataPaymentMethods.obtenerFacturasParametrosByType.map((item) => ({
        value: item.id,
        label: item.value
      }));

      setMetodoPagos(options);
    }

    if (dataSaleConditions) {
      const options = dataSaleConditions.obtenerFacturasParametrosByType.map((item) => ({
        value: item.id,
        label: item.value
      }));

      setCondicionVentas(options);
    }

    if (dataDocumentTypes) {
      const options = dataDocumentTypes.obtenerFacturasParametrosByType.map((item) => ({
        value: item.id,
        label: item.value
      }));

      setTipoFacturas(options);
    }
  }, [dataCurrencyTypes, dataPaymentMethods, dataSaleConditions, dataDocumentTypes]);

  const onChangeTipoMoneda = (option) => {
    setValue('CodigoMoneda', option);
  };
  const [tipoMonedas, setTipoMonedas] = useState([]);

  const onChangeMetodoPago = (option) => {
    setValue('MedioPago', option);
  };
  const [metodoPagos, setMetodoPagos] = useState([]);

  const onChangeCondicionVenta = (option) => {
    setValue('CondicionVenta', option);
  };
  const [condicionVentas, setCondicionVentas] = useState([]);

  const onChangeTipoFactura = (option) => {
    setValue('TipoDocumento', option);
  };

  const [selectedClaveFactura, setSelectedClaveFactura] = useState(null);

  const [tipoFacturas, setTipoFacturas] = useState([]);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [modalClientes, setModalClientes] = useState(false);
  const toggleClientes = () => setModalClientes(!modalClientes);

  const [codigoArticulo, setCodigoArticulo] = useState('');

  const [clienteCedula, setClienteCedula] = useState('');

  const [articulosLista, setArticulosLista] = useState([]);

  const [clienteFacturar, setClienteFacturar] = useState<any>(false);

  function getFilteredByClienteCedula(key, value) {
    const valCedula = key;
    const val = value;

    if (
      valCedula.codigo.includes(val) ||
      valCedula.nombre.toLowerCase().includes(val.toLowerCase())
    ) {
      return key;
    }

    return null;
  }

  const getDataClientes = () => {
    if (dataAllClientes) {
      if (dataAllClientes.obtenerClientes) {
        return dataAllClientes.obtenerClientes.filter((value, index) => {
          if (clienteCedula.length > 0) {
            return getFilteredByClienteCedula(value, clienteCedula);
          }
          return value;
        });
      }
    }
    return [];
  };

  const dataClientes = getDataClientes();

  function getFilteredByCodigoCabys(key, value) {
    const valCodigoCabys = key;
    const val = value;

    if (
      valCodigoCabys.codigoCabys.includes(val) ||
      valCodigoCabys.descripcion.toLowerCase().includes(val.toLowerCase())
    ) {
      return key;
    }

    return null;
  }

  const getDataMeteriasPrimas = () => {
    if (dataMateriasPrimas) {
      if (dataMateriasPrimas.obtenerTodasMateriasPrimas) {
        return dataMateriasPrimas.obtenerTodasMateriasPrimas.filter((value, index) => {
          if (codigoArticulo.length > 0) {
            return getFilteredByCodigoCabys(value, codigoArticulo);
          }
          return value;
        });
      }
    }
    return [];
  };

  const dataArticulos = getDataMeteriasPrimas();

  const agregarArticulo = (articulo, cantidad) => {
    let newA = { ...articulo };
    newA.cantidadArticulo = cantidad.value;
    setArticulosLista((prevArticulosLista) => {
      let findVali = false;
      prevArticulosLista.find((value, index) => {
        if (value.codigoCabys === articulo.codigoCabys) {
          value.cantidadArticulo = parseInt(value.cantidadArticulo) + parseInt(cantidad.value);
          findVali = true;
          return value;
        }

        return null;
      });

      if (findVali) {
        return [...prevArticulosLista];
      } else {
        return [...prevArticulosLista, newA];
      }
    });
  };

  const eliminarLinea = (index) => {
    setArticulosLista(articulosLista.filter((l, i) => i !== index));
  };

  useEffect(() => {
    dataArticulos.forEach((_, i) => {
      const inputElement = document.getElementById(
        `cantidad-articulo-asset-${i}`
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '0';
      }
    });
  }, [dataArticulos]);

  useEffect(() => {
    if (isModal) {
      setClienteFacturar(cliente);
    }
    if (isInline && cliente) {
      setClienteFacturar(cliente);
    }
  }, [isModal, isInline, cliente]);

  useEffect(() => {
    var subTotal = 0;
    var impuestoTotal = 0;
    articulosLista.forEach((item, i) => {
      subTotal += item.cantidadArticulo * item.precioCompra;
      if (item.impuestos.length > 0) {
        impuestoTotal +=
          item.cantidadArticulo * item.precioCompra * (item.impuestos[0].impuesto / 100);
      }
    });

    setSubTotalValue(subTotal);
    setImpuestoTotalValue(impuestoTotal);
    setDescuentoTotalValue(0);
    setTotalPagarValue(subTotal + impuestoTotal);
  }, [articulosLista]);

  useEffect(() => {
    if (data) {
      if (
        dataAllClientes &&
        dataDocumentTypes &&
        dataSaleConditions &&
        dataPaymentMethods &&
        dataCurrencyTypes &&
        (!isModal ? clienteFacturar === false : true) &&
        !watch('TipoDocumento') &&
        !watch('CondicionVenta') &&
        !watch('MedioPago') &&
        !watch('CodigoMoneda')
      ) {
        if (data.articulosLista) {
          setArticulosLista(data.articulosLista);
        }

        if (data.clave) {
          setSelectedClaveFactura(data.clave);
        }

        if (data.clienteFacturar) {
          dataAllClientes.obtenerClientes.map((value, index) => {
            if (value.codigo === data.clienteFacturar) {
              setClienteFacturar(value);
            }

            return null;
          });
        }

        if (data.selectedTipoFactura) {
          dataDocumentTypes.obtenerFacturasParametrosByType.map((value, index) => {
            if (value.id === data.selectedTipoFactura) {
              setValue('TipoDocumento', { value: value.id, label: value.value });
            }

            return null;
          });
        }

        if (data.selectedCondicionVenta) {
          dataSaleConditions.obtenerFacturasParametrosByType.map((value, index) => {
            if (value.id === data.selectedCondicionVenta) {
              setValue('CondicionVenta', {
                value: value.id,
                label: value.value
              });
            }

            return null;
          });
        }

        if (data.selectedMetodoPago) {
          dataPaymentMethods.obtenerFacturasParametrosByType.map((value, index) => {
            if (value.id === data.selectedMetodoPago) {
              setValue('MedioPago', {
                value: value.id,
                label: value.value
              });
            }

            return null;
          });
        }

        if (data.selectedTipoMoneda) {
          dataCurrencyTypes.obtenerFacturasParametrosByType.map((value, index) => {
            if (value.id === data.selectedTipoMoneda) {
              setValue('CodigoMoneda', {
                value: value.id,
                label: value.value
              });
            }

            return null;
          });
        }
      }
    }
  }, [
    props,
    dataAllClientes,
    dataDocumentTypes,
    dataSaleConditions,
    dataPaymentMethods,
    dataCurrencyTypes,
    clienteFacturar,
    watch('TipoDocumento'),
    watch('CondicionVenta'),
    watch('MedioPago'),
    watch('CodigoMoneda'),
    data,
    isModal
  ]);

  const toEmit = () => {
    Swal.fire({
      title: 'Emitir factura',
      text: `¿Está seguro de emitir esta factura?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0BB197',
      cancelButtonColor: '#FF3D60',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, ¡Emitir!'
    }).then(async (result) => {
      const showGenericError = () => {
        Swal.fire({
          title: 'Error al Emitir la Factura',
          text: `
                                Ha ocurrido un error al emitir su factura. Por favor, intente nuevamente más tarde.\n
                                Si el problema persiste, contacte a nuestro soporte técnico.`,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonColor: '#0BB197'
        });
      };
      if (result.isConfirmed) {
        if (
          clienteFacturar &&
          watch('TipoDocumento') &&
          watch('CondicionVenta') &&
          watch('MedioPago') &&
          watch('CodigoMoneda')
        ) {
          setIsSubmittingFacturaElectronica(true);
          const payload = {
            receiver_id_num: clienteFacturar.codigo,
            codigo_actividad: '252001',

            document_type: parseInt(watch('TipoDocumento')?.value, 10),
            sale_condition: parseInt(watch('CondicionVenta')?.value, 10),
            payment_method: parseInt(watch('MedioPago')?.value, 10),
            CodigoMoneda_type: parseInt(watch('CodigoMoneda')?.value, 10),

            items: articulosLista.map((item) => ({
              id: item.id,
              nombre: item.nombre?.trim() || 'Articulo sin nombre',

              descripcion: item.descripcion?.trim() || item.nombre?.trim() || 'Sin descripción',

              precioCompra: Number(item.precioCompra || item.precio || 0),
              cantidadArticulo: Number(item.cantidadArticulo || 1),
              codigoCabys: item.codigoCabys
            })),

            // items: articulosLista,
            info_referency: selectedClaveFactura
              ? {
                  TipoDoc: '07',
                  Numero: selectedClaveFactura,
                  FechaEmision: data ? data.fecha : null,
                  Codigo: '01',
                  Razon: data ? data.razon : null
                }
              : null
          };

          try {
            // const facturaElectronicaResponse = await enviarFacturaElectronica(payload);
            const ffeClient = new FfeClient();
            const response = await ffeClient.sendDocument(payload);

            if (response) {
              Swal.fire({
                title: 'Factura Emitida Correctamente',
                text: `Su factura ha sido emitida exitosamente.`,
                icon: 'success',
                showConfirmButton: true,
                confirmButtonColor: '#0BB197'
              });
              onElectronicInvoiceSuccess?.();
            } else {
              showGenericError();
            }
          } catch (error) {
            console.error('Error detallado:', error);

            let mensajeUsuario = 'Ha ocurrido un error inesperado.';

            if (error instanceof ApiError) {
              if (error.status === 422) {
                // Si tu API devuelve algo como { details: "La cédula debe tener 9 dígitos" }
                mensajeUsuario = `Datos inválidos: ${error.message}`;
              } else if (error.status === 500) {
                mensajeUsuario = 'Error interno del servidor de facturación.';
              }
            } else if (error.message === 'Wait time done') {
              mensajeUsuario =
                'La conexión con Hacienda tardó demasiado. Revisa si la factura se emitió en el historial.';
            }

            Swal.fire({
              title: 'Error al Emitir',
              text: mensajeUsuario, // Ahora el usuario sabe QUÉ pasó
              icon: 'error',
              confirmButtonColor: '#0BB197'
            });

            return false;
          }
        }
      }
    });
  };

  const [subTotalValue, setSubTotalValue] = useState(0);
  const [descuentoTotalValue, setDescuentoTotalValue] = useState(0);
  const [impuestoTotalValue, setImpuestoTotalValue] = useState(0);
  // const [otrosCargosTotalValue, setOtrosCargosTotalValue] = useState(0);
  // const [IVADevueltoValue, setIVADevueltoValue] = useState(0);
  const [totalPagarValue, setTotalPagarValue] = useState(0);

  const submitPartialPayment = async () => {
    const input = {
      monto: totalPagarValue,
      total: reserva?.total,
      restante: reserva?.total - totalPagarValue,
      cliente: {
        nombre: cliente?.nombre,
        nombreFacturacion: cliente?.nombreFacturacion,
        codigo: cliente?.codigo,
        pais: cliente?.pais,
        telefono: cliente?.telefonos[0]?.telefono,
        correo: cliente?.correos[0]?.email
      },
      reserva: reserva?.id,
      fecha: new Date(),
      metodoPago: watch('MedioPago')?.label
    };
    const response = await savePartialPayment({
      variables: { input },
      errorPolicy: 'all'
    });
    const reservaInput = {
      total: reserva?.total - totalPagarValue
    };
    updateReserva({
      variables: { id: reserva?.id, input: reservaInput },
      errorPolicy: 'all'
    });
    if (response?.data?.insertarPagoParcial?.estado) {
      Swal.fire({
        title: 'Pago Parcial',
        text: 'Se ha realizado el pago parcial correctamente.',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonColor: '#0BB197'
      });
      setPartialPaymentModal(false);
      setParcial(0);
      onPartialPaymentSuccess?.();
    }
  };

  const onSubmit = (data) => {
    // onElectronicInvoiceSuccess?.(); // uncomment this line if you want to trigger the success callback on submit
    toEmit();
  };

  // expose imperative submit when used inline
  useImperativeHandle(ref, () => ({
    submit: () => {
      if (formRef && formRef.current) formRef.current.requestSubmit();
    },
    isSubmitting: () => isSubmittingFacturaElectronica
  }));

  const handleSelectedRow = (row) => {
    if (selectedRow && selectedRow === row) {
      setSelectedRow(null);
    } else {
      setSelectedRow(row);
    }
  };

  return (
    <React.Fragment>
      <div className={`${isModal ? '' : 'page-content'}`}>
        <Container fluid={true}>
          {!isModal && <Breadcrumbs title="Mantenimiento" />}

          <Row className="justify-content-center">
            <div className="col-md-12 mb-3">
              {selectedClaveFactura ? (
                <>
                  <Row>
                    <label className="form-label">Clave Factura</label>
                  </Row>
                  <Row>
                    <div className="col-md-12 mb-3">
                      <input
                        readOnly={true}
                        className="form-control"
                        type="text"
                        value={selectedClaveFactura}
                      />
                    </div>
                  </Row>
                </>
              ) : null}
              <Row>
                <label className="form-label">Cliente (F5)</label>
              </Row>
              <Row>
                {data && data.clienteFacturar ? (
                  <>
                    <div className="col-md-12 mb-3">
                      <input
                        readOnly={true}
                        className="form-control"
                        type="text"
                        value={
                          clienteFacturar
                            ? `${clienteFacturar.nombre} - ${clienteFacturar.codigo}`
                            : '...'
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-4 mb-3">
                      <input
                        readOnly={true}
                        className="form-control"
                        type="text"
                        value={
                          clienteFacturar
                            ? `${clienteFacturar.nombre} - ${clienteFacturar.codigo}`
                            : '...'
                        }
                      />
                    </div>
                    {!isModal && (
                      <>
                        <div className="col-md-6 mb-3">
                          <Row className="d-flex">
                            <div className="col-12 mb-3">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Cliente Cédula o Nombre"
                                onChange={(e) => {
                                  setClienteCedula(e.target.value);
                                }}
                                value={clienteCedula}
                              />
                            </div>
                          </Row>
                        </div>
                        <div className="col-md-2 mb-3">
                          <button
                            type="button"
                            className="btn btn-rounded btn-info waves-effect waves-light me-3"
                            onClick={() => toggleClientes()}
                            disabled={!(clienteCedula.length > 0)}
                          >
                            <i className="mdi mdi-magnify"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </Row>
              {!isModal && (
                <>
                  <Row>
                    <label className="form-label">Codigo de Barras (F2)</label>
                  </Row>
                  <Row>
                    <div className="col-md-10 mb-2">
                      <Row className="d-flex">
                        <div className="col-12 mb-3">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Código del Articulo o Nombre"
                            onChange={(e) => {
                              setCodigoArticulo(e.target.value);
                            }}
                            value={codigoArticulo}
                          />
                        </div>
                      </Row>
                    </div>
                    <div className="col-md-2 mb-3">
                      <button
                        type="button"
                        className="btn btn-rounded btn-info waves-effect waves-light me-3"
                        onClick={() => toggle()}
                        disabled={codigoArticulo.length > 0 ? false : true}
                      >
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    </div>
                  </Row>
                </>
              )}

              <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Condicíon de Venta</label>
                    <Select
                      id="condicion_venta"
                      name="CondicionVenta"
                      value={watch('CondicionVenta')}
                      onChange={(e) => {
                        onChangeCondicionVenta(e);
                      }}
                      options={condicionVentas}
                      classNamePrefix="select2-selection"
                      isSearchable={true}
                      menuPosition="fixed"
                    />
                    {errors?.['CondicionVenta'] && (
                      <p className="errorMessage">{errors?.['CondicionVenta'].message as string}</p>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Factura</label>
                    <Select
                      id="tipo_factura"
                      name="TipoDocumento"
                      value={watch('TipoDocumento')}
                      onChange={(e) => {
                        onChangeTipoFactura(e);
                      }}
                      options={tipoFacturas}
                      classNamePrefix="select2-selection"
                      isSearchable={true}
                      menuPosition="fixed"
                      isDisabled={props.data && props.data.selectedTipoFactura}
                    />
                    {errors?.['TipoDocumento'] && (
                      <p className="errorMessage">{errors?.['TipoDocumento'].message as string}</p>
                    )}
                  </div>
                </Row>
                <Row>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Moneda de Pago</label>
                    <Select
                      id="condicion_venta"
                      value={watch('CodigoMoneda')}
                      onChange={(e) => {
                        onChangeTipoMoneda(e);
                      }}
                      options={tipoMonedas}
                      classNamePrefix="select2-selection"
                      isSearchable={true}
                      menuPosition="fixed"
                    />
                    {errors?.['CodigoMoneda'] && (
                      <p className="errorMessage">{errors?.['CodigoMoneda'].message as string}</p>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Cambio</label>
                    <input readOnly={true} className="form-control" type="number" />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Forma de Pago</label>
                    {/* <div className="col-md-2 mb-3">
                                        <input className="form-control" type="number"/>
                                    </div> */}
                    <div className="col-md-12 mb-3">
                      <Select
                        id="condicion_venta"
                        value={watch('MedioPago')}
                        onChange={(e) => {
                          onChangeMetodoPago(e);
                        }}
                        options={metodoPagos}
                        classNamePrefix="select2-selection"
                        isSearchable={true}
                        menuPosition="fixed"
                      />
                      {errors?.['MedioPago'] && (
                        <p className="errorMessage">{errors?.['MedioPago'].message as string}</p>
                      )}
                    </div>
                  </div>
                </Row>
              </form>

              <Row>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Subtotal</label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="0.00"
                    readOnly
                    value={subTotalValue}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Descuento</label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="0.00"
                    readOnly
                    value={descuentoTotalValue}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Impuesto</label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="0.00"
                    readOnly
                    value={impuestoTotalValue}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Total a Pagar</label>
                  <input
                    className="form-control"
                    type="number"
                    placeholder="0.00"
                    readOnly
                    value={totalPagarValue}
                  />
                </div>
              </Row>
            </div>
            <div
              className="col-md-12 mb-3"
              style={{
                border: '1px solid #ced4da',
                borderRadius: '0.25rem',
                height: '660px',
                overflowY: 'scroll'
              }}
            >
              <div className="col-md-12 table-responsive mb-3">
                <table className="table table-hover table-striped mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '200px' }}>Descripcion</th>
                      <th>Código Cabys</th>
                      <th>Precio Unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Impuestos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articulosLista.length > 0 ? (
                      <>
                        {articulosLista.map((asset, i) => {
                          return (
                            <>
                              <tr
                                key={`asset-${i}`}
                                className={`${
                                  enableClickDetails && 'cursor-pointer row-hover'
                                } ${selectedRow == asset && 'selected'}`}
                                onClick={() => {
                                  if (enableClickDetails) handleSelectedRow(asset);
                                }}
                              >
                                <td>{asset.descripcion}</td>
                                <td>{asset.codigoCabys}</td>
                                <td>{asset.precioCompra}</td>
                                <td>{asset.cantidadArticulo}</td>
                                <td>{asset.cantidadArticulo * asset.precioCompra}</td>
                                <td>%13</td>
                                <td>
                                  {!disableDeleteOption && (
                                    <ButtonIconTable
                                      icon="mdi mdi-delete "
                                      color="danger"
                                      onClick={() => {
                                        eliminarLinea(i);
                                      }}
                                    />
                                  )}
                                  {enablePartialPayment && (
                                    <ButtonIconTable
                                      icon="bx bx-money"
                                      color="primary"
                                      onClick={() => {
                                        setPartialPaymentModal(true);
                                      }}
                                    />
                                  )}
                                </td>
                              </tr>
                              {asset == selectedRow &&
                                asset?.detalles.map((detalle, i) => {
                                  return (
                                    <tr key={`asset-${i}`}>
                                      <td>{detalle.descripcion}</td>
                                      <td>{detalle.codigoCabys}</td>
                                      <td>{detalle.precioCompra}</td>
                                      <td>{detalle.cantidadArticulo}</td>
                                      <td>{detalle.cantidadArticulo * detalle.precioCompra}</td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  );
                                })}
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <tr key={`asset-empty`}>
                        <td
                          colSpan={7}
                          className="text-center"
                          style={{ height: '600px', alignContent: 'center' }}
                        >
                          {'No hay articulos agregados!'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Row>
              <div className="col-md-12">
                {Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger mb-3">
                    Por favor complete todos los campos requeridos antes de continuar.
                  </div>
                )}
                {!hideEmitButton && (
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light w-100"
                    onClick={() => formRef.current.requestSubmit()}
                    disabled={isSubmittingFacturaElectronica}
                  >
                    Emitir (F4)
                  </button>
                )}
              </div>
            </Row>
          </Row>
        </Container>
        <Modal isOpen={modalClientes} toggle={toggleClientes} size="lg">
          <ModalHeader toggle={toggleClientes}></ModalHeader>
          <ModalBody>
            <Row>
              <div className="col-md-6 col-sm-12 mb-3">
                <label htmlFor="tipo" className="form-label">
                  Cliente
                </label>
                <Row>
                  <div className="col-9 mb-2 d-flex">
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) => {
                        setClienteCedula(e.target.value);
                      }}
                      value={clienteCedula}
                    />
                  </div>
                  <div className="col-3 mb-2 d-flex">
                    {clienteCedula.length > 0 ? (
                      <button
                        type="button"
                        className="btn btn-rounded btn-info waves-effect waves-light"
                        onClick={() => toggleClientes()}
                      >
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    ) : null}
                  </div>
                </Row>
              </div>
            </Row>
            <div className="table-responsive mb-3">
              <table className="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Selección</th>
                  </tr>
                </thead>
                <tbody>
                  {dataClientes.map((asset, i) => (
                    <tr key={`asset-${i}`}>
                      <td>{asset.nombre}</td>
                      <td>{asset.codigo}</td>
                      <td>
                        {asset.correos.length > 0 ? <>{asset.correos[0].email}</> : <>Sin correo</>}
                      </td>
                      <td>
                        {asset.telefonos.length > 0 ? (
                          <>{asset.telefonos[0].telefono}</>
                        ) : (
                          <>Sin teléfono</>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary waves-effect waves-light py-0 px-4"
                          onClick={() => setClienteFacturar(asset)}
                        >
                          <i className="ri-add-line align-middle"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={modal} toggle={toggle} size="lg">
          <ModalHeader toggle={toggle}></ModalHeader>
          <ModalBody>
            <Row>
              <div className="col-md-6 col-sm-12 mb-3">
                <label htmlFor="tipo" className="form-label">
                  Código del Articulo
                </label>
                <Row>
                  <div className="col-9 mb-2 d-flex">
                    <input
                      className="form-control"
                      type="number"
                      onChange={(e) => {
                        setCodigoArticulo(e.target.value);
                      }}
                      value={codigoArticulo}
                    />
                  </div>
                  <div className="col-3 mb-2 d-flex">
                    {codigoArticulo.length > 0 ? (
                      <button
                        type="button"
                        className="btn btn-rounded btn-info waves-effect waves-light"
                        onClick={() => toggle()}
                      >
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    ) : null}
                  </div>
                </Row>
              </div>
            </Row>
            <div className="table-responsive mb-3">
              <table className="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Descripcion</th>
                    <th>Código Cabys</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Selección</th>
                  </tr>
                </thead>
                <tbody>
                  {dataArticulos.map((asset, i) => (
                    <tr key={`asset-${i}`}>
                      <td>{asset.descripcion}</td>
                      <td>{asset.codigoCabys}</td>
                      <td>{asset.precioCompra}</td>
                      <td>
                        <input
                          className="form-control py-0"
                          type="number"
                          placeholder="Cantidad"
                          id={`cantidad-articulo-asset-${i}`}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary waves-effect waves-light py-0 px-4"
                          onClick={() =>
                            agregarArticulo(
                              asset,
                              document.getElementById(`cantidad-articulo-asset-${i}`)
                            )
                          }
                        >
                          <i className="ri-add-line align-middle"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={partialPaymentModal} toggle={handlePartialPaymentToggle}>
          <ModalHeader toggle={handlePartialPaymentToggle}>Pago Parcial</ModalHeader>

          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="monto">Monto</Label>

                <InputGroup>
                  <InputGroupText>₡</InputGroupText>{' '}
                  <Input
                    type="number"
                    name="monto"
                    id="monto"
                    value={parcial}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={handleSubmitParcial}>
              Pagar
            </Button>

            <Button color="secondary" onClick={handlePartialPaymentToggle}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

import BillingStep from './ReservationBilling/components/Billing/BillingStep';
import { ApiError } from '@/lib/HttpClient';

// Export the embeddable component directly as the default export
export default BillingStep;
