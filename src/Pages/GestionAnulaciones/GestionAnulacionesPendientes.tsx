import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardBody, Container, Row, Col, Badge, Button } from 'reactstrap';
import Breadcrumbs from '@/components/Common/Breadcrumb';
import {
  OBTENER_ANULACIONES_PENDIENTES,
  APROBAR_ANULACION,
  RECHAZAR_ANULACION
} from '@/services/MovimientosRestauranteService';
import { OBTENER_USUARIO_CODIGO } from '@/services/UsuarioService';
import ModalAprobarAnulacion from '@/components/Modals/ModalAprobarAnulacion';

const GestionAnulacionesPendientes = () => {
  document.title = 'Gestión de Anulaciones | FARO';

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnulacion, setSelectedAnulacion] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  // Get current user from cedula stored in localStorage
  const cedula = localStorage.getItem('cedula');
  const { data: dataUsuario } = useQuery(OBTENER_USUARIO_CODIGO, {
    variables: { codigo: cedula },
    skip: !cedula,
    pollInterval: 1000
  });

  useEffect(() => {
    if (dataUsuario?.obtenerUsuarioByCodigo) {
      setUsuarioActual(dataUsuario.obtenerUsuarioByCodigo);
    }
  }, [dataUsuario]);

  const {
    loading,
    error,
    data: dataPendientes,
    refetch
  } = useQuery(OBTENER_ANULACIONES_PENDIENTES);

  const [aprobarMutation] = useMutation(APROBAR_ANULACION, {
    onCompleted: (data) => {
      if (data.aprobarAnulacion.estado) {
        refetch();
        setModalOpen(false);
        setSelectedAnulacion(null);
      }
    }
  });

  const [rechazarMutation] = useMutation(RECHAZAR_ANULACION, {
    onCompleted: (data) => {
      if (data.rechazarAnulacion.estado) {
        refetch();
        setModalOpen(false);
        setSelectedAnulacion(null);
      }
    }
  });

  const handleAprobar = (anulacion) => {
    setSelectedAnulacion(anulacion);
    setModalAction('APROBAR');
    setModalOpen(true);
  };

  const handleRechazar = (anulacion) => {
    setSelectedAnulacion(anulacion);
    setModalAction('RECHAZAR');
    setModalOpen(true);
  };

  const handleConfirm = async (motivo) => {
    if (!selectedAnulacion || !usuarioActual) return;

    if (modalAction === 'APROBAR') {
      await aprobarMutation({
        variables: {
          input: {
            anulacionId: selectedAnulacion._id,
            usuarioAprobador: usuarioActual.id,
            motivo
          }
        }
      });
    } else if (modalAction === 'RECHAZAR') {
      await rechazarMutation({
        variables: {
          input: {
            anulacionId: selectedAnulacion._id,
            usuarioAprobador: usuarioActual.id,
            motivo
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Gestión de Anulaciones Pendientes" />
          <Row>
            <div className="col text-center pt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Gestión de Anulaciones Pendientes" />
          <Row>
            <Col md="12">
              <div className="alert alert-danger mt-3">Error: {error.message}</div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const anulaciones = dataPendientes?.obtenerAnulacionesPendientes || [];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Gestión de Anulaciones Pendientes" />

        <Row className="mb-3">
          <Col md="12">
            <Card>
              <CardBody>
                <h5 className="mb-3">
                  Anulaciones esperando aprobación{' '}
                  <Badge color="warning" pill>
                    {anulaciones.length}
                  </Badge>
                </h5>

                {anulaciones.length === 0 ? (
                  <div className="alert alert-info">
                    No hay anulaciones pendientes de aprobación
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-sm">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Platillo</th>
                          <th>Usuario</th>
                          <th>Motivo</th>
                          <th>Tipo</th>
                          <th>Monto</th>
                          <th>Ingredientes</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anulaciones.map((anul) => (
                          <tr key={anul._id}>
                            <td>{new Date(anul.fecha).toLocaleDateString()}</td>
                            <td>
                              <strong>{anul.platillo || 'Sin platillo'}</strong>
                            </td>
                            <td>{anul.usuarioAnulo}</td>
                            <td>
                              <small className="text-muted">{anul.motivo || '-'}</small>
                            </td>
                            <td>
                              {anul.esConCobro ? (
                                <Badge color="danger">Con Cobro</Badge>
                              ) : (
                                <Badge color="success">Sin Cobro</Badge>
                              )}
                            </td>
                            <td className="fw-bold">₡{anul.monto?.toLocaleString() || '0'}</td>
                            <td>
                              {anul.deducciones?.length > 0 ? (
                                <small>
                                  {anul.deducciones.map((d) => (
                                    <div key={d.producto}>
                                      {d.nombre}: {d.cantidad} {d.unidad}
                                    </div>
                                  ))}
                                </small>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  color="success"
                                  onClick={() => handleAprobar(anul)}
                                  title="Aprobar anulación"
                                >
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => handleRechazar(anul)}
                                  title="Rechazar anulación"
                                >
                                  Rechazar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <ModalAprobarAnulacion
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        anulacion={selectedAnulacion}
        action={modalAction}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default GestionAnulacionesPendientes;
