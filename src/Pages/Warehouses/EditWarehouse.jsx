import React, { useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { showInfoAlert } from '../../helpers/alert';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { OBTENER_LINEAS_ALMACEN } from '../../services/AlmacenLineaService';
import { ACTUALIZAR_ALMACEN } from '../../services/AlmacenService';
import DataList from '../../components/Common/DataList';

const EditWarehouse = ({ props, warehouse }) => {
  document.title = 'Órdenes de compra | FARO';

  const navigate = useNavigate();

  const { loading: load_lineas, data: data_lineas } = useQuery(OBTENER_LINEAS_ALMACEN, {
    variables: { id: warehouse.id },
    pollInterval: 1000
  });
  const [actualizar] = useMutation(ACTUALIZAR_ALMACEN);

  const [nombre, setNombre] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  const [lineas, setLineas] = useState([]);

  useEffect(() => {
    setNombre(warehouse.nombre);
    setDescripcion(warehouse.descripcion);
  }, [warehouse]);

  useEffect(() => {
    setLineas(data_lineas?.obtenerLineasAlmacen || []);
  }, [data_lineas]);

  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    setDisableSave(!nombre || nombre === null || nombre.trim().length === 0);
  }, [nombre]);

  const onSave = async () => {
    try {
      setDisableSave(true);
      const input = {
        estado: warehouse.estado,
        nombre: nombre,
        descripcion: descripcion
      };

      const { data } = await actualizar({
        variables: { id: warehouse.id, input },
        errorPolicy: 'all'
      });
      const { estado, message } = data.actualizarAlmacen;
      if (estado) {
        showInfoAlert({
          title: 'Excelente',
          text: message,
          icon: 'success',
          timer: 3000,
          position: 'center'
        });
        navigate(`/warehouses`);
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
        text: 'Ocurrió un error inesperado el almacén',
        icon: 'error',
        timer: 3000,
        position: 'center'
      });
      setDisableSave(false);
    }
  };

  if (load_lineas) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Editar almacén"
              breadcrumbItem="Almacenes"
              breadcrumbItemUrl="/warehouses"
            />
            <Row>
              <div className="col text-center pt-3 pb-3">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Editar almacén"
            breadcrumbItem="Almacenes"
            breadcrumbItemUrl="/warehouses"
          />
          <Row>
            <div className="col mb-3 text-end">
              <button
                type="button"
                className="btn btn-primary waves-effect waves-light"
                disabled={disableSave}
                onClick={() => onSave()}
              >
                Guardar <i className="ri-save-line align-middle ms-2"></i>
              </button>
            </div>
          </Row>
          <Row>
            <div className="col-5 mb-3">
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
            <div className="col-7 mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción del almacén
              </label>
              <textarea
                className="form-control"
                type="text"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
          </Row>
          <Row className="align-items-center">
            <div className="col mt-5 mb-3">
              <h6>
                <strong>Productos</strong>
              </h6>
            </div>
            <hr />
          </Row>
          <Row>
            <div className="col mt-3 mb-3">
              <DataList data={lineas} type="warehouseLines" displayLength={5} {...props} />
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditWarehouse;
