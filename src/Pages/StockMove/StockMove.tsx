import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Container, Row } from 'reactstrap';
import Select from 'react-select';
import { useQuery, useLazyQuery } from '@apollo/client';

import { OBTENER_MOVIMIENTOS } from '@/services/MovimientosService';
import { OBTENER_REPORTE_ANULACIONES } from '@/services/MovimientosRestauranteService';
import Breadcrumbs from '@/components/Common/Breadcrumb';
import DataList from '@/components/Common/DataList';

import { convertirDataStockMoveExcel, exportAndDownloadExcel } from '@/helpers/exportExcel';

const StockMove = ({ ...props }) => {
  document.title = 'Movimientos | FARO';

  const { stockType, productName, productId } = useParams();

  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const {
    loading: load_movimiento,
    error: error_movimiento,
    data: data_movimiento
  } = useQuery(OBTENER_MOVIMIENTOS, { variables: { id: productId }, pollInterval: 1000 });

  const [anulaciones, setAnulaciones] = useState<any[]>([]);
  const [getAnulaciones, { loading: loadingAnulaciones }] = useLazyQuery(
    OBTENER_REPORTE_ANULACIONES,
    {
      onCompleted: (data) => {
        setAnulaciones(data.obtenerReporteAnulaciones || []);
      }
    }
  );

  const filterOptions = [
    {
      label: 'Ver todo',
      value: ''
    },
    {
      label: 'Ver salidas',
      value: 'SALIDA'
    },
    {
      label: 'Ver entradas',
      value: 'ENTRADA'
    },
    {
      label: 'Ver anulaciones',
      value: 'ANULACIONES'
    }
  ];

  const [filterType, setFilterType] = useState({ label: 'Ver todo', value: '' });

  const handleFilterType = (v) => {
    setFilterType(v);
    setFilter(v.value);
  };

  const handleSearchChange = (v) => {
    setSearch(v);
  };

  const isAnulacion = (value) => {
    const lote = value.lote?.toString() ?? '';
    return lote.toLowerCase().includes('anul');
  };

  useEffect(() => {
    if (filter !== 'ANULACIONES') return;

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    getAnulaciones({
      variables: {
        fechaInicio: start.toISOString().split('T')[0],
        fechaFin: end.toISOString().split('T')[0]
      }
    });
  }, [filter, getAnulaciones]);

  const getData = () => {
    if (filter === 'ANULACIONES') {
      if (search.trim() === '') return anulaciones;

      const term = search.trim().toLowerCase();
      return anulaciones.filter((value) => {
        const matchPlatillo = value.platillo?.toLowerCase().includes(term);
        const matchMotivo = value.motivo?.toLowerCase().includes(term);
        const matchUsuario = value.usuarioAnulo?.toLowerCase().includes(term);
        const matchDeducciones = value.deducciones?.some((d) =>
          (d.nombre || '').toLowerCase().includes(term)
        );
        return matchPlatillo || matchMotivo || matchUsuario || matchDeducciones;
      });
    }

    if (!data_movimiento?.obtenerMovimientos) {
      return [];
    }

    return data_movimiento.obtenerMovimientos.filter((value) => {
      if (filter && !getFilteredByKey(value, filter)) {
        return false;
      }

      if (search.trim() !== '') {
        const term = search.trim().toLowerCase();
        const matchLote = value.lote?.toString().toLowerCase().includes(term);
        const matchProveedor = value.proveedor?.empresa?.toLowerCase().includes(term);
        const matchCliente = value.cliente?.nombre?.toLowerCase().includes(term);
        return matchLote || matchProveedor || matchCliente;
      }

      return true;
    });
  };

  function getFilteredByKey(key, value) {
    const val1 = key.tipo.toLowerCase();
    const val = value.toLowerCase();

    if (val1.includes(val)) {
      return key;
    }

    return null;
  }

  const onClickExportExcel = () => {
    exportAndDownloadExcel('movimientos', convertirDataStockMoveExcel(data, productName));
  };

  const data = getData();

  if (load_movimiento) {
    return (
      <Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title={`Movimientos - ${productName}`}
              breadcrumbItem={`Inventario - ${stockType}`}
              breadcrumbItemUrl={`/stock/${stockType}`}
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
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={`Movimientos - ${productName}`}
            breadcrumbItem={`Inventario - ${stockType}`}
            breadcrumbItemUrl={`/stock/${stockType}`}
          />
          <Row className="d-flex justify-content-between">
            <div className="col-md-4 col-sm-12 mb-3">
              <input
                className="form-control"
                placeholder="Buscar por lote, cliente o proveedor"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-12 mb-3">
              <Select
                value={filterType}
                onChange={(e) => {
                  handleFilterType(e);
                }}
                options={filterOptions}
                classNamePrefix="select2-selection"
                menuPosition="fixed"
              />
            </div>

            <div className="col-md-4 col-sm-12 mb-3">
              <Row>
                <div className="col-md-6 col-sm-12 mb-3">
                  <Link to={`/product/movements/out/${stockType}/${productName}/${productId}`}>
                    <button
                      type="button"
                      className="btn btn-danger waves-effect waves-light"
                      style={{ width: '100%' }}
                    >
                      Agregar salida <i className="mdi mdi-minus align-middle ms-2"></i>
                    </button>
                  </Link>
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <Link to={`/product/movements/in/${stockType}/${productName}/${productId}`}>
                    <button
                      type="button"
                      className="btn btn-success waves-effect waves-light"
                      style={{ width: '100%' }}
                    >
                      Agregar entrada <i className="mdi mdi-plus align-middle ms-2"></i>
                    </button>
                  </Link>
                </div>
              </Row>
            </div>
          </Row>
          <Row className="">
            <div className="col mb-3">
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
          </Row>
          <Row>
            <div className="col mb-3">
              <Card>
                <CardBody>
                  {filter === 'ANULACIONES' ? (
                    <>
                      {loadingAnulaciones ? (
                        <div className="text-center py-5">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando anulaciones...</span>
                          </div>
                        </div>
                      ) : anulaciones.length === 0 ? (
                        <div className="text-center py-5">
                          <p className="mb-2">
                            No se encontraron anulaciones en los últimos 30 días.
                          </p>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setSearch('');
                              setFilter('ANULACIONES');
                            }}
                          >
                            Volver a cargar
                          </button>
                        </div>
                      ) : (
                        <div className="table-responsive mb-3">
                          <table className="table table-hover table-striped mb-0">
                            <thead>
                              <tr>
                                <th>Platillo</th>
                                <th>Motivo</th>
                                <th>Usuario</th>
                                <th>Monto</th>
                                <th>Deducciones</th>
                                <th>Acción</th>
                                <th>Fecha</th>
                              </tr>
                            </thead>
                            <tbody>
                              {anulaciones.map((item, i) => (
                                <tr key={`anulacion-${i}`}>
                                  <td>{item.platillo || '-'}</td>
                                  <td>{item.motivo || '-'}</td>
                                  <td>{item.usuarioAnulo || '-'}</td>
                                  <td>{item.monto ? `₡${item.monto}` : '-'}</td>
                                  <td>
                                    {item.deducciones?.length ? (
                                      <ul className="mb-0">
                                        {item.deducciones.map((d, k) => (
                                          <li key={`ded-${k}`} className="small mb-1">
                                            {d.nombre || '-'}: {d.cantidad ?? '-'} {d.unidad || ''}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                  <td>{item.accion || '-'}</td>
                                  <td>
                                    {item.fecha
                                      ? new Date(item.fecha).toLocaleString('es-CR')
                                      : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  ) : (
                    <DataList
                      onDelete={undefined}
                      data={data}
                      type="stockMove"
                      displayLength={9}
                      {...props}
                    />
                  )}
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default StockMove;
