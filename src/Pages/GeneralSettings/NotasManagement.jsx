import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from 'reactstrap';
import { useApolloClient } from '@apollo/client';
import { DatePicker, Select as AntSelect, notification } from 'antd';
import dayjs from 'dayjs';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { OBTENER_AREAS } from '../../services/AreasOperativasService';
import {
  OBTENER_NOTAS,
  INSERTAR_NOTA,
  ACTUALIZAR_NOTA,
  DESACTIVAR_NOTA
} from '../../services/NotaService';
import { NOTA_DEFAULT, validarNota } from '../../utils/notas';
import Swal from 'sweetalert2';
import './NotasManagement.scss';

const NotasManagement = () => {
  document.title = 'Gestión de Notas | FARO';

  // Apollo Client
  const client = useApolloClient();

  // State management
  const [notas, setNotas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [notaForm, setNotaForm] = useState(NOTA_DEFAULT);

  // Filters
  const [filtros, setFiltros] = useState({
    area: '',
    fechaInicio: '',
    fechaFin: ''
  });

  // Load data on component mount
  useEffect(() => {
    cargarNotas();
    cargarAreas();
  }, [filtros]);

  // Local service methods
  const obtenerNotas = async () => {
    try {
      const result = await client.query({
        query: OBTENER_NOTAS,
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      });

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors:', result.errors);
        // Return empty array if there are errors
        return [];
      }

      return result.data?.obtenerNotas || [];
    } catch (error) {
      console.error('Error al obtener notas:', error);
      // Return empty array instead of throwing error to prevent UI crash
      return [];
    }
  };

  const insertarNota = async (input) => {
    try {
      const result = await client.mutate({
        mutation: INSERTAR_NOTA,
        variables: { input },
        refetchQueries: [{ query: OBTENER_NOTAS }]
      });
      return result.data?.insertarNota || { estado: false, message: 'Error desconocido' };
    } catch (error) {
      console.error('Error al insertar nota:', error);
      throw error;
    }
  };

  const actualizarNota = async (id, input) => {
    try {
      const result = await client.mutate({
        mutation: ACTUALIZAR_NOTA,
        variables: { id, input },
        refetchQueries: [{ query: OBTENER_NOTAS }]
      });
      return result.data?.actualizarNota || { estado: false, message: 'Error desconocido' };
    } catch (error) {
      console.error('Error al actualizar nota:', error);
      throw error;
    }
  };

  const desactivarNota = async (id) => {
    try {
      const result = await client.mutate({
        mutation: DESACTIVAR_NOTA,
        variables: { id },
        refetchQueries: [{ query: OBTENER_NOTAS }]
      });
      return result.data?.desactivarNota || { estado: false, message: 'Error desconocido' };
    } catch (error) {
      console.error('Error al desactivar nota:', error);
      throw error;
    }
  };

  const cargarNotas = async () => {
    setLoading(true);
    try {
      const notasData = await obtenerNotas();

      setNotas(notasData || []);
    } catch (error) {
      console.error('Error al cargar notas:', error);
      setNotas([]); // Set empty array on error
      notification.error({
        message: 'Error de Conexión',
        description: 'No se pudieron cargar las notas. Verifique la conexión con el servidor.'
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarAreas = async () => {
    try {
      const result = await client.query({
        query: OBTENER_AREAS,
        fetchPolicy: 'cache-first'
      });

      if (result.data?.obtenerAreas) {
        const areasActivas = result.data.obtenerAreas.filter((area) => area.estado === 'ACTIVO');
        setAreas(areasActivas);
      }
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  };

  const handleRemoveFilters = () => {
    setFiltros({
      area: '',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const handleFilterNotas = (nota) => {
    const { area, fechaInicio, fechaFin } = filtros;

    const isAreaMatch = area ? nota.area?.id === area : true;
    const isFechaInicioMatch = fechaInicio ? dayjs(nota.fecha).isSameOrAfter(fechaInicio) : true;
    const isFechaFinMatch = fechaFin ? dayjs(nota.fecha).isSameOrBefore(fechaFin) : true;

    return isAreaMatch && isFechaInicioMatch && isFechaFinMatch;
  };

  const handleOpenModal = (nota = null) => {
    if (nota) {
      setEditingNota(nota);
      setNotaForm({
        nota: nota.nota || '',
        fecha: nota.fecha || dayjs().format('YYYY-MM-DD'),
        area: nota.area?.id || ''
      });
    } else {
      setEditingNota(null);
      setNotaForm({
        ...NOTA_DEFAULT,
        fecha: dayjs().format('YYYY-MM-DD')
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingNota(null);
    setNotaForm(NOTA_DEFAULT);
  };

  const handleFormChange = (field, value) => {
    setNotaForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validarNota(notaForm);
    if (!validation.esValida) {
      notification.error({
        message: 'Error de validación',
        description: validation.errores.join(', ')
      });
      return;
    }

    setSaving(true);
    try {
      let result;

      if (editingNota) {
        result = await actualizarNota(editingNota.id, notaForm);
      } else {
        result = await insertarNota({
          ...notaForm,
          estado: 'ACTIVO'
        });
      }

      if (result.estado) {
        notification.success({
          message: 'Éxito',
          description: result.message
        });
        handleCloseModal();
        cargarNotas();
      } else {
        notification.error({
          message: 'Error',
          description: result.message
        });
      }
    } catch (error) {
      console.error('Error al guardar nota:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudo guardar la nota'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNota = async (id) => {
    const confirmResult = await Swal.fire({
      title: '¿Está seguro de que desea eliminar esta nota?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      const result = await desactivarNota(id);
      if (result.estado) {
        notification.success({
          message: 'Éxito',
          description: result.message
        });
        cargarNotas();
      } else {
        notification.error({
          message: 'Error',
          description: result.message
        });
      }
    } catch (error) {
      console.error('Error al eliminar nota:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudo eliminar la nota'
      });
    }
  };

  const formatFecha = (fecha) => {
    return dayjs(fecha).format('DD/MM/YYYY');
  };

  const checkIsFiltering = () => {
    return Object.values(filtros).some((value) => value);
  };

  const filteredNotas = notas.filter(handleFilterNotas);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true} className="notas-management">
          <Breadcrumbs title="Gestión de Notas" breadcrumbItem="Inicio" breadcrumbItemUrl="/home" />

          {/* Filters */}
          <Card className="mb-3 filters-section">
            <CardHeader>
              <h5 className="mb-0">Filtros</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={5}>
                  <FormGroup>
                    <Label>Área</Label>
                    <AntSelect
                      className="w-100"
                      placeholder="Seleccionar área"
                      value={filtros.area || undefined}
                      onChange={(value) => setFiltros((prev) => ({ ...prev, area: value || '' }))}
                      allowClear
                    >
                      {areas.map((area) => (
                        <AntSelect.Option key={area.id} value={area.id}>
                          {area.nombre}
                        </AntSelect.Option>
                      ))}
                    </AntSelect>
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <Label>Rango de fechas</Label>
                    <DatePicker.RangePicker
                      className="w-100"
                      placeholder={['Fecha inicio', 'Fecha fin']}
                      value={[
                        filtros.fechaInicio ? dayjs(filtros.fechaInicio) : null,
                        filtros.fechaFin ? dayjs(filtros.fechaFin) : null
                      ]}
                      onChange={(dates) => {
                        setFiltros((prev) => ({
                          ...prev,
                          fechaInicio: dates?.[0]?.format('YYYY-MM-DD') || '',
                          fechaFin: dates?.[1]?.format('YYYY-MM-DD') || ''
                        }));
                      }}
                      format="DD/MM/YYYY"
                    />
                  </FormGroup>
                </Col>
                {checkIsFiltering() && (
                  <Col md={2}>
                    <FormGroup>
                      <Label>&nbsp;</Label>
                      <div>
                        <Button color="danger" onClick={() => handleRemoveFilters()}>
                          <i className="mdi mdi-delete me-1"></i>
                          Eliminar Filtros
                        </Button>
                      </div>
                    </FormGroup>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>

          {/* Notes List */}
          <Card>
            <CardHeader className="notas-header">
              <h5 className="mt-2 mb-0">
                {loading ? (
                  <Spinner size="sm" className="me-2" />
                ) : (
                  `Notas (${filteredNotas.length})`
                )}
              </h5>
              <div className="mt-2">
                <Button color="link" onClick={() => handleOpenModal()}>
                  <i className="mdi mdi-plus me-1"></i>
                  Agregar Nota
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner color="primary" />
                  <p className="mt-2">Cargando notas...</p>
                </div>
              ) : filteredNotas.length === 0 ? (
                <div className="text-center py-4">
                  <i
                    className="mdi mdi-note-text-outline text-muted"
                    style={{ fontSize: '48px' }}
                  ></i>
                  <p className="text-muted mt-2">No se encontraron notas</p>
                  <p className="text-muted mt-2">Agrega notas o ajusta el criterio de búsqueda</p>
                </div>
              ) : (
                <Row>
                  {filteredNotas.map((nota) => {
                    return (
                      <Col xl={4} md={6} key={nota.id} className="mb-3">
                        <Card className="nota-card h-100">
                          <CardBody>
                            <div className="nota-card-actions">
                              <Button
                                color="link"
                                className="p-1"
                                onClick={() => handleOpenModal(nota)}
                                title="Editar"
                              >
                                <i className="mdi mdi-pencil"></i>
                              </Button>
                              <Button
                                color="link"
                                className="p-1 text-danger"
                                onClick={() => handleDeleteNota(nota.id)}
                                title="Eliminar"
                              >
                                <i className="mdi mdi-delete"></i>
                              </Button>
                            </div>

                            <h6 className="mb-2">{nota.area?.nombre}</h6>
                            <p className="text-muted small mb-2">{formatFecha(nota.fecha)}</p>
                            <p className="nota-content">{nota.nota}</p>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </CardBody>
          </Card>

          {/* Modal for creating/editing notes */}
          <Modal isOpen={modalOpen} toggle={handleCloseModal} size="lg">
            <ModalHeader toggle={handleCloseModal}>
              {editingNota ? 'Editar Nota' : 'Nueva Nota'}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <Row>
                  <Col md={9}>
                    <FormGroup>
                      <Label>Área *</Label>
                      <AntSelect
                        className="w-100"
                        placeholder="Seleccionar área"
                        value={notaForm.area || undefined}
                        onChange={(value) => handleFormChange('area', value)}
                      >
                        {areas.map((area) => (
                          <AntSelect.Option key={area.id} value={area.id}>
                            {area.nombre}
                          </AntSelect.Option>
                        ))}
                      </AntSelect>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>Fecha *</Label>
                      <DatePicker
                        className="w-100"
                        value={notaForm.fecha ? dayjs(notaForm.fecha) : null}
                        onChange={(date) =>
                          handleFormChange('fecha', date?.format('YYYY-MM-DD') || '')
                        }
                        format="DD/MM/YYYY"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label>Nota *</Label>
                  <Input
                    type="textarea"
                    rows={4}
                    placeholder="Escriba la nota aquí..."
                    value={notaForm.nota}
                    onChange={(e) => handleFormChange('nota', e.target.value)}
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit" disabled={saving}>
                  {saving && <Spinner size="sm" className="me-1" />}
                  {editingNota ? 'Actualizar' : 'Crear'}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NotasManagement;
