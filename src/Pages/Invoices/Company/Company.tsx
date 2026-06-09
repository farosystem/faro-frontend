import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container, Row } from 'reactstrap';
import Breadcrumbs from '@/components/Common/Breadcrumb';
import { useQuery, useMutation } from '@apollo/client';
import {
  OBTENER_FACTURAS_PARAMETROS,
  UPSERT_FACTURAS_PARAMETRO
} from '@/services/FacturasParametrosService';
import {
  OBTENER_ACTIVIDADES_ECONOMICAS,
  INSERTAR_ACTIVIDAD_ECONOMICA,
  ACTUALIZAR_ACTIVIDAD_ECONOMICA,
  ELIMINAR_ACTIVIDAD_ECONOMICA
} from '@/services/MovimientosRestauranteService';
import { ActividadEconomica, Query } from '@/gql/graphql';
import { showConfirmAlert, showInfoAlert } from '@/helpers/alert';
import styles from './Company.module.css';

interface EconomicActivityProps {
  activities: ActividadEconomica[];
}

interface EconomicActivityChipProps extends EconomicActivityProps {
  selectedActividad?: ActividadEconomica | null;
  defaultHotelCodigo?: string;
  defaultRestauranteCodigo?: string;
  onSelect?: (actividad: ActividadEconomica) => void;
}

