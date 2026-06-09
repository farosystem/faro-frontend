import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Container, Row } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import Breadcrumbs from '@/components/Common/Breadcrumb';
import DataList from '@/components/Common/DataList';
import { convertDataStockExcel, exportAndDownloadExcel } from '@/helpers/exportExcel';
import {
  DELETE_MATERIA_PRIMA,
  OBTENER_MATERIAS_PRIMAS_MOVIMIENTOS
} from '@/services/MateriaPrimaService';
import {
  ObtenerMateriasPrimasConMovimientosQuery,
  ObtenerMateriasPrimasConMovimientosQueryVariables
} from '@/gql/graphql';

// params coming from react-router
interface StockParams {
  stockType: string;
}

const Stock = ({ ...props }) => {
  document.title = 'Inventario | FARO';

  const params = useParams();
  const stockType = (params as { stockType: string }).stockType;

  const [filter, setFilter] = useState<string>('');
  const [unidadFilter, setUnidadFilter] = useState<string>('');
  const {
    loading: load_materia_prima,
    error: error_materia_prima,
    data: data_materia_prima,
    refetch
  } = useQuery<
    ObtenerMateriasPrimasConMovimientosQuery,
    ObtenerMateriasPrimasConMovimientosQueryVariables
  >(OBTENER_MATERIAS_PRIMAS_MOVIMIENTOS, {
    // do not fire the query until we know what type we want
    skip: !stockType,
    variables: { tipo: stockType },
    pollInterval: 1000,
    fetchPolicy: 'network-only' // always go to network so cache doesn't hide changes
  });

  // when stockType changes we want to refetch explicitly (skip above prevents the
  // first query firing with tipo undefined)
  useEffect(() => {
    if (stockType) {
      refetch({ tipo: stockType });
    }
  }, [stockType, refetch]);

  // debugging/logging; remove once you verify that the data is coming back
  useEffect(() => {
    if (error_materia_prima) {
      console.error('Error fetching stock:', error_materia_prima);
    }
    if (data_materia_prima) {
      console.debug('raw stock data received for', stockType, data_materia_prima);
    }
  }, [data_materia_prima, error_materia_prima, stockType]);

  const [desactivar] = useMutation(DELETE_MATERIA_PRIMA);

  function getFilteredByKey(key, value) {
    const val1 = key.materia_prima.nombre.toLowerCase();
    const val = value.toLowerCase();

    if (val1.includes(val)) {
      return key;
    }

    return null;
  }

  const getData = () => {
    if (data_materia_prima) {
      if (data_materia_prima.obtenerMateriasPrimasConMovimientos) {
        return data_materia_prima.obtenerMateriasPrimasConMovimientos.filter((value) => {
          if (filter !== '' && !getFilteredByKey(value, filter)) {
            return false;
          }
          if (unidadFilter && value.materia_prima?.unidad !== unidadFilter) {
            return false;
          }
          return true;
        });
      }
    }
    return [];
  };

  const unidadOptions = useMemo(() => {
    const unidades = new Set<string>();
    data_materia_prima?.obtenerMateriasPrimasConMovimientos?.forEach((item) => {
      if (item?.materia_prima?.unidad) {
        unidades.add(item.materia_prima.unidad);
      }
    });
    return Array.from(unidades).map((unidad) => ({ label: unidad, value: unidad }));
  }, [data_materia_prima]);

  const onDelete = (id, name) => {
    // Swal.fire({
    //     title: "Eliminar orden de compra",
    //     text: `¿Está seguro de eliminar la orden ${name || ''}?`,
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#0BB197",
    //     cancelButtonColor: "#FF3D60",
    //     cancelButtonText: 'Cancelar',
    //     confirmButtonText: "Sí, ¡eliminar!"
    // }).then(async(result) => {
    //     if (result.isConfirmed) {
    //         const { data } = await desactivar({ variables: { id } });
    //         const { estado, message } = data.desactivarOrdenCompra;
    //         if (estado) {
    //             showInfoAlert('Orden de compra eliminada', message, 'success', 3000, 'top-end')
    //         } else {
    //             showInfoAlert('Eliminar orden de compra', message, 'error', 3000, 'top-end')
    //         }
    //     }
    // });
  };

  const onClickExportExcel = () => {
    exportAndDownloadExcel('inventario', convertDataStockExcel(data));
  };

  const data = getData();

  if (load_materia_prima) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title={`Inventario - ${stockType}`} />
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

  if (error_materia_prima) {
    // show a simple inline error; could replace with a custom alert component
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title={`Inventario - ${stockType}`} />
            <Row>
              <div className="col">
                <div className="alert alert-danger mt-3" role="alert">
                  Ocurrió un error al obtener el inventario: {error_materia_prima.message}
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
          <Breadcrumbs title={`Inventario - ${stockType}`} />
          <Row className="flex" style={{ alignItems: 'flex-end' }}>
            <div className="col-md-5 mb-3">
              <label htmlFor="search-input" className="col-md-4 col-form-label">
                Busca el producto
              </label>
              <input
                className="form-control"
                id="search-input"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                type="search"
                placeholder="Escribe el nombre del producto"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="unidad-filter" className="col-md-4 col-form-label">
                Filtrar unidad
              </label>
              <select
                id="unidad-filter"
                className="form-select"
                value={unidadFilter}
                onChange={(e) => setUnidadFilter(e.target.value)}
              >
                <option value="">Todas</option>
                {unidadOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-sm-12 mb-3">
              <Link to={`/newproduct/${stockType}`}>
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light"
                  style={{ width: '100%' }}
                >
                  Agregar <i className="mdi mdi-plus align-middle ms-2"></i>
                </button>
              </Link>
            </div>
          </Row>
          <Row className="d-flex justify-content-start">
            <div className="col-auto mb-3">
              <button
                type="button"
                className="btn btn-outline-secondary waves-effect waves-light"
                onClick={() => {
                  onClickExportExcel();
                }}
              >
                Exportar Excel <i className="mdi mdi-file-excel align-middle ms-2"></i>
              </button>
            </div>
            {stockType === 'Restaurante' && (
              <div className="col-auto mb-3">
                <Link to={`/stockreport/${stockType}`}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary waves-effect waves-light"
                  >
                    Generar Reporte <i className="mdi mdi-file-pdf align-middle ms-2"></i>
                  </button>
                </Link>
              </div>
            )}
          </Row>
          <Row>
            <div className="col mb-3">
              <Card>
                <CardBody>
                  <DataList
                    onDelete={onDelete}
                    data={data}
                    type="stock"
                    displayLength={9}
                    {...props}
                  />
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Stock;
