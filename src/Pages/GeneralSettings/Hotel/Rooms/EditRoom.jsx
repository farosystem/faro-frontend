import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';
import SpanSubtitleForm from '../../../../components/Forms/SpanSubtitleForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { OBTENER_COMODIDADES } from '../../../../services/ComodidadesService';
import { OBTENER_TIPOSHABITACION } from '../../../../services/TipoHabitacionService';
import Select from 'react-select';
import { showInfoAlert } from '../../../../helpers/alert';
import ListInfo from '../../../../components/Common/ListInfo';
import {
  OBTENER_HABITACION_BY_ID,
  UPDATE_HABITACION
} from '../../../../services/HabitacionesService';

const EditRoom = () => {
  document.title = 'Habitaciones | FARO';

  const navigate = useNavigate();

  const { id } = useParams();
  const {
    loading: loadingRoom,
    error: errorRoom,
    data: dataRoom,
    startPolling,
    stopPolling
  } = useQuery(OBTENER_HABITACION_BY_ID, {
    variables: { id: id },
    pollInterval: 1000
  });
  const { loading: loadTypeRooms, data: typeRooms } = useQuery(OBTENER_TIPOSHABITACION, {
    pollInterval: 1000
  });
  const { loading: loadAmenities, data: typeAmenities } = useQuery(OBTENER_COMODIDADES, {
    pollInterval: 1000
  });
  const [actualizar] = useMutation(UPDATE_HABITACION);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const [numberRoom, setNumberRoom] = useState('');
  const [typeRoom, setTypeRoom] = useState(null);
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(1);
  const [bedType, setBedType] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenites] = useState(null);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [stateRoom, setStateRoom] = useState(null);
  const [petFriendly, setPetFriendly] = useState(false);
  const [petQuantity, setPetQuantity] = useState(0);

  const stateRooms = [
    {
      label: 'Disponible',
      value: 'Disponible'
    },
    {
      label: 'Mantenimineto',
      value: 'Mantenimineto'
    },
    {
      label: 'Servicio',
      value: 'Servicio'
    },
    {
      label: 'Desmantelada',
      value: 'Desmantelada'
    }
  ];

  useEffect(() => {
    if (dataRoom) {
      setNumberRoom(dataRoom.obtenerHabitacionById.numeroHabitacion);
      setTypeRoom({
        value: dataRoom.obtenerHabitacionById.tipoHabitacion,
        label: dataRoom.obtenerHabitacionById.tipoHabitacion.nombre
      });
      setPrice(dataRoom.obtenerHabitacionById.precioPorNoche);
      setCapacity(dataRoom.obtenerHabitacionById.capacidad || 1);
      setBedType(dataRoom.obtenerHabitacionById.tipoCama || '');
      setDescription(dataRoom.obtenerHabitacionById.descripcion);
      setStateRoom({
        value: dataRoom.obtenerHabitacionById.estado,
        label: dataRoom.obtenerHabitacionById.estado
      });
      setAmenitiesList(dataRoom.obtenerHabitacionById.comodidades);
      setPetFriendly(!!dataRoom.obtenerHabitacionById.petFriendly);
      setPetQuantity(dataRoom.obtenerHabitacionById.petQuantity || 0);
    }
  }, [dataRoom]);

  const getTypeRooms = () => {
    const data = [];
    if (typeRooms?.obtenerTiposHabitaciones) {
      typeRooms.obtenerTiposHabitaciones.forEach((item) => {
        data.push({
          value: item,
          label: item.nombre
        });
      });
    }
    return data;
  };

  const getAmenities = () => {
    const data = [];
    if (typeAmenities?.obtenerComodidades) {
      typeAmenities?.obtenerComodidades.forEach((item) => {
        data.push({
          value: item,
          label: item.nombre
        });
      });
    }
    return data;
  };

  const handleAmenities = (a) => {
    setAmenites(a);
  };

  const addAmenities = () => {
    if (amenities) {
      const exist = amenitiesList.find((e) => e.id === amenities.value.id);
      if (exist) {
        showInfoAlert({
          title: 'Oops',
          text: 'Ya existe esta comodidad en la habitación',
          icon: 'warning',
          timer: 3000,
          position: 'center'
        });
        setAmenites(null);
        return;
      }

      setAmenitiesList([...amenitiesList, amenities.value]);
      setAmenites(null);
    } else {
      showInfoAlert({
        title: 'Oops',
        text: 'No ha seleccionado una comodida',
        icon: 'error',
        timer: 3000,
        position: 'center'
      });
    }
  };

  const eliminarAmenities = (nombre) => {
    setAmenitiesList(amenitiesList.filter((a) => a.nombre !== nombre));
  };

  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    setDisableSave(
      numberRoom.trim().length === 0 ||
        !typeRoom ||
        price <= 0 ||
        capacity <= 0 ||
        // bedType.trim().length === 0 ||
        amenitiesList.length === 0 ||
        !stateRoom
    );
  }, [numberRoom, typeRoom, price, amenitiesList, stateRoom, petFriendly]);

  // Reset quantity when pet friendly is toggled off
  useEffect(() => {
    if (!petFriendly) {
      setPetQuantity(0);
    }
  }, [petFriendly]);

  const onClickSave = async () => {
    try {
      setDisableSave(true);
      const input = {
        numeroHabitacion: numberRoom,
        tipoHabitacion: typeRoom.value.id,
        precioPorNoche: price,
        capacidad: capacity,
        tipoCama: bedType,
        descripcion: description,
        comodidades: amenitiesList.map((a) => a.id),
        estado: stateRoom.value,
        petFriendly,
        petQuantity
      };

      const { data } = await actualizar({
        variables: { id, input },
        errorPolicy: 'all'
      });
      const { estado, message } = data.actualizarHabitacion;
      if (estado) {
        showInfoAlert({
          title: 'Excelente',
          text: message,
          icon: 'success',
          timer: 3000,
          position: 'center'
        });
        navigate('/hotelsettings/rooms');
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
      showInfoAlert(
        'Oops',
        'Ocurrió un error inesperado al actualizar la habitación: ' + error,
        'error',
        3000,
        'top-end'
      );
      setDisableSave(false);
    }
  };

  if (loadAmenities || loadTypeRooms || loadingRoom) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Nuevo Habitación"
              breadcrumbItem="Habitaciones"
              breadcrumbItemUrl="/hotelsettings/rooms"
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

  if (errorRoom) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Nuevo Habitación"
            breadcrumbItem="Habitaciones"
            breadcrumbItemUrl="/hotelsettings/rooms"
          />
          <Card className="p-4">
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
                    <SpanSubtitleForm subtitle="Información de la habitación" />
                  </div>
                </Row>
              </div>
            </Row>
            <Row className="d-flex justify-content-between shadow_service rounded-5 p-4">
              <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                <div className="col-md-11">
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="voucherNumber" className="form-label">
                      Número habitacion
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="voucherNumber"
                      value={numberRoom}
                      onChange={(e) => {
                        setNumberRoom(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="supplier" className="form-label">
                      * Tipo de habitación
                    </label>
                    <Select
                      id="supplier"
                      value={typeRoom}
                      onChange={(e) => {
                        setTypeRoom(e);
                      }}
                      options={getTypeRooms()}
                      classNamePrefix="select2-selection"
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="voucherNumber" className="form-label">
                      Precio por noche
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="voucherNumber"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="capacity" className="form-label">
                      Capacidad (personas)
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="capacity"
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="bedType" className="form-label">
                      Tipo de cama
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="bedType"
                      value={bedType}
                      onChange={(e) => setBedType(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="voucherNumber" className="form-label">
                      Descripción de habitación
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="voucherNumber"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2">
                    <label htmlFor="supplier" className="form-label">
                      * Estado
                    </label>
                    <Select
                      id="supplier"
                      value={stateRoom}
                      onChange={(e) => {
                        setStateRoom(e);
                      }}
                      options={stateRooms}
                      classNamePrefix="select2-selection"
                    />
                  </div>
                  <div className="col-md-12 col-sm-9 m-2 form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="petFriendly"
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="petFriendly">
                      Pet Friendly
                    </label>
                  </div>
                  {petFriendly && (
                    <div className="col-md-12 col-sm-9 m-2">
                      <label htmlFor="petQuantity" className="form-label">
                        Cantidad mascotas
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="petQuantity"
                        value={petQuantity}
                        min={0}
                        onChange={(e) => setPetQuantity(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                <div className="col-md-11 col-sm-9 m-2">
                  <Card className="p-2 shadow_service">
                    <CardBody>
                      <Row>
                        <div className="col-mb-6">Comodidades</div>
                      </Row>
                      <div className="row row-cols-lg-auto g-3 align-items-center">
                        <div className="col-xl-9 col-md-12 mb-2">
                          <Select
                            value={amenities}
                            onChange={(e) => {
                              handleAmenities(e);
                            }}
                            options={getAmenities()}
                            placeholder="Comodidad"
                            classNamePrefix="select2-selection"
                          />
                        </div>
                        <div className="col-12 mb-1">
                          <button
                            type="submit"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              addAmenities();
                            }}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                      <Row>
                        <ListInfo
                          data={amenitiesList}
                          headers={['Comodidad', 'Descripción']}
                          keys={['nombre', 'descripcion']}
                          enableEdit={false}
                          enableDelete={true}
                          actionDelete={eliminarAmenities}
                          mainKey={'nombre'}
                          secondKey={'descripcion'}
                        />
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditRoom;
