import { useEffect, useState, useRef } from 'react';
import {
  Container,
  Row,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import Swal from 'sweetalert2';
import { useQuery } from '@apollo/client';
import { OBTENER_TODAS_MATERIAS_PRIMAS } from '../../../services/MateriaPrimaService';
import { OBTENER_CLIENTES } from '../../../services/ClienteService';
import { Query } from '@/gql/graphql';
import styles from './Billing.module.css';
import { useInvoiceOptions } from '../../../lib/hooks/useInvoiceOptions';
import { useForm } from 'react-hook-form';
import InvoiceOptions from '../components/InvoiceOptions';
import { CondicionesFacturacion } from '@/lib/seiko-hacienda/core/interfaces/condiciones-facturacion';

document.title = 'Facturación | FARO';

const TAX_RATE = 0.13;

const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(value);
  } catch (e) {
    return `₡ ${Math.round(value)}`;
  }
};

const BillingPage = () => {
  const [clienteSearch, setClienteSearch] = useState('');
  const [codigoArticulo, setCodigoArticulo] = useState('');
  const [modalClientes, setModalClientes] = useState(false);
  const [modalArticulos, setModalArticulos] = useState(false);

  const [clienteFacturar, setClienteFacturar] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  // Async selects and caches
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedClientOption, setSelectedClientOption] = useState<any>(null);
  const productOptionsCache = useRef<Record<string, any[]>>({});
  const clientOptionsCache = useRef<Record<string, any[]>>({});
  const clientSelectRef = useRef<any>(null);
  const productSelectRef = useRef<any>(null);

  const [productDefaultOptions, setProductDefaultOptions] = useState<any[]>([]);
  const [clientDefaultOptions, setClientDefaultOptions] = useState<any[]>([]);

  // menu widths so dropdowns match control width (computed on open)
  const clientContainerRef = useRef<HTMLDivElement | null>(null);
  const productContainerRef = useRef<HTMLDivElement | null>(null);
  const [clientMenuWidth, setClientMenuWidth] = useState<number | null>(null);
  const [productMenuWidth, setProductMenuWidth] = useState<number | null>(null);

  // Styles for react-select to make controls consistent with app UI
  const baseSelectStyles: any = {
    container: (provided) => ({ ...provided, width: '100%' }),
    control: (provided) => ({
      ...provided,
      minHeight: 38,
      height: 38,
      borderRadius: 4,
      boxShadow: 'none'
    }),
    valueContainer: (provided) => ({ ...provided, padding: '0 8px' }),
    indicatorsContainer: (provided) => ({ ...provided, height: 38 }),
    dropdownIndicator: (provided) => ({ ...provided, padding: 4 }),
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 })
  };

  // Totales
  const [subTotal, setSubTotal] = useState(0);
  const [impuesto, setImpuesto] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [total, setTotal] = useState(0);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [selectedCondicionVenta, setSelectedCondicionVenta] = useState<any>(null);
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState<any>(null);
  const [exchangeRate, setExchangeRate] = useState<number | ''>('');

  const { setValue } = useForm<CondicionesFacturacion>({
    defaultValues: {}
  });
  const { currencyOptions, documentTypeOptions, paymentMethodOptions, saleConditionOptions } =
    useInvoiceOptions();

  const { data: dataMateriasPrimas, loading: loadingMaterias } = useQuery<Query>(
    OBTENER_TODAS_MATERIAS_PRIMAS
  );
  const { data: dataAllClientes, loading: loadingClientes } = useQuery<Query>(OBTENER_CLIENTES);

  useEffect(() => {
    // recalcular totales cuando cambien items o descuento
    let st = 0;
    let impuestoTotal = 0;

    items.forEach((it) => {
      const lineSubtotal = Number(it.price || 0) * Number(it.qty || 1);
      st += lineSubtotal;

      // si el item trae impuestos, usar el primero (misma regla que en Maintenance)
      if (it.impuestos && it.impuestos.length > 0) {
        const tx = Number(it.impuestos[0].impuesto || TAX_RATE * 100) / 100; // impuesto en porcentaje
        impuestoTotal += lineSubtotal * tx;
      } else {
        impuestoTotal += lineSubtotal * TAX_RATE;
      }
    });

    const tot = st - Number(descuento || 0) + impuestoTotal;

    setSubTotal(st);
    setImpuesto(impuestoTotal);
    setTotal(tot);
  }, [items, descuento]);

  const filteredClientes = () => {
    if (!dataAllClientes?.obtenerClientes) return [];
    if (!clienteSearch) return dataAllClientes.obtenerClientes;
    return dataAllClientes.obtenerClientes.filter((c) =>
      `${c.nombre} ${c.codigo}`.toLowerCase().includes(clienteSearch.toLowerCase())
    );
  };

  const filteredArticulos = () => {
    if (!dataMateriasPrimas?.obtenerTodasMateriasPrimas) return [];
    if (!codigoArticulo) return dataMateriasPrimas.obtenerTodasMateriasPrimas.slice(0, 50);
    return dataMateriasPrimas.obtenerTodasMateriasPrimas.filter((a) => {
      const text = `${(a.descripcion || a.nombre || '').toLowerCase()} ${a.codigoCabys || ''}`;
      return text.includes(codigoArticulo.toLowerCase());
    });
  };

  // Async loaders with small caches and debounce for performance
  const loadProductOptions = debounce((inputValue, callback) => {
    const key = (inputValue || '').toLowerCase().trim();
    const arr = dataMateriasPrimas?.obtenerTodasMateriasPrimas || [];

    // if no input, show the first 5 items to give the user something to pick quickly
    if (!key) {
      const defaults = arr.slice(0, 5).map((a) => ({
        value: a.id,
        label: `${a.descripcion || a.nombre} — ${a.codigoCabys || ''}`,
        data: a
      }));
      callback(defaults);
      return;
    }

    if (productOptionsCache.current[key]) {
      callback(productOptionsCache.current[key]);
      return;
    }

    const results = arr
      .filter((a) =>
        `${(a.descripcion || a.nombre || '').toLowerCase()} ${a.codigoCabys || ''}`.includes(key)
      )
      .slice(0, 50)
      .map((a) => ({
        value: a.id,
        label: `${a.descripcion || a.nombre} — ${a.codigoCabys || ''}`,
        data: a
      }));

    productOptionsCache.current[key] = results;
    callback(results);
  }, 120);

  const loadClientOptions = debounce((inputValue, callback) => {
    const key = (inputValue || '').toLowerCase().trim();
    const arr = dataAllClientes?.obtenerClientes || [];

    // default sample when no input
    if (!key) {
      const defaults = arr
        .slice(0, 5)
        .map((c) => ({ value: c.id, label: `${c.nombre} — ${c.codigo}`, data: c }));
      callback(defaults);
      return;
    }

    if (clientOptionsCache.current[key]) {
      callback(clientOptionsCache.current[key]);
      return;
    }

    const results = arr
      .filter((c) => `${c.nombre} ${c.codigo}`.toLowerCase().includes(key))
      .slice(0, 50)
      .map((c) => ({ value: c.id, label: `${c.nombre} — ${c.codigo}`, data: c }));
    clientOptionsCache.current[key] = results;
    callback(results);
  }, 120);

  // populate default options when data arrives and set keyboard shortcuts
  useEffect(() => {
    const arr = dataMateriasPrimas?.obtenerTodasMateriasPrimas || [];
    setProductDefaultOptions(
      arr.slice(0, 5).map((a) => ({
        value: a.id,
        label: `${a.descripcion || a.nombre} — ${a.codigoCabys || ''}`,
        data: a
      }))
    );
  }, [dataMateriasPrimas]);

  useEffect(() => {
    const arr = dataAllClientes?.obtenerClientes || [];
    setClientDefaultOptions(
      arr.slice(0, 5).map((c) => ({ value: c.id, label: `${c.nombre} — ${c.codigo}`, data: c }))
    );
  }, [dataAllClientes]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'F5') {
        e.preventDefault();
        clientSelectRef.current?.focus?.();
      }
      if (e.key === 'F2') {
        e.preventDefault();
        productSelectRef.current?.focus?.();
      }
      if (e.key === 'F4') {
        e.preventDefault();
        document.querySelector('#create-prefactura-btn')?.dispatchEvent(new MouseEvent('click'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleAddSelectedProduct = () => {
    if (selectedProduct?.data) {
      addArticulo(selectedProduct.data);
      setSelectedProduct(null);
      // clear product cache for empty input quick path
    }
  };

  const createPrefactura = async () => {
    // Basic client-side validation similar to Maintenance
    if (!clienteFacturar) {
      Swal.fire({
        title: 'Cliente requerido',
        text: 'Seleccione un cliente para facturar',
        icon: 'error'
      });
      return;
    }
    if (!selectedTipoDocumento) {
      Swal.fire({
        title: 'Tipo de factura requerido',
        text: 'Seleccione el tipo de factura',
        icon: 'error'
      });
      return;
    }
    if (!selectedCondicionVenta) {
      Swal.fire({
        title: 'Condición de venta requerida',
        text: 'Seleccione la condición de venta',
        icon: 'error'
      });
      return;
    }
    if (!selectedPaymentMethod) {
      Swal.fire({
        title: 'Forma de pago requerida',
        text: 'Seleccione la forma de pago',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Crear Prefactura',
      text: '¿Está seguro que desea crear la prefactura con los datos actuales?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        // For now we just show success; real implementation would call mutation to save prefactura
        Swal.fire({
          title: 'Prefactura creada',
          text: 'Se creó la prefactura correctamente',
          icon: 'success'
        });
      }
    });
  };
  const addArticulo = (art) => {
    // si ya existe, incrementa qty
    const exists = items.find((i) => i.codigoCabys === art.codigoCabys);
    if (exists) {
      setItems(
        items.map((i) =>
          i.codigoCabys === art.codigoCabys ? { ...i, qty: Number(i.qty || 1) + 1 } : i
        )
      );
    } else {
      const descripcion = art.descripcion?.trim() || art.nombre?.trim() || 'Sin descripción';
      setItems([
        ...items,
        { ...art, descripcion, qty: 1, price: art.precioCompra || art.precio || 0 }
      ]);
    }
  };

  const removeArticulo = (codigoCabys) => {
    setItems(items.filter((i) => i.codigoCabys !== codigoCabys));
  };

  return (
    <div className={`page-content ${styles.billingPage}`}>
      <Container fluid>
        <Breadcrumbs title="Facturación" />
        <Row>
          <div className="col-md-8">
            <Row className={`mb-3 ${styles.headerRow}`}>
              <div className="col-md-1 mb-2">
                <label className={styles.headerLabel}>Núm</label>
                <input className={`form-control ${styles.inputControl}`} placeholder="0001" />
              </div>
              <InvoiceOptions setValue={setValue} />

              <div className="col-md-5 mb-2 d-flex gap-2 align-items-center">
                <div ref={clientContainerRef} className={styles.clientSelectContainer}>
                  <label className={styles.headerLabel}>Clientes</label>
                  <AsyncSelect
                    ref={clientSelectRef}
                    cacheOptions
                    defaultOptions={clientDefaultOptions}
                    loadOptions={(input, cb) => loadClientOptions(input, cb)}
                    placeholder="Buscar cliente (F5)"
                    isLoading={loadingClientes}
                    noOptionsMessage={() => (loadingClientes ? 'Cargando...' : 'Sin resultados')}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    onChange={(opt) => {
                      setSelectedClientOption(opt);
                      setClienteFacturar(opt?.data || null);
                    }}
                    value={selectedClientOption}
                    styles={{
                      ...baseSelectStyles,
                      menu: (provided) => ({
                        ...provided,
                        minWidth: clientMenuWidth || 320,
                        zIndex: 9999
                      })
                    }}
                    onMenuOpen={() => {
                      const rect = clientContainerRef.current?.getBoundingClientRect();
                      if (rect) setClientMenuWidth(Math.max(320, Math.round(rect.width)));
                    }}
                    isClearable
                    aria-label="Buscar cliente"
                  />
                </div>

                <div ref={productContainerRef} className={styles.productSelectContainer}>
                  <label className={styles.headerLabel}>Artículos</label>
                  <AsyncSelect
                    ref={productSelectRef}
                    cacheOptions
                    defaultOptions={productDefaultOptions}
                    loadOptions={(input, cb) => loadProductOptions(input, cb)}
                    placeholder="Buscar artículo (F2)"
                    isLoading={loadingMaterias}
                    noOptionsMessage={() => (loadingMaterias ? 'Cargando...' : 'Sin resultados')}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    onChange={(opt) => setSelectedProduct(opt)}
                    value={selectedProduct}
                    styles={{
                      ...baseSelectStyles,
                      menu: (provided) => ({
                        ...provided,
                        minWidth: productMenuWidth || 240,
                        zIndex: 9999
                      })
                    }}
                    onMenuOpen={() => {
                      const rect = productContainerRef.current?.getBoundingClientRect();
                      if (rect) setProductMenuWidth(Math.max(240, Math.round(rect.width)));
                    }}
                    isClearable
                    aria-label="Buscar artículo"
                  />
                </div>

                <div className="col-md-3 mb-4">
                  <label className={styles.headerLabel}>Tipo de Cambio</label>
                  <input
                    className="form-control"
                    placeholder="500"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value) || '')}
                    readOnly={false}
                  />
                </div>

                <button
                  className={`btn btn-outline-secondary ${styles.addButton}`}
                  onClick={handleAddSelectedProduct}
                >
                  Agregar
                </button>
              </div>
            </Row>

            <div className="col-md-12 mb-3">
              <div className={`${styles.tableWrapper} table-responsive`}>
                <table className="table table-hover table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>SKU</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((it, idx) => (
                        <tr key={`item-${idx}`}>
                          <td>{it.descripcion || it.nombre || 'Sin descripción'}</td>
                          <td>{it.codigoCabys}</td>
                          <td>
                            <Input
                              className={styles.quantityContainer}
                              min={0}
                              value={it.qty}
                              onChange={(e) =>
                                setItems(
                                  items.map((x) =>
                                    x.codigoCabys === it.codigoCabys
                                      ? { ...x, qty: Number(e.target.value) }
                                      : x
                                  )
                                )
                              }
                            />
                          </td>
                          <td>{it.price}</td>
                          <td>{Number(it.price) * Number(it.qty)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeArticulo(it.codigoCabys)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className={styles.tableContainer}>
                        <td colSpan={6} className={`${styles.tableEmpty}`}>
                          No hay articulos agregados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className={`card p-3 ${styles.summaryCard}`}>
              <h5 className="card-title">Resumen</h5>

              <div className={styles.summaryTotalBox}>
                <div className="d-flex justify-content-between">
                  <div>SubTotal:</div>
                  <div>{formatCurrency(Number(subTotal || 0))}</div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>Descuento:</div>
                  <div>{formatCurrency(Number(descuento || 0))}</div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>Impuesto (13%):</div>
                  <div>{formatCurrency(Number(impuesto || 0))}</div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <div className="text-muted small">TOTAL</div>
                  <div className={`h4 ${styles.totalAmount}`}>
                    {formatCurrency(Number(total || 0))}
                  </div>
                </div>
                <div className="text-muted small">USD 0</div>
              </div>

              <div className="mt-4">
                <Button
                  id="create-prefactura-btn"
                  color="success"
                  className={`w-100 mb-2 ${styles.prefacturaButton}`}
                  onClick={createPrefactura}
                >
                  Crear Prefactura
                </Button>
                <div className="d-flex gap-2 mt-2">
                  <Button color="light" className={`w-50 ${styles.proformaButton}`}>
                    Proforma PDF
                  </Button>
                  <Button color="light" className={`w-50 ${styles.proformaButton}`}>
                    Excel
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label">Observaciones</label>
                <Input type="textarea" placeholder="Notas adicionales para la factura..." />
              </div>
            </div>
          </div>
        </Row>

        {/* Modal Clientes */}
        <Modal isOpen={modalClientes} toggle={() => setModalClientes(!modalClientes)} size="lg">
          <ModalHeader toggle={() => setModalClientes(!modalClientes)}>
            Seleccionar Cliente
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Buscar cliente"
              value={clienteSearch}
              onChange={(e) => setClienteSearch(e.target.value)}
            />
            <div className="table-responsive mt-2">
              <table className="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Código</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes().map((c, i) => (
                    <tr key={`cli-${i}`}>
                      <td>{c.nombre}</td>
                      <td>{c.codigo}</td>
                      <td>{c.correos?.[0]?.email || 'Sin correo'}</td>
                      <td>{c.telefonos?.[0]?.telefono || 'Sin teléfono'}</td>
                      <td>
                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => {
                            setClienteFacturar(c);
                            setModalClientes(false);
                          }}
                        >
                          Seleccionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalClientes(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>

        {/* Modal Articulos */}
        <Modal isOpen={modalArticulos} toggle={() => setModalArticulos(!modalArticulos)} size="lg">
          <ModalHeader toggle={() => setModalArticulos(!modalArticulos)}>Artículos</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Buscar artículo"
              value={codigoArticulo}
              onChange={(e) => setCodigoArticulo(e.target.value)}
            />
            <div className="table-responsive mt-2">
              <table className="table table-hover table-striped mb-0">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Código Cabys</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticulos().map((a, i) => (
                    <tr key={`art-${i}`}>
                      <td>{a.descripcion || a.nombre}</td>
                      <td>{a.codigoCabys}</td>
                      <td>{a.precioCompra}</td>
                      <td>
                        <Button size="sm" color="primary" onClick={() => addArticulo(a)}>
                          Agregar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalArticulos(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default BillingPage;
