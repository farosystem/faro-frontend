import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import Select from 'react-select';

import { useMutation } from '@apollo/client';

import Breadcrumbs from '@/components/Common/Breadcrumb';
import { showInfoAlert } from '@/helpers/alert';
import { SAVE_MATERIA_PRIMA } from '@/services/MateriaPrimaService';

interface SelectOption {
  value: string;
  label: string;
}

interface NewProductParams {
  stockType: string;
}

const NewProduct = () => {
  document.title = 'Inventario | FARO';

  const navigate = useNavigate();
  const params = useParams();
  const stockType = (params as { stockType: string }).stockType;

  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [referenciaInterna, setReferenciaInterna] = useState<string>('');
  const [codigoBarras, setCodigoBarras] = useState<string>('');
  const [codigoCabys, setCodigoCabys] = useState<string>('');
  const [insertar] = useMutation(SAVE_MATERIA_PRIMA);
  const [unidad, setUnidad] = useState<SelectOption | null>(null);

  const [precioCompra, setPrecioCompra] = useState<string>('0');
  const [margen, setMargen] = useState<string>('0');

  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    setDisableSave(!nombre || !unidad || nombre.trim().length === 0);
  }, [nombre, unidad]);

  const onSaveProduct = async () => {
    try {
      setDisableSave(true);
      const input = {
        nombre,
        pais: 'Costa Rica',
        unidad: unidad.value,
        existencias: 0,
        estado: 'ACTIVO',
        tipo: stockType,
        referenciaInterna: referenciaInterna,
        codigoBarras: codigoBarras,
        codigoCabys: codigoCabys,
        descripcion: descripcion,
        precioCompra: parseFloat(precioCompra),
        precioCostoPromedio: 0,
        margen: parseFloat(margen)
      };
      const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
      const { estado, message } = data.insertarMateriaPrima;
      if (estado) {
        showInfoAlert({
          title: 'Excelente',
          text: message,
          icon: 'success',
          timer: 3000,
          position: 'center'
        });
        navigate(`/stock/${stockType}`);
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
      console.log(error);
      showInfoAlert({
        title: 'Oops',
        text: 'Ocurrió un error inesperado al guardar el producto',
        icon: 'error',
        timer: 3000
      });
      setDisableSave(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title={`Producto de ${stockType.toLocaleLowerCase()} nuevo`}
            breadcrumbItem={`Inventario - ${stockType}`}
            breadcrumbItemUrl={`/stock/${stockType}`}
          />
          <Row>
            <div className="col mb-3 text-end">
              <button
                disabled={disableSave}
                onClick={onSaveProduct}
                type="button"
                className="btn btn-primary waves-effect waves-light"
              >
                Guardar <i className="ri-save-line align-middle ms-2"></i>
              </button>
            </div>
          </Row>
          <Row>
            <div className="col-md-6 col-sm-12">
              <Row>
                <div className="col-9 mb-3">
                  <label htmlFor="nombre" className="form-label">
                    * Nombre
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
                  />
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="unidad" className="form-label">
                    * Unidad de medida
                  </label>
                  <Select<SelectOption>
                    menuPosition="fixed"
                    id="unidad"
                    value={unidad}
                    onChange={(e: SelectOption | null) => setUnidad(e)}
                    options={[
                      { label: 'Kilogramo', value: 'Kilogramo' },
                      { label: 'Litro', value: 'Litro' },
                      { label: 'Unidades', value: 'Unidades' }
                    ]}
                    classNamePrefix="select2-selection"
                  />
                </div>
              </Row>
              <Row>
                <div className="col mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción del producto
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  ></textarea>
                </div>
              </Row>
            </div>
            <div className="col-md-6 col-sm-12">
              <Row>
                <div className="col-md-4 col-sm-12 mb-3">
                  <label htmlFor="refInterna" className="form-label">
                    Referencia interna
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="refInterna"
                    value={referenciaInterna}
                    onChange={(e) => setReferenciaInterna(e.target.value)}
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3">
                  <label htmlFor="codBarras" className="form-label">
                    Código de barras
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="codBarras"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                  />
                </div>
                <div className="col-md-4 col-sm-12 mb-3">
                  <label htmlFor="codCabys" className="form-label">
                    Código Cabys
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="codCabys"
                    value={codigoCabys}
                    onChange={(e) => setCodigoCabys(e.target.value)}
                  />
                </div>
              </Row>
              <Row>
                <div className="col-md-6 col-sm-12 mb-3">
                  <label htmlFor="precioCosto" className="form-label">
                    Precio costo
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    id="precioCosto"
                    value={precioCompra}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPrecioCompra(e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6 col-sm-12 mb-3">
                  <label htmlFor="profitMargin" className="form-label">
                    Margen de ganancia
                  </label>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="number"
                      id="profitMargin"
                      value={margen}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setMargen(e.target.value)
                      }
                    />
                    <span className="input-group-text" id="basic-addon2">
                      %
                    </span>
                  </div>
                </div>
              </Row>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NewProduct;
