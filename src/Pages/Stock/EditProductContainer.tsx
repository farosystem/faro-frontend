import React, { useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import EditProduct from './EditProduct';
import withRouter from '@/components/Common/withRouter';
import Breadcrumbs from '@/components/Common/Breadcrumb';
import { OBTENER_MATERIA_PRIMA } from '@/services/MateriaPrimaService';
import { ObtenerMateriaPrimaQuery, ObtenerMateriaPrimaQueryVariables } from '@/gql/graphql';

interface EditProductParams {
  stockType: string;
  id: string;
}

const EditProductContainer = () => {
  document.title = 'Inventario | FARO';

  const { stockType, id } = useParams();
  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery<
    ObtenerMateriaPrimaQuery,
    ObtenerMateriaPrimaQueryVariables
  >(OBTENER_MATERIA_PRIMA, {
    skip: !id,
    variables: { id: id },
    pollInterval: 1000,
    fetchPolicy: 'network-only'
  });

  // keep polling alive to update existencias/etc
  useEffect(() => {
    if (startPolling && stopPolling) {
      startPolling(1000);
      return () => {
        stopPolling();
      };
    }
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (error) {
      console.error('Error loading materia prima', error);
    }
    if (data) {
      console.debug('materia prima data', data);
    }
  }, [data, error]);

  if (loading) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Editar producto"
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
      </React.Fragment>
    );
  }

  if (error) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Editar producto"
              breadcrumbItem={`Inventario - ${stockType}`}
              breadcrumbItemUrl={`/stock/${stockType}`}
            />
            <Row>
              <div className="col">
                <div className="alert alert-danger mt-3" role="alert">
                  Ocurrió un error al cargar el producto: {error.message}
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }

  const product = data?.obtenerMateriaPrima;
  if (!product) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Editar producto"
              breadcrumbItem={`Inventario - ${stockType}`}
              breadcrumbItemUrl={`/stock/${stockType}`}
            />
            <Row>
              <div className="col">
                <div className="alert alert-warning mt-3" role="alert">
                  Producto no encontrado.
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }

  return (
    <>
      <EditProduct stockType={stockType} product={product} />
    </>
  );
};

export default withRouter(EditProductContainer);
