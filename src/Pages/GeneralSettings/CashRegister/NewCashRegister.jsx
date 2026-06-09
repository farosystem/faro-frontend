import React, { useEffect, useState } from 'react';
import { Container, Row, Table, FormGroup } from 'reactstrap';
import Select from 'react-select';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import SpanSubtitleForm from '../../../components/Forms/SpanSubtitleForm';
import { showInfoAlert } from '../../../helpers/alert';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { SAVE_CAJA } from '../../../services/CajasService';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '../../../services/FacturasParametrosService';
import { getSimboloMoneda } from '../../../helpers/helpers';

const NewCashRegister = (props) => {
  document.title = 'Cajas | FARO';

  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState(0);
  const [estado, setEstado] = useState(null);
  const [modulo, setModulo] = useState(null);
  const [tipoMonedas, setTipoMonedas] = useState([]);
  const [montosApertura, setMontosApertura] = useState([]);

  const { data: dataCurrencyTypes } = useQuery(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'currencyTypes' },
    pollInterval: 1000
  });

  const [insertar] = useMutation(SAVE_CAJA);

  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    const isValid =
      numero === 0 ||
      codigo === '' ||
      nombre === '' ||
      estado === null ||
      modulo === null ||
      montosApertura.some((item) => isNaN(item.monto) || item.monto < 0);
    setDisableSave(isValid);
  }, [codigo, nombre, numero, estado, modulo, montosApertura]);

  useEffect(() => {
    if (dataCurrencyTypes?.obtenerFacturasParametrosByType?.length) {
      const options = dataCurrencyTypes.obtenerFacturasParametrosByType.map((item) => ({
        value: item.value.trim().toLowerCase(),
        label: item.value,
        id: item.id
      }));
      setTipoMonedas(options);

      // Inicializar montos de apertura
      const initialMontos = options.map((moneda) => ({
        moneda: moneda.label,
        monto: 0
      }));
      setMontosApertura(initialMontos);
    } else {
      setTipoMonedas([]);
      setMontosApertura([]);
    }
  }, [dataCurrencyTypes]);

  const handleMontoChange = (index, value) => {
    const newMontos = [...montosApertura];
    newMontos[index].monto = parseFloat(value) || 0;
    setMontosApertura(newMontos);
  };

  const onClickSave = async () => {
    try {
      setDisableSave(true);

      const input = {
        codigo: codigo,
        nombre: nombre,
        numero: numero,
        estado: estado.value,
        modulo: modulo.value,
        montos_apertura: montosApertura
      };

      const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
      const { estado: success, message } = data.insertarCaja;

      if (success) {
        showInfoAlert({
          title: 'Excelente',
          text: message,
          icon: 'success',
          timer: 3000,
          position: 'center'
        });
        navigate('/cashregisters');
      } else {
        showInfoAlert({
          title: 'Oops',
          text: message,
          icon: 'error',
          timer: 3000,
          position: 'center'
        });
      }
      setDisableSave(false);
    } catch (error) {
      showInfoAlert({
        title: 'Oops',
        text: 'Ocurrió un error inesperado al guardar la caja',
        icon: 'error',
        timer: 3000,
        position: 'center'
      });
      setDisableSave(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Nueva Caja"
            breadcrumbItem="Gestión Cajas"
            breadcrumbItemUrl="/cashregisters"
          />
          <Row>
            <div className="col mb-3 text-end">
              <button
                type="button"
                className="btn btn-primary waves-effect waves-light"
                disabled={disableSave}
                onClick={() => onClickSave()}
              >
                Guardar <i className="ri-save-line align-middle ms-2"></i>
              </button>
            </div>
          </Row>
          <Row>
            <div className="col-md-12 col-sm-12">
              <Row>
                <div className="col mb-3">
                  <SpanSubtitleForm subtitle="Información de la caja" />
                </div>
              </Row>
              <Row>
                <div className="col-md-4 col-sm-12 mb-3">
                  <label htmlFor="codigo" className="form-label">
                    * Código
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3">
                  <label htmlFor="nombre" className="form-label">
                    * Nombre
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3">
                  <label htmlFor="numero" className="form-label">
                    * Número
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="numero"
                    value={numero}
                    onChange={(e) => setNumero(parseInt(e.target.value))}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-6 col-sm-12 mb-3">
                  <label htmlFor="estado" className="form-label">
                    * Estado de la caja
                  </label>
                  <Select
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e)}
                    options={[
                      { value: 'ABIERTA', label: 'Abierta' },
                      { value: 'CERRADA', label: 'Cerrada' },
                      { value: 'CIERRE_PARCIAL', label: 'Cierre Parcial' },
                      { value: 'INACTIVA', label: 'Inactiva' }
                    ]}
                    classNamePrefix="select2-selection"
                    isSearchable={false}
                    menuPosition="fixed"
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <label htmlFor="modulo" className="form-label">
                    * Módulo
                  </label>
                  <Select
                    id="modulo"
                    value={modulo}
                    onChange={(e) => setModulo(e)}
                    options={[
                      { value: 'Restaurante', label: 'Restaurante' },
                      { value: 'Recepcion', label: 'Recepción' },
                      { value: 'Punto_Venta', label: 'Punto de Venta' },
                      { value: 'Sin_definir', label: 'Sin definir' }
                    ]}
                    classNamePrefix="select2-selection"
                    isSearchable={false}
                    menuPosition="fixed"
                  />
                </div>
              </Row>

              {/* Tabla de montos por tipo de moneda */}
              <Row>
                <div className="col mb-3">
                  <SpanSubtitleForm subtitle="Montos de apertura por tipo de moneda" />
                </div>
              </Row>
              <Row>
                <div className="col-md-12 col-sm-12 mb-3">
                  <Table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tipo de Moneda</th>
                        <th>Monto de Apertura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {montosApertura.map((item, index) => (
                        <tr key={index}>
                          <td>{item.moneda}</td>
                          <td>
                            <FormGroup>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    {getSimboloMoneda(item.moneda)}
                                  </span>
                                </div>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  step="0.01"
                                  value={item.monto}
                                  onChange={(e) => handleMontoChange(index, e.target.value)}
                                />
                              </div>
                            </FormGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Row>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewCashRegister;
