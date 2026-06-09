import { useState, useEffect, useMemo } from 'react';
import { Button, Col, Input, Row, Table, Alert, Badge } from 'reactstrap';
import Select from 'react-select';
import { useLazyQuery } from '@apollo/client';
import { OBTENER_MOVIMIENTOS_POR_RANGO } from '@/services/GestionCajasService';
import { getSimboloMoneda } from '@/helpers/helpers';
import { generarPDFMovimientosCaja } from '@/helpers/exportPDF';
import { showInfoAlert } from '@/helpers/alert';
import { useDateUtils } from '../../../lib/hooks/useDateUtils';
import { Query } from '@/gql/graphql';
import { FileEarmarkPdf } from 'react-bootstrap-icons';

import styles from './CashMovements.module.css';
import { useInvoiceOptions } from '@/lib/hooks/useInvoiceOptions';

const CashMovements = ({ cajas }) => {
  const { today, monthAgoDateStr } = useDateUtils();
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [filters, setFilters] = useState({
    fechaInicio: monthAgoDateStr,
    fechaFin: today,
    tipoMovimiento: '',
    metodoPago: '',
    moneda: ''
  });
  const isoDate = (str) => {
    if (!str) return '';
    // input from date picker already looks like YYYY-MM-DD
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toISOString().slice(0, 10);
  };
  const [filteredData, setFilteredData] = useState([]);

  // ensure groups of movimientos are ordered with most recent first
  const sortMovimientosGroups = (groups) => {
    if (!groups) return [];
    const sortedGroups = groups
      .map((g) => {
        const sortedMovs = [...(g.movimientos || [])].sort((a, b) => {
          const da = new Date(a.fecha).getTime();
          const db = new Date(b.fecha).getTime();
          return db - da;
        });
        return { ...g, movimientos: sortedMovs };
      })
      .sort((a, b) => {
        const da = a.movimientos[0] ? new Date(a.movimientos[0].fecha).getTime() : 0;
        const db = b.movimientos[0] ? new Date(b.movimientos[0].fecha).getTime() : 0;
        return db - da;
      });
    return sortedGroups;
  };
  const [tipoMonedas, setTipoMonedas] = useState([]);
  const [metodoPagos, setMetodoPagos] = useState([]);

  // compute total net amount of visible movements
  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, g) => {
      const groupSum = g.movimientos.reduce((s, m) => {
        return s + (m.tipo === 'ENTRADA' ? m.monto : -m.monto);
      }, 0);
      return sum + groupSum;
    }, 0);
  }, [filteredData]);

  const [obtenerMovimientosPorRangoFecha, { loading, error, data }] = useLazyQuery<Query>(
    OBTENER_MOVIMIENTOS_POR_RANGO,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data?.obtenerMovimientosGestionesPorRangoFecha) {
          const sorted = sortMovimientosGroups(data.obtenerMovimientosGestionesPorRangoFecha);
          setFilteredData(sorted);
          applyAdditionalFilters(sorted);
        } else {
          setFilteredData([]);
        }
      }
    }
  );

  const { currenciesQuery: dataCurrencyTypes, paymentMethodsQuery: dataPaymentMethods } =
    useInvoiceOptions();

  useEffect(() => {
    if (dataCurrencyTypes?.length) {
      const options = dataCurrencyTypes.map((item) => ({
        value: item.value.trim().toLowerCase(),
        label: item.value,
        id: item.id
      }));
      setTipoMonedas(options);
    } else {
      setTipoMonedas([]);
    }
  }, [dataCurrencyTypes]);

  useEffect(() => {
    if (dataPaymentMethods?.length) {
      const options = dataPaymentMethods.map((item) => ({
        value: item.value.trim().toLowerCase(),
        label: item.value,
        id: item.id
      }));
      setMetodoPagos(options);
    } else {
      setMetodoPagos([]);
    }
  }, [dataPaymentMethods]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      fechaInicio: prev.fechaInicio || today,
      fechaFin: prev.fechaFin || today
    }));
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyAdditionalFilters = (movementsData) => {
    if (!movementsData) return;

    let filtered = [...movementsData];

    if (filters.tipoMovimiento) {
      filtered = filtered
        .map((item) => ({
          ...item,
          movimientos: item.movimientos.filter((mov) => mov.tipo === filters.tipoMovimiento)
        }))
        .filter((item) => item.movimientos.length > 0);
    }

    if (filters.metodoPago) {
      filtered = filtered
        .map((item) => ({
          ...item,
          movimientos: item.movimientos.filter(
            (mov) =>
              (mov.medioPago?.trim().toLowerCase() || '') ===
              filters.metodoPago.trim().toLowerCase()
          )
        }))
        .filter((item) => item.movimientos.length > 0);
    }

    if (filters.moneda) {
      filtered = filtered
        .map((item) => ({
          ...item,
          movimientos: item.movimientos.filter(
            (mov) =>
              (mov.codigoMoneda?.trim().toLowerCase() || '') === filters.moneda.trim().toLowerCase()
          )
        }))
        .filter((item) => item.movimientos.length > 0);
    }
    console.log('Filtered Movements: ', filtered);

    setFilteredData(sortMovimientosGroups(filtered));
  };

  const handleApplyFilters = () => {
    if (!selectedCaja) {
      showInfoAlert({
        title: 'Error',
        text: 'Por favor selecciona una caja',
        icon: 'error',
        timer: 3000,
        position: 'center'
      });
      return;
    }

    if (!filters.fechaInicio || !filters.fechaFin) {
      showInfoAlert({
        title: 'Error',
        text: 'Por favor ingresa ambas fechas',
        icon: 'error',
        timer: 3000,
        position: 'center'
      });
      return;
    }

    const startIso = isoDate(filters.fechaInicio);
    const endIso = isoDate(filters.fechaFin);
    const endDate = new Date(endIso);
    endDate.setDate(endDate.getDate() + 1);
    const endPlus1 = endDate.toISOString().slice(0, 10);

    obtenerMovimientosPorRangoFecha({
      variables: {
        caja: selectedCaja.id,
        fechaInicio: startIso,
        fechaFin: endPlus1
      }
    });
  };

  useEffect(() => {
    if (selectedCaja && filters.fechaInicio && filters.fechaFin) {
      handleApplyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCaja, filters.fechaInicio, filters.fechaFin]);

  // whenever additional filter values change, re-filter the already fetched data
  useEffect(() => {
    if (data?.obtenerMovimientosGestionesPorRangoFecha) {
      applyAdditionalFilters(data.obtenerMovimientosGestionesPorRangoFecha);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.tipoMovimiento, filters.metodoPago, filters.moneda]);

  const handleApplyAdditionalFilters = () => {
    if (!data?.obtenerMovimientosGestionesPorRangoFecha) return;
    applyAdditionalFilters(data.obtenerMovimientosGestionesPorRangoFecha);
  };

  const handleResetFilters = () => {
    setFilters({
      fechaInicio: today,
      fechaFin: today,
      tipoMovimiento: '',
      metodoPago: '',
      moneda: ''
    });
    setFilteredData([]);
  };

  const handleCajaChange = (caja) => {
    setSelectedCaja(caja);
    setFilters({
      fechaInicio: monthAgoDateStr,
      fechaFin: today,
      tipoMovimiento: '',
      metodoPago: '',
      moneda: ''
    });
    setFilteredData([]);
  };

  // if another component registers a movement, jump to that caja and refresh
  useEffect(() => {
    const listener = (e) => {
      const id = e.detail?.cajaId;
      if (!id) return;
      const caja = cajas.find((c) => c.id === id);
      if (caja) {
        handleCajaChange(caja);
      }
    };
    window.addEventListener('movimientoRegistrado', listener);
    return () => window.removeEventListener('movimientoRegistrado', listener);
  }, [cajas]);

  const handlePrintPDF = async () => {
    if (!filteredData?.length) {
      showInfoAlert({
        title: 'Sin datos',
        text: 'No hay movimientos para exportar',
        icon: 'warning'
      });
      return;
    }
    const blob = await generarPDFMovimientosCaja(filteredData, selectedCaja);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const todayDate = new Date().toLocaleDateString('es-CR').replace(/\//g, '-');
    link.download = `Movimientos_Caja_${selectedCaja.modulo}_${todayDate}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="p-4">
        {/* <style>{`.cash-movements-table tbody tr:nth-child(even){background-color:#f8f9fa;}`}</style>
        <h4 className="card-title mb-4">Movimientos de Caja</h4> */}
        {!selectedCaja ? (
          <div>
            <h5 className="mb-3">Seleccione una caja</h5>
            <Table hover responsive className="mb-3">
              <thead>
                <tr>
                  <th>Nombre / Nº</th>
                  <th>Módulo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {cajas.map((caja) => (
                  <tr
                    key={caja.id}
                    className={`${styles.cajaRow} ${
                      selectedCaja?.id === caja.id ? styles.cajaRowSelected : ''
                    }`}
                    onClick={() => handleCajaChange(caja)}
                  >
                    <td>
                      {caja.nombre} {caja.numero}
                    </td>
                    <td>
                      {caja.modulo === 'Punto_Venta'
                        ? 'Punto de Venta'
                        : caja.modulo === 'Sin_definir'
                          ? 'Sin definir'
                          : caja.modulo}
                    </td>
                    <td>
                      <Badge
                        color={
                          caja.estado === 'ABIERTA'
                            ? 'success'
                            : caja.estado === 'CIERRE_PARCIAL'
                              ? 'warning'
                              : caja.estado === 'INACTIVA'
                                ? 'danger'
                                : 'secondary'
                        }
                      >
                        {caja.estado === 'CIERRE_PARCIAL' ? 'CIERRE PARCIAL' : caja.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5>
                  {selectedCaja.nombre +
                    ' ' +
                    selectedCaja.numero +
                    ' - ' +
                    (selectedCaja.modulo === 'Punto_Venta'
                      ? 'Punto de Venta'
                      : selectedCaja.modulo === 'Sin_definir'
                        ? 'Sin definir'
                        : selectedCaja.modulo)}
                </h5>
                {filteredData.length > 0 && (
                  <>
                    <div className="text-muted fs-6">
                      {filteredData.reduce((sum, g) => sum + g.movimientos.length, 0)} movimientos
                      encontrados
                    </div>
                    <div className="text-muted fs-5 d-block fw-bold">
                      Total:{' '}
                      <span className={totalAmount >= 0 ? 'text-success' : 'text-danger'}>
                        {totalAmount >= 0 ? '+' : '-'}
                        {getSimboloMoneda(filteredData[0]?.movimientos[0]?.codigoMoneda) || ''}
                        {Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
                          Math.abs(totalAmount)
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                {filteredData.length > 0 && (
                  <Button
                    color="secondary"
                    outline
                    className="py-2 px-3 flex items-center gap-1"
                    onClick={handlePrintPDF}
                  >
                    <FileEarmarkPdf className="w-8 h-8" />
                    PDF
                  </Button>
                )}
                <Button
                  color="secondary"
                  outline
                  className="py-2 px-3"
                  onClick={() => handleCajaChange(null)}
                >
                  Cambiar Caja
                </Button>
              </div>
            </div>

            {/* single filter row with left filters and right buttons */}
            <div className={styles.filterContainer}>
              <div className={styles.filters}>
                <div className="flex-shrink-0">
                  <Input
                    type="date"
                    name="fechaInicio"
                    value={filters.fechaInicio}
                    onChange={handleFilterChange}
                    placeholder="Inicio"
                    className={`${styles.dateInput} ${styles.control}`}
                  />
                </div>
                <div className="flex-shrink-0">
                  <Input
                    type="date"
                    name="fechaFin"
                    value={filters.fechaFin}
                    onChange={handleFilterChange}
                    placeholder="Fin"
                    className={`${styles.dateInput} ${styles.control}`}
                  />
                </div>
                <div className="flex-shrink-0">
                  <Select
                    className={`${styles.smallSelect} ${styles.control}`}
                    name="tipoMovimiento"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: '2.5rem',
                        fontSize: '1rem'
                      }),
                      menu: (provided) => ({ ...provided, zIndex: 10000 })
                    }}
                    value={[
                      { value: '', label: 'Todos' },
                      { value: 'ENTRADA', label: 'Entrada' },
                      { value: 'SALIDA', label: 'Salida' }
                    ].find((opt) => opt.value === filters.tipoMovimiento)}
                    onChange={(opt) => setFilters((p) => ({ ...p, tipoMovimiento: opt.value }))}
                    options={[
                      { value: '', label: 'Todos' },
                      { value: 'ENTRADA', label: 'Entrada' },
                      { value: 'SALIDA', label: 'Salida' }
                    ]}
                    isSearchable={false}
                    classNamePrefix="select2-selection"
                    placeholder="Tipo"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Select
                    className={`${styles.smallSelect} ${styles.control}`}
                    name="metodoPago"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: '2.5rem',
                        fontSize: '1rem'
                      }),
                      menu: (provided) => ({ ...provided, zIndex: 10000 })
                    }}
                    value={
                      metodoPagos.find((opt) => opt.value === filters.metodoPago) || {
                        value: '',
                        label: 'Todos'
                      }
                    }
                    onChange={(opt) => setFilters((p) => ({ ...p, metodoPago: opt.value }))}
                    options={[{ value: '', label: 'Todos' }, ...metodoPagos]}
                    isSearchable
                    classNamePrefix="select2-selection"
                    placeholder="Método"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Select
                    className={`${styles.smallSelect} ${styles.control}`}
                    name="moneda"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: '2.5rem',
                        fontSize: '1rem'
                      }),
                      menu: (provided) => ({ ...provided, zIndex: 10000 })
                    }}
                    value={
                      tipoMonedas.find((opt) => opt.value === filters.moneda) || {
                        value: '',
                        label: 'Todas'
                      }
                    }
                    onChange={(opt) => setFilters((p) => ({ ...p, moneda: opt.value }))}
                    options={[{ value: '', label: 'Todas' }, ...tipoMonedas]}
                    isSearchable
                    classNamePrefix="select2-selection"
                    placeholder="Moneda"
                  />
                </div>
              </div>
              <div className={styles.filterActions}>
                <Button
                  color="primary"
                  className={styles.compactButton + ' bg-blue-600 hover:bg-blue-700 text-white'}
                  onClick={handleApplyFilters}
                  disabled={loading}
                >
                  Filtrar
                </Button>
                <Button
                  color="secondary"
                  outline
                  className={
                    styles.compactButton + ' text-gray-700 border-gray-300 hover:bg-gray-100'
                  }
                  onClick={handleResetFilters}
                  disabled={loading}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : error ? (
              <Alert color="danger">Error al cargar los movimientos: {error.message}</Alert>
            ) : filteredData?.length > 0 ? (
              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  overflowX: 'auto',
                  fontSize: '13px'
                }}
              >
                <Table hover className="table-striped bg-gray-50 cash-movements-table">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800">
                      <th className="px-2 py-1 text-left">#</th>
                      <th className="px-2 py-1 text-left">Fecha Gestión</th>
                      <th className="px-2 py-1 text-left">Hora</th>
                      <th className="px-2 py-1 text-left">Usuario</th>
                      <th className="px-2 py-1 text-left">Tipo Movimiento</th>
                      <th
                        className="px-2 py-1 text-left"
                        style={{ width: '200px', wordBreak: 'break-word', whiteSpace: 'normal' }}
                      >
                        Descripción
                      </th>
                      <th className="px-2 py-1 text-left">Método de Pago</th>
                      <th
                        className="px-2 py-1 text-end font-mono"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map(({ gestion, movimientos }) =>
                      movimientos.map((mov, idx) => {
                        const fechaValida = mov.fecha
                          ? new Date(isNaN(Date.parse(mov.fecha)) ? Number(mov.fecha) : mov.fecha)
                          : null;

                        return (
                          <tr key={mov.id} className="align-middle">
                            <td className="py-2">{idx + 1}</td>
                            <td className="py-2">
                              {fechaValida ? fechaValida.toLocaleDateString() : 'Sin fecha'}
                            </td>
                            <td>
                              {fechaValida
                                ? fechaValida.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                  })
                                : '-'}
                            </td>
                            <td>{gestion.usuario?.nombre || 'Sistema'}</td>
                            <td>
                              <span
                                style={{
                                  display: 'inline-block',
                                  backgroundColor: mov.tipo === 'ENTRADA' ? '#e6f4ea' : '#fce8e6',
                                  color: mov.tipo === 'ENTRADA' ? '#1e7e34' : '#d93025',
                                  border: `1px solid ${mov.tipo === 'ENTRADA' ? '#c3e6cb' : '#f5c6cb'}`,
                                  borderRadius: '50px', // Esto hace el efecto "pill"
                                  fontSize: '0.72rem',
                                  fontWeight: 'bold',
                                  padding: '2px 10px',
                                  minWidth: '75px',
                                  textAlign: 'center',
                                  textTransform: 'uppercase'
                                }}
                              >
                                {mov.tipo}
                              </span>
                            </td>
                            <td
                              style={{
                                width: '200px',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal'
                              }}
                            >
                              {mov.observaciones || '-'}
                            </td>
                            <td>{mov.medioPago || '-'}</td>
                            <td
                              className={
                                `text-end font-mono` +
                                ` text-${mov.tipo === 'ENTRADA' ? 'success' : 'danger'}`
                              }
                              style={{
                                fontVariantNumeric: 'tabular-nums',
                                fontFamily: 'JetBrains Mono, monospace'
                              }}
                            >
                              {mov.tipo === 'ENTRADA' ? '+' : '-'}
                              {getSimboloMoneda(mov.codigoMoneda)}
                              {(() => {
                                const fmt = Intl.NumberFormat('es-ES', {
                                  minimumFractionDigits: 2
                                }).format(Number(mov.monto.toFixed(2)));
                                const parts = fmt.split(',');
                                return (
                                  <>
                                    {parts[0]}
                                    {parts[1] && <small className="text-xs">,{parts[1]}</small>}
                                  </>
                                );
                              })()}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert color="info" className="mt-3">
                No se encontraron movimientos con los filtros aplicados.
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashMovements;
