import React, { useState, useEffect, useReducer } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '@/components/Common/Breadcrumb';
import Select from 'react-select';
import ListInfo from '@/components/Common/ListInfo';
import { useMutation } from '@apollo/client';
import { showInfoAlert } from '@/helpers/alert';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_PAQUETE, OBTENER_PAQUETE, OBTENER_PAQUETES } from '@/services/PaquetesService';
import TabeListService from '@/components/Common/TableListService';
import { Servicios } from '@/gql/graphql';
import { packageReducer } from './context/packageReducer';
import { packageInitialState } from './context/packageInitialState';
import { usePackageCatalog } from './hooks/usePackageCatalog';
import { OBTENER_TOURS } from '@/services/TourService';
import { OBTENER_SERVICIO } from '@/services/ServiciosExtraService';
import { OBTENER_TEMPORADAS } from '@/services/TemporadaService';
import { useQuery } from '@apollo/client';
import { typePackages } from '@/constants/packageTypes';

const EditPackage = ({ bookingId, updatePackage }) => {
  document.title = 'Administrador de paquetes | FARO';

  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(packageReducer, packageInitialState);
  const { service, services: serviceList } = state;

  const { data: tours, loading: loadingTours } = useQuery(OBTENER_TOURS);
  const { data: services, loading: loadingServices } = useQuery(OBTENER_SERVICIO);
  const { data: seasons, loading: loadingSeasons } = useQuery(OBTENER_TEMPORADAS);

  const {
    loading: loadingPackage,
    package: pkg,
    packages,
    error: errorPackage
  } = usePackageCatalog({ id: bookingId ?? id });

  const [actualizar] = useMutation(UPDATE_PAQUETE);

  const [disableSave, setDisableSave] = useState(true);

  const [typePackage, setTypePackage] = useState(null);
  // const [service, setService] = useState('');
  const [tour, setTour] = useState(null);
  const [toursList, setToursList] = useState([]);
  const [season, setSeason] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // If the package returned by the single query is empty, try to find it in the packages list
    let pkgToUse = pkg;
    if (pkgToUse && (pkgToUse.nombre == null || pkgToUse.nombre === '')) {
      const searchId = bookingId ?? id;
      if (searchId) {
        const found = (packages as any) ? (packages as any).find((p) => p.id === searchId) : null;
        if (found) {
          pkgToUse = found;
        }
      }
    }

    if (pkgToUse != null) {
      dispatch({
        type: 'SAVE_PACKAGE',
        update: {
          nombre: pkgToUse.nombre ?? '',
          descripcion: pkgToUse.descripcion ?? '',
          tours: pkgToUse.tours ?? [],
          servicios: pkgToUse.servicios ?? [],
          temporadas: pkgToUse.temporadas ?? null,
          precio: pkgToUse.precio ?? 0,
          tipo: pkgToUse.tipo ?? ''
        }
      });

      // Initialize services list in reducer from package if any
      dispatch({ type: 'SET_SERVICES', update: pkgToUse.servicios ?? [] });

      // Fill local form fields from package (only if empty to avoid overwriting user edits)
      if (name === '' && description === '' && price === 0 && !typePackage) {
        setName(pkgToUse.nombre ?? '');
        setDescription(pkgToUse.descripcion ?? '');
        setPrice(pkgToUse.precio ?? 0);

        // Find matching package type option
        const foundType = typePackages.find((t) => t.value === (pkgToUse.tipo ?? '')) || null;
        setTypePackage(foundType);

        // Set tours list
        setToursList(pkgToUse.tours ?? []);

        // Resolve season into the Select option shape { value: seasonObj, label }
        let seasonOption = null;
        if (pkgToUse.temporadas) {
          // pkg.temporadas can be an id or an object depending on the context
          if (typeof pkgToUse.temporadas === 'string' || typeof pkgToUse.temporadas === 'number') {
            const s = (seasons as any)?.obtenerTemporada
              ? (seasons as any).obtenerTemporada.find((x) => x.id === pkgToUse.temporadas)
              : null;
            if (s) seasonOption = { value: s, label: s.nombre };
            else seasonOption = { value: pkgToUse.temporadas, label: '' };
          } else {
            seasonOption = { value: pkgToUse.temporadas, label: pkgToUse.temporadas?.nombre ?? '' };
          }
        }
        setSeason(seasonOption);
      }
    }
  }, [pkg, seasons, packages]);

  // Also synchronize when reducer state is set (covers cases where SAVE_PACKAGE fired from elsewhere)
  useEffect(() => {
    const pkgState = state.state || {};
    const hasPkg = Object.keys(pkgState).length > 0;
    if (!hasPkg) return;

    // Only initialize if fields are empty so we don't overwrite user's typing
    if (name === '' && description === '' && price === 0 && !typePackage) {
      setName(pkgState.nombre ?? '');
      setDescription(pkgState.descripcion ?? '');
      setPrice((pkgState.precio as any) ?? 0);

      const foundType = typePackages.find((t) => t.value === (pkgState.tipo ?? '')) || null;
      setTypePackage(foundType);
      setToursList((pkgState.tours as any) ?? []);

      let seasonOption = null;
      if (pkgState.temporadas) {
        if (typeof pkgState.temporadas === 'string' || typeof pkgState.temporadas === 'number') {
          const s = (seasons as any)?.obtenerTemporada
            ? (seasons as any).obtenerTemporada.find((x) => x.id === pkgState.temporadas)
            : null;
          if (s) seasonOption = { value: s, label: s.nombre };
          else seasonOption = { value: pkgState.temporadas, label: '' };
        } else {
          seasonOption = { value: pkgState.temporadas, label: pkgState.temporadas?.nombre ?? '' };
        }
      }
      setSeason(seasonOption);
    }
  }, [state.state, seasons]);

  const getTours = () => {
    const data = [];
    if (tours?.obtenerTours) {
      tours.obtenerTours.forEach((item) => {
        data.push({
          value: item,
          label: item.nombre
        });
      });
    }
    return data;
  };

  const handleTours = (a) => {
    setTour(a);
  };

  const addTour = () => {
    if (tour) {
      const exist = toursList.find((e) => e.id === tour.value.id);
      if (exist) {
        showInfoAlert({
          title: 'Oops',
          text: 'Ya existe esta comodidad en la habitación',
          icon: 'warning',
          timer: 3000,
          position: 'center'
        });
        setTour(null);
        return;
      }

      setToursList([...toursList, tour.value]);
      setTour(null);
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

  const eliminarTours = (nombre) => {
    setToursList(toursList.filter((a) => a.nombre !== nombre));
  };

  const getServices = () => {
    const data = [];
    // services can be either the raw query object with `obtenerServicios` or already the array of Servicios
    if (Array.isArray(services)) {
      services.forEach((item) => {
        data.push({ value: item, label: item.nombre });
      });
    } else if ((services as any)?.obtenerServicios) {
      (services as any).obtenerServicios.forEach((item) => {
        data.push({ value: item, label: item.nombre });
      });
    }
    return data;
  };

  const handleService = (selectedOption: any) => {
    // selectedOption is { value: Servicios, label: string }
    // Save the raw service object in reducer
    const svc = selectedOption?.value ?? null;
    dispatch({ type: 'UPDATE_CURRENT_SERVICE', update: svc });
  };

  const addService = () => {
    if (service && service.id) {
      const exist = (serviceList || []).find((e) => e.id === service.id);
      if (exist) {
        showInfoAlert({
          title: 'Oops',
          text: 'Ya existe esta comodidad en la habitación',
          icon: 'warning',
          timer: 3000,
          position: 'center'
        });
        dispatch({ type: 'CLEAN' });
        return;
      }

      // Add raw service object to reducer list and clear current selection
      dispatch({ type: 'SAVE_SERVICE_TO_LIST', update: service as Partial<Servicios> });
      dispatch({ type: 'CLEAN' });
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

  const eliminarService = (nombre) => {
    dispatch({ type: 'REMOVE_SERVICE', nombre });
  };

  const getSeasons = () => {
    const data = [];
    if (seasons?.obtenerTemporada) {
      seasons.obtenerTemporada.forEach((item) => {
        data.push({
          value: item,
          label: item.nombre
        });
      });
    }
    return data;
  };

  const handleSeason = (a) => {
    setSeason(a);
  };

  const handlePrice = (a) => {
    setPrice(a);
  };

  useEffect(() => {
    setDisableSave(
      !typePackage ||
        price <= 0 ||
        name === '' ||
        (toursList.length === 0 && (serviceList || []).length === 0) ||
        !season
    );
  }, [typePackage, price, name, toursList, serviceList, season]);

  const cleanData = () => {
    setTypePackage(null);
    setName('');
    setPrice(0);
    setTour(null);
    // setService(null);
    dispatch({ type: 'RESET_ALL' });
    setToursList([]);
    setDescription('');
  };

  const updateAmountService = (type, amount, service) => {
    // Eliminar si es 0 o actualizar el extra
    if (Number(amount) === 0) {
      dispatch({ type: 'REMOVE_SERVICE', nombre: service.nombre });
      return;
    }

    dispatch({
      type: 'UPDATE_SERVICE_AMOUNT',
      nombre: service.nombre,
      amount: amount !== '' ? Number(amount) : 0
    });
  };
  const onClickSave = async () => {
    try {
      setDisableSave(true);

      // Normalize temporada value: try extract ID. Season can be select option, object without id, or id.
      let temporadasId: string | null = null;
      const maybeSeason = season?.value ?? season;
      if (maybeSeason) {
        if (typeof maybeSeason === 'string' || typeof maybeSeason === 'number') {
          temporadasId = String(maybeSeason);
        } else if ((maybeSeason as any).id) {
          temporadasId = (maybeSeason as any).id;
        } else if ((maybeSeason as any).nombre) {
          // Try to find matching season in catalog by nombre
          const found = (seasons as any)?.obtenerTemporada?.find(
            (s) => s.nombre === (maybeSeason as any).nombre
          );
          if (found) temporadasId = found.id;
        }
      }

      const normalizedServices = (serviceList || []).map((s) => ({
        ...s,
        extra: (s as any).extra !== undefined ? Number((s as any).extra) : undefined
      }));

      const input: any = {
        tipo: typePackage?.value ?? (state.state && (state.state as any).tipo) ?? '',
        nombre: name,
        servicios: normalizedServices,
        tours: toursList,
        temporadas: temporadasId ?? null,
        descripcion: description,
        precio: price,
        estado: 'ACTIVO'
      };

      if (!bookingId) {
        const { data } = await actualizar({
          variables: { id: !bookingId ? id : bookingId, input },
          errorPolicy: 'all',
          refetchQueries: [
            { query: OBTENER_PAQUETE, variables: { id: !bookingId ? id : bookingId } },
            { query: OBTENER_PAQUETES }
          ],
          awaitRefetchQueries: true
        });

        if (!data || !data.actualizarPaquete) {
          showInfoAlert({
            title: 'Oops',
            text: 'La respuesta del servidor no contiene información del paquete',
            icon: 'error',
            timer: 3000,
            position: 'center'
          });
          setDisableSave(false);
          return;
        }

        const { estado, message } = data.actualizarPaquete;
        if (estado) {
          showInfoAlert({
            title: 'Excelente',
            text: message,
            icon: 'success',
            timer: 3000,
            position: 'center'
          });
          cleanData();

          // After successful update, navigate back to list
          navigate('/hotelsettings/hotelpackages');
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
      } else {
        showInfoAlert({
          title: 'Excelente',
          text: 'Paquete actualizado para la reserva',
          icon: 'success',
          timer: 3000,
          position: 'center'
        });
        updatePackage(input);
        cleanData();
      }
    } catch (error: any) {
      showInfoAlert({
        title: 'Oops',
        text: 'Ocurrió un error inesperado al guardar el paquete',
        icon: 'error',
        timer: 3000,
        position: 'center'
      });
      setDisableSave(false);
    }
  };

  if (loadingPackage) {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Editar tipo de paquete"
              breadcrumbItem="Paquete"
              breadcrumbItemUrl="/hotelsettings/hotelpackages"
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

  if (errorPackage) {
    return (
      <React.Fragment>
        <div>Hubo un Error!</div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className={!bookingId && 'page-content'}>
        <Container fluid={true}>
          {!bookingId && (
            <Breadcrumbs
              title="Editar paquete"
              breadcrumbItem="Paquetes"
              breadcrumbItemUrl="/hotelsettings/hotelpackages"
            />
          )}
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
            <Row className="d-flex justify-content-between shadow_wizard rounded-5">
              <Col className="col-md-6  d-flex justify-content-center flex-wrap">
                <div className="col-md-11 col-sm-9 m-2">
                  <label htmlFor="season" className="form-label">
                    * Temporada
                  </label>
                  <Select
                    id="season"
                    value={season}
                    onChange={(e) => {
                      handleSeason(e);
                    }}
                    options={getSeasons()}
                    placeholder="Temporadas"
                    classNamePrefix="select2-selection"
                  />
                </div>
                <div className="col-md-11 col-sm-9 m-2">
                  <label htmlFor="package" className="form-label">
                    * Tipo de paquete
                  </label>
                  <Select
                    id="package"
                    value={typePackage}
                    onChange={(e) => {
                      setTypePackage(e);
                    }}
                    options={typePackages}
                    classNamePrefix="select2-selection"
                  />
                </div>
                <div className="col-md-11 col-sm-9 m-2">
                  <label htmlFor="name" className="form-label">
                    * Nombre del paquete
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-11 col-sm-9 m-1 p-0 mt-4">
                  <Card className="p-0 table_list">
                    <CardBody>
                      <Row>
                        <div className="col mb-2">
                          <label htmlFor="service" className="form-label">
                            * Servicios
                          </label>
                        </div>
                      </Row>
                      <div className="row row-cols-lg-auto g-3 align-items-center">
                        <div className="col-xl-9 col-md-12 mb-2">
                          <Select
                            id="service"
                            value={service ? { value: service, label: service.nombre } : null}
                            onChange={(e) => {
                              handleService(e);
                            }}
                            options={getServices()}
                            placeholder="Servicios"
                            classNamePrefix="select2-selection"
                          />
                        </div>
                        <div className="col-12 mb-1">
                          <button
                            type="submit"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              addService();
                            }}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                      <Row>
                        <TabeListService
                          key={serviceList ? serviceList.length : 'empty'}
                          headers={['Servicio']}
                          keys={['nombre']}
                          config={{
                            enableAmount: true,
                            enableDelete: true,
                            actionDelete: eliminarService,
                            actionAmount: updateAmountService,
                            enableEdit: false
                          }}
                          data={serviceList}
                          mainKey={'nombre'}
                          secondKey={undefined}
                          type="package"
                          amount="Cantidad"
                          enableAmount={true}
                          enableDelete={true}
                          actionDelete={eliminarService}
                          actionAmount={updateAmountService}
                        />
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col className="col-md-6 d-flex justify-content-center flex-wrap">
                <div className="col-md-11 col-sm-9 m-2">
                  <label htmlFor="price" className="form-label">
                    * Precio por paquete
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="price"
                    min="0"
                    value={price}
                    onChange={(e) => {
                      handlePrice(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-11 col-sm-9 m-2">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="col-md-11 col-sm-9 m-1 p-0 ">
                  <Card className="p-0 table_list">
                    <CardBody>
                      <Row>
                        <div className="col mb-2">
                          <label htmlFor="tour" className="form-label">
                            * tours
                          </label>
                        </div>
                      </Row>
                      <div className="row row-cols-lg-auto g-3 align-items-center">
                        <div className="col-xl-9 col-md-12 mb-2">
                          <Select
                            id="tour"
                            value={tour}
                            onChange={(e) => {
                              handleTours(e);
                            }}
                            options={getTours()}
                            placeholder="tours"
                            classNamePrefix="select2-selection"
                          />
                        </div>
                        <div className="col-12 mb-1">
                          <button
                            type="submit"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              addTour();
                            }}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                      <Row>
                        <ListInfo
                          data={toursList}
                          headers={['Tour', 'Descripción']}
                          keys={['nombre', 'descripcion']}
                          enableEdit={false}
                          enableDelete={true}
                          actionDelete={eliminarTours}
                          mainKey={'nombre'}
                          secondKey={'descripcion'}
                          actionEdit={undefined}
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

export default EditPackage;