const EconomicActivityChip = memo(
  ({
    activities,
    selectedActividad,
    defaultHotelCodigo,
    defaultRestauranteCodigo,
    onSelect
  }: EconomicActivityChipProps) => {
    const listRef = useRef<HTMLUListElement>(null);

    // when activities list changes, scroll to the bottom so latest items are visible
    useEffect(() => {
      const el = listRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, [activities]);

    return (
      <Fragment>
        <ul ref={listRef} className={styles.container}>
          {activities.map((activity) => {
            const isSelected = selectedActividad?._id === activity._id;
            return (
              <li
                key={activity._id}
                className={`${styles.chip} ${isSelected ? styles.selectedChip : ''}`}
                onClick={() => onSelect?.(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelect?.(activity);
                  }
                }}
              >
                <div className="d-flex align-items-start">
                  <div>
                    <strong className={styles.code}>{activity.codigo}</strong>
                    <span className={styles.description}>{activity.descripcion}</span>
                  </div>
                  <div className="ms-auto text-end">
                    {activity.codigo === defaultHotelCodigo && (
                      <span className="badge bg-info me-1">Hotel</span>
                    )}
                    {activity.codigo === defaultRestauranteCodigo && (
                      <span className="badge bg-success">Restaurante</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }
);

interface EconomicActivityActionsProps {
  selectedActividad: any;
  onActivityCreated?: (actividad: ActividadEconomica) => void;
  onActivityUpdated?: (actividad: ActividadEconomica) => void;
  onActivityDeleted?: (actividadId: string) => void;
}

type ActivityParamType =
  | 'actividad_economica'
  | 'actividad_economica_restaurante'
  | 'actividad_economica_hotel';

interface EconomicActivityActionsProps {
  selectedActividad: any;
  showActions: boolean;
  paramType?: ActivityParamType;
  onActivityCreated?: (actividad: ActividadEconomica) => void;
  onActivityUpdated?: (actividad: ActividadEconomica) => void;
  onActivityDeleted?: (actividadId: string) => void;
}

const EconomicActivityActions = ({
  selectedActividad,
  showActions,
  paramType = 'actividad_economica',
  onActivityCreated,
  onActivityUpdated,
  onActivityDeleted
}: EconomicActivityActionsProps) => {
  const [showNewActivity, setShowNewActivity] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [isReadyToSave, setIsReadyToSave] = useState<boolean>(false);

  const [guardarActividad, { loading: savingGuardar }] = useMutation(UPSERT_FACTURAS_PARAMETRO, {
    refetchQueries: [{ query: OBTENER_FACTURAS_PARAMETROS }]
  });

  const [insertActividad, { loading: insertingActividad }] = useMutation(
    INSERTAR_ACTIVIDAD_ECONOMICA,
    {
      // refresh list after insert
      refetchQueries: [{ query: OBTENER_ACTIVIDADES_ECONOMICAS }]
    }
  );

  const [updateActividad, { loading: updatingActividad }] = useMutation(
    ACTUALIZAR_ACTIVIDAD_ECONOMICA,
    {
      refetchQueries: [{ query: OBTENER_ACTIVIDADES_ECONOMICAS }]
    }
  );

  const [deleteActividad, { loading: deletingActividad }] = useMutation(
    ELIMINAR_ACTIVIDAD_ECONOMICA,
    {
      refetchQueries: [{ query: OBTENER_ACTIVIDADES_ECONOMICAS }]
    }
  );

  const saving = savingGuardar || insertingActividad || updatingActividad || deletingActividad;

  const resetForm = () => {
    setNewCode('');
    setNewDescription('');
    setIsReadyToSave(false);
    setShowNewActivity(false);
    setIsEditMode(false);
  };

  const handleSaveActivity = async () => {
    const activityConfirmation = await showConfirmAlert({
      title: 'Guardar actividad',
      text: 'Esta seguro de guardar la actividad?',
      icon: 'question'
    });

    if (!activityConfirmation) return;

    const codigo = newCode.trim();
    const descripcion = newDescription.trim();

    try {
      if (showNewActivity) {
        if (isEditMode && selectedActividad) {
          // update existing activity
          const result = await updateActividad({
            variables: {
              id: selectedActividad._id,
              input: {
                codigo,
                descripcion,
                codigoSubclaseTribu: '',
                descripcionSubclaseTribu: ''
              }
            }
          });

          const response = result?.data?.actualizarActividadEconomica;
          if (!response?.estado) {
            throw new Error(response?.message ?? 'No se pudo actualizar la actividad económica');
          }

          const updated = response.data;
          if (updated) {
            onActivityUpdated?.(updated);
            await guardarActividad({
              variables: {
                type: paramType,
                value: updated.codigo
              }
            });
          }

          showInfoAlert({
            title: 'Actividad económica actualizada',
            icon: 'success'
          });
        } else {
          // create new activity with entered data
          const result = await insertActividad({
            variables: {
              input: {
                codigo,
                descripcion,
                // provide optional fields explicitly to avoid schema validation issues
                codigoSubclaseTribu: '',
                descripcionSubclaseTribu: ''
              }
            }
          });

          const response = result?.data?.insertarActividadEconomica;
          if (!response?.estado) {
            throw new Error(response?.message ?? 'No se pudo crear la actividad económica');
          }

          const created = response.data;
          if (created) {
            // if the caller wants to select the new activity (and/or persist it), notify them
            onActivityCreated?.(created);

            // save it as the selected factura parameter right away
            await guardarActividad({
              variables: {
                type: paramType,
                value: created.codigo
              }
            });
          }

          showInfoAlert({
            title: 'Actividad económica creada',
            icon: 'success'
          });
        }

        // reset form and close
        resetForm();
      } else if (selectedActividad) {
        // save parameter for existing activity
        await guardarActividad({
          variables: {
            type: paramType,
            value: selectedActividad.codigo
          }
        });
        showInfoAlert({
          title: 'Actividad económica guardada',
          icon: 'success'
        });
      }
    } catch (err) {
      console.error('Error saving actividad económica', err);
      const message =
        err?.message ||
        (err?.graphQLErrors && err.graphQLErrors[0]?.message) ||
        (err?.networkError && err.networkError.message) ||
        (err?.networkError &&
          err.networkError.result &&
          (err.networkError.result.errors?.[0]?.message ||
            JSON.stringify(err.networkError.result))) ||
        'Error desconocido';
      showInfoAlert({
        title: 'Error al guardar',
        text: message,
        icon: 'error'
      });
    }
  };

  const handleSetDefaultFor = async (paramType: ActivityParamType) => {
    if (!selectedActividad) return;

    const confirm = await showConfirmAlert({
      title: 'Guardar como predeterminada',
      text: `Esta seguro de dejar la actividad seleccionada como predeterminada para ${
        paramType === 'actividad_economica_restaurante' ? 'restaurante' : 'hotel'
      }?`,
      icon: 'question'
    });

    if (!confirm) return;

    try {
      await guardarActividad({
        variables: {
          type: paramType,
          value: selectedActividad.codigo
        }
      });

      showInfoAlert({
        title: 'Actividad predeterminada guardada',
        text: `Se estableció ${selectedActividad.codigo} como actividad por defecto para ${
          paramType === 'actividad_economica_restaurante' ? 'restaurante' : 'hotel'
        }.`,
        icon: 'success'
      });
    } catch (err) {
      console.error('Error guardando actividad por defecto', err);
      const message =
        err?.message ||
        (err?.graphQLErrors && err.graphQLErrors[0]?.message) ||
        (err?.networkError && err.networkError.message) ||
        (err?.networkError &&
          err.networkError.result &&
          (err.networkError.result.errors?.[0]?.message ||
            JSON.stringify(err.networkError.result))) ||
        'Error desconocido';
      showInfoAlert({
        title: 'Error al guardar predeterminada',
        text: message,
        icon: 'error'
      });
    }
  };

  const handleEditActivity = () => {
    if (!selectedActividad) return;
    setIsEditMode(true);
    setNewCode(selectedActividad.codigo);
    setNewDescription(selectedActividad.descripcion);
    setIsReadyToSave(
      Boolean(selectedActividad.codigo?.trim() && selectedActividad.descripcion?.trim())
    );
    setShowNewActivity(true);
  };

  const handleDeleteActivity = async () => {
    if (!selectedActividad) return;

    const confirm = await showConfirmAlert({
      title: 'Eliminar actividad',
      text: 'Esta seguro de eliminar la actividad económica seleccionada?',
      icon: 'warning'
    });

    if (!confirm) return;

    try {
      const result = await deleteActividad({
        variables: {
          id: selectedActividad._id
        }
      });

      const response = result?.data?.eliminarActividadEconomica;
      if (!response?.estado) {
        throw new Error(response?.message ?? 'No se pudo eliminar la actividad económica');
      }

      onActivityDeleted?.(selectedActividad._id);

      // clear selected param if it pointed to this activity
      await guardarActividad({
        variables: {
          type: 'actividad_economica',
          value: ''
        }
      });

      showInfoAlert({
        title: 'Actividad económica eliminada',
        icon: 'success'
      });
    } catch (err) {
      console.error('Error eliminando actividad económica', err);
      const message =
        err?.message ||
        (err?.graphQLErrors && err.graphQLErrors[0]?.message) ||
        (err?.networkError && err.networkError.message) ||
        (err?.networkError &&
          err.networkError.result &&
          (err.networkError.result.errors?.[0]?.message ||
            JSON.stringify(err.networkError.result))) ||
        'Error desconocido';
      showInfoAlert({
        title: 'Error al eliminar',
        text: message,
        icon: 'error'
      });
    }
  };

  const handleInputChange = (updatedCode?: string, updatedDescription?: string) => {
    const codigo = (updatedCode ?? newCode).trim();
    const descripcion = (updatedDescription ?? newDescription).trim();
    setIsReadyToSave(Boolean(codigo && descripcion));
  };

  const toggleNewActivity = () => {
    if (showNewActivity) {
      resetForm();
      return;
    }

    setIsEditMode(false);
    setNewCode('');
    setNewDescription('');
    setIsReadyToSave(false);
    setShowNewActivity(true);
  };

  return (
    <div className={styles.economicActivitiesActionsComponent}>
      <div className={styles.actionsContainer}>
        {showActions && selectedActividad && (
          <>
            <button
              className="btn btn-success mt-2 me-2"
              disabled={saving}
              onClick={() => handleSetDefaultFor('actividad_economica_restaurante')}
            >
              {'Predeterminada Restaurante'}
            </button>
            <button
              className="btn btn-secondary mt-2 me-2"
              disabled={saving}
              onClick={() => handleSetDefaultFor('actividad_economica_hotel')}
            >
              {'Predeterminada Hotel'}
            </button>
            <button
              className="btn btn-primary mt-2 me-2"
              disabled={saving}
              onClick={handleEditActivity}
            >
              {'Editar actividad'}
            </button>
            <button
              className="btn btn-danger mt-2 me-2"
              disabled={saving}
              onClick={handleDeleteActivity}
            >
              {'Eliminar actividad'}
            </button>
          </>
        )}
        <button className="btn btn-secondary mt-2" disabled={saving} onClick={toggleNewActivity}>
          {!showNewActivity ? 'Nueva actividad' : 'Cancelar'}
        </button>
      </div>
      {showNewActivity && (
        <div>
          <div className={styles.newActivityContainer}>
            <div className={styles.newActivityForm}>
              <label className="form-label">C&oacute;digo</label>
              <input
                type="text"
                className="form-control"
                value={newCode}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewCode(value);
                  handleInputChange(value, newDescription);
                }}
              />
            </div>
            <div className={styles.newActivityFormDescription}>
              <label className="form-label">Descripci&oacute;n</label>
              <input
                type="text"
                className="form-control"
                value={newDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewDescription(value);
                  handleInputChange(newCode, value);
                }}
              />
            </div>
          </div>
          <div className={styles.newActivityFormSave}>
            <button
              className="btn btn-primary"
              disabled={saving || !isReadyToSave}
              onClick={handleSaveActivity}
            >
              {saving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InvoiceCompany = () => {
  document.title = 'Compañia | FARO';

  const { data: dataFacturasParametros } = useQuery<Query>(OBTENER_FACTURAS_PARAMETROS);

  const {
    data: dataActividades,
    loading: actividadesLoading,
    error: actividadesError,
    refetch: refetchActividades
  } = useQuery<Query>(OBTENER_ACTIVIDADES_ECONOMICAS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only'
  });
  const actividades = dataActividades?.obtenerActividadesEconomicas || [];

  useEffect(() => {
    if (actividadesError) {
      console.error('Error loading actividades económicas:', actividadesError);
    }
  }, [actividadesError]);
  useEffect(() => {
    console.debug('actividades loading', actividadesLoading, 'count', actividades.length);
    console.debug('dataActividades', dataActividades);
  }, [actividadesLoading, actividades.length, dataActividades]);

  const [selectedActividad, setSelectedActividad] = useState(null);
  const [userSelectedActividad, setUserSelectedActividad] = useState(false);

  const defaultHotelCodigo = useMemo(() => {
    return dataFacturasParametros?.obtenerFacturasParametros?.find(
      (p) => p?.type === 'actividad_economica_hotel'
    )?.value;
  }, [dataFacturasParametros]);

  const defaultRestauranteCodigo = useMemo(() => {
    return dataFacturasParametros?.obtenerFacturasParametros?.find(
      (p) => p?.type === 'actividad_economica_restaurante'
    )?.value;
  }, [dataFacturasParametros]);

  // when both activities and saved parameter are available, pick the right item
  useEffect(() => {
    if (!selectedActividad && actividades.length > 0 && dataFacturasParametros) {
      const saved = dataFacturasParametros.obtenerFacturasParametros?.find(
        (p) => p?.type === 'actividad_economica'
      );
      if (saved && saved.value) {
        const act = actividades.find((a) => a.codigo === saved.value);
        if (act) {
          setSelectedActividad(act);
          setUserSelectedActividad(false); // auto-selection, not user-driven
        }
      }
    }
  }, [actividades, dataFacturasParametros, selectedActividad]);

  const getData = () => {
    if (dataFacturasParametros) {
      if (dataFacturasParametros.obtenerFacturasParametros) {
        return dataFacturasParametros.obtenerFacturasParametros.filter((value, index) => {
          return value;
        });
      }
    }
    return [];
  };

  const data = getData();

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Compañia" />
          <Row className="justify-content-between">
            <Row>
              <div className="col-md-6 mb-3">
                <label className="form-label">ENDPOINT</label>
                <input
                  className="form-control"
                  type="text"
                  value="https://apifecr-01-68su.azurewebsites.net/"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CLIENT CODE</label>
                <input className="form-control" type="text" value="745" />
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center mb-2">
                  <h4 className="form-label mt-2 me-2 mb-0">
                    <strong>Actividades Económicas</strong>
                  </h4>
                </div>
                <EconomicActivityActions
                  selectedActividad={selectedActividad}
                  showActions={userSelectedActividad}
                  onActivityCreated={(actividad) => {
                    setSelectedActividad(actividad);
                    setUserSelectedActividad(true);
                  }}
                  onActivityUpdated={(actividad) => {
                    setSelectedActividad(actividad);
                    setUserSelectedActividad(true);
                  }}
                  onActivityDeleted={(actividadId) => {
                    // if the deleted activity was selected, clear selected
                    if (selectedActividad?._id === actividadId) {
                      setSelectedActividad(null);
                    }
                    setUserSelectedActividad(false);
                  }}
                />
                {actividades.length > 0 ? (
                  <EconomicActivityChip
                    activities={actividades}
                    selectedActividad={selectedActividad}
                    defaultHotelCodigo={defaultHotelCodigo}
                    defaultRestauranteCodigo={defaultRestauranteCodigo}
                    onSelect={(actividad) => {
                      if (selectedActividad?._id === actividad._id && userSelectedActividad) {
                        setSelectedActividad(null);
                        setUserSelectedActividad(false);
                      } else {
                        setSelectedActividad(actividad);
                        setUserSelectedActividad(true);
                      }
                    }}
                  />
                ) : (
                  <p className="text-muted small mt-2">
                    {actividadesLoading
                      ? 'Cargando actividades...'
                      : 'No hay actividades económicas disponibles.'}
                  </p>
                )}
              </div>
            </Row>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default InvoiceCompany;
