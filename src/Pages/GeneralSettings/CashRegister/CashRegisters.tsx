import React, { useState } from 'react';
import { Container, Row, Card, CardBody } from 'reactstrap';
import withRouter from '@/components/Common/withRouter';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { Link, useNavigate } from 'react-router-dom';
import DataList from '@/components/Common/DataList';
import { useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import { showInfoAlert } from '@/helpers/alert';
import { OBTENER_CAJAS } from '@/services/CajasService';
import { convertDataCashRegisterExcel, exportAndDownloadExcel } from '@/helpers/exportExcel';
import { DESACTIVAR_CAJA } from '@/services/CajasService';

const CashRegisters = ({ ...props }) => {
  document.title = 'Cajas | FARO';
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);

  const {
    loading: loading_caja,
    error: error_caja,
    data: data_caja,
    refetch
  } = useQuery(OBTENER_CAJAS, { pollInterval: 1000 });
  const [desactivar] = useMutation(DESACTIVAR_CAJA);

  const getData = () => {
    if (data_caja) {
      if (data_caja.obtenerCajas) {
        return data_caja.obtenerCajas.filter((value, index) => {
          if (filter !== '') {
            return getFilteredByKey(value, filter);
          }
          return value;
        });
      }
    }
    return [];
  };

  function getFilteredByKey(key, value) {
    const val1 = key.codigo.toLowerCase();
    const val2 = key.nombre.toLowerCase();
    const val3 = key.numero.toString();
    const val = value.toLowerCase();
    if (
      val1.includes(val) ||
      val2.includes(val) ||
      val2.includes(val.replace('%', '')) ||
      val3.includes(val)
    ) {
      return key;
    }
  }

  const onDeleteCashRegister = async (id, name) => {
    Swal.fire({
      title: 'Eliminar caja',
      text: `¿Está seguro de eliminar la caja ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0BB197',
      cancelButtonColor: '#FF3D60',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, ¡eliminar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await desactivar({ variables: { id } });
        const payload = data.cierreParcial ?? data.desactivarCaja;
        const { estado, message } = payload || {};
        if (estado) {
          showInfoAlert({
            title: 'Caja eliminada',
            text: message,
            icon: 'success',
            timer: 3000,
            position: 'center'
          });
          refetch();
        } else {
          showInfoAlert({
            title: 'Eliminar Caja',
            text: message,
            icon: 'error',
            timer: 3000,
            position: 'center'
          });
        }
      }
    });
  };

  const onClickExportExcel = () => {
    exportAndDownloadExcel('Cajas', convertDataCashRegisterExcel(data));
  };

  const data = getData();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Gestión Cajas"
            breadcrumbItem="Ajustes Generales"
            breadcrumbItemUrl="/generalsettings"
          />

          <Row className="flex" style={{ alignItems: 'flex-end' }}>
            <div className="col-md-10 mb-3">
              <label htmlFor="search-input" className="col-md-3 col-form-label">
                Busca por nombre
              </label>
              <input
                className="form-control"
                id="search-input"
                type="search"
                placeholder="Escribe el nombre, numero, o código"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
              />
            </div>
            <div className="col-md-2 col-sm-12 mb-3">
              <Link to="/newcashregister">
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
                  <DataList
                    onDelete={onDeleteCashRegister}
                    data={data}
                    type="cashRegisters"
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

export default withRouter(CashRegisters);
