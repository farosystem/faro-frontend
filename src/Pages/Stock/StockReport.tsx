import { useState, useEffect } from 'react';
import { Container, Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Select from 'react-select';
import { useQuery, useLazyQuery } from '@apollo/client';
import { OBTENER_PROVEEDORES } from '@/services/ProveedorService';
import {
  OBTENER_MATERIAS_PRIMAS_REPORTE,
  OBTENER_MATERIAS_PRIMAS_DE_ORDENES
} from '@/services/MateriaPrimaService';
import withRouter from '@/components/Common/withRouter';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { showInfoAlert } from '@/helpers/alert';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { convertDataStockReportExcel, exportAndDownloadExcel } from '@/helpers/exportExcel';
import { generarPDFReporteInventario } from '@/helpers/exportPDF';

interface SelectOption<T = any> {
  value: T;
  label: string;
}

interface Filters {
  fechaInicio: Date;
  fechaFin: Date;
  proveedor: SelectOption<any> | null;
  unidadMedida: SelectOption<string> | null;
  nivelMinimo: string;
  nivelMaximo: string;
  usarFechas: boolean;
}

interface ExportOptions {
  excel: boolean;
  pdf: boolean;
}

const StockReport = () => {
  const [filters, setFilters] = useState<Filters>({
    fechaInicio: new Date(),
    fechaFin: new Date(new Date().setDate(new Date().getDate() + 1)),
    proveedor: null,
    unidadMedida: null,
    nivelMinimo: '',
    nivelMaximo: '',
    usarFechas: false
  });

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    excel: false,
    pdf: false
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Consultas GraphQL
  const { loading: load_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, {
    pollInterval: 1000
  });
  const [obtenerReporteStock] = useLazyQuery(OBTENER_MATERIAS_PRIMAS_REPORTE);
  const [obtenerReporteProvedores] = useLazyQuery(OBTENER_MATERIAS_PRIMAS_DE_ORDENES);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      usarFechas: !!prev.proveedor
    }));
  }, [filters.proveedor]);

  const handleStartDateChange = (date) => {
    const minEndDate = new Date(date);
    minEndDate.setDate(minEndDate.getDate() + 1);

    setFilters((prev) => ({
      ...prev,
      fechaInicio: date,
      fechaFin: prev.fechaFin <= date ? minEndDate : prev.fechaFin
    }));
  };

  const handleEndDateChange = (date) => {
    setFilters((prev) => ({
      ...prev,
      fechaFin: date
    }));
  };

  const getProveedores = () => {
    const datos = [];
    if (data_proveedores?.obtenerProveedores) {
      data_proveedores?.obtenerProveedores.map((item) => {
        datos.push({
          value: item,
          label: item.empresa
        });
      });
    }
    return datos;
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: keyof Filters, selectedOption: SelectOption | null) => {
    setFilters({
      ...filters,
      [name]: selectedOption
    });
  };

  const handleExportOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setExportOptions((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleResetFilters = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    setFilters({
      fechaInicio: today,
      fechaFin: tomorrow,
      proveedor: null,
      unidadMedida: null,
      nivelMinimo: '',
      nivelMaximo: '',
      usarFechas: false
    });
    setExportOptions({
      excel: false,
      pdf: false
    });
    const excelCheckbox = document.getElementById('excel-checkbox') as HTMLInputElement | null;
    const pdfCheckbox = document.getElementById('pdf-checkbox') as HTMLInputElement | null;

    if (excelCheckbox) excelCheckbox.checked = false;
    if (pdfCheckbox) pdfCheckbox.checked = false;
  };

  const handleGenerateReports = async () => {
    if (!exportOptions.excel && !exportOptions.pdf) {
      showInfoAlert({
        title: 'Seleccione formato',
        text: 'Debe seleccionar al menos un formato de exportación',
        icon: 'warning'
      });
      return;
    }

    setLoading(true);

    try {
      let data;

      if (filters.proveedor) {
        const { data: queryData } = await obtenerReporteProvedores({
          variables: {
            proveedorId: filters.proveedor.value.id,
            fechaInicio: filters.fechaInicio
              ? new Date(filters.fechaInicio).toISOString().split('T')[0]
              : null,
            fechaFin: filters.fechaFin
              ? new Date(filters.fechaFin).toISOString().split('T')[0]
              : null,
            unidad: filters.unidadMedida?.value,
            nivelMinimo: parseFloat(filters.nivelMinimo) || null,
            nivelMaximo: parseFloat(filters.nivelMaximo) || null
          }
        });
        data = queryData.obtenerMateriasPrimasDeOrdenes;
      } else {
        const { data: queryData } = await obtenerReporteStock({
          variables: {
            unidad: filters.unidadMedida?.value || null,
            minimo: filters.nivelMinimo !== '' ? parseFloat(filters.nivelMinimo) : null,
            maximo: filters.nivelMaximo !== '' ? parseFloat(filters.nivelMaximo) : null
          }
        });
        data = queryData.obtenerMateriasPrimasReporte;
      }

      if (!data.length) {
        showInfoAlert({
          title: 'Sin datos',
          text: 'No se encontraron registros con los filtros aplicados',
          icon: 'warning'
        });
        return;
      }
      if (exportOptions.excel) {
        exportAndDownloadExcel('Reporte_Inventario', convertDataStockReportExcel(data));
      }

      if (exportOptions.pdf) {
        const blob = await generarPDFReporteInventario(data, filters);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const todayDate = new Date().toLocaleDateString('es-CR').replace(/\//g, '-');
        link.download = `Reporte_Inventario_${todayDate}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      showInfoAlert({
        title: 'Éxito',
        text: 'Reportes generados correctamente',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error generando reportes:', error);
      showInfoAlert({
        title: 'Error',
        text: 'Ocurrió un error al generar los reportes',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumb
          title="Reporte de Inventario"
          breadcrumbItem="Inventario"
          breadcrumbItemUrl="/stock/Restaurante"
        />
        <Card>
          <CardBody>
            <Row className="mb-3 align-items-center">
              <Col md="6">
                <h4 className="card-title mb-0">Reporte de Inventario</h4>
              </Col>
              <Col md="6" className="text-end">
                <Button color="light" onClick={handleResetFilters} disabled={loading}>
                  Limpiar Filtros
                </Button>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md="4">
                <FormGroup>
                  <Label>Unidad de Medida</Label>
                  <Select
                    name="unidadMedida"
                    value={filters.unidadMedida}
                    onChange={(option) => handleSelectChange('unidadMedida', option)}
                    options={[
                      { label: 'Kilogramo', value: 'Kilogramo' },
                      { label: 'Litro', value: 'Litro' },
                      { label: 'Unidades', value: 'Unidades' }
                    ]}
                    isClearable
                    placeholder="Todas las unidades"
                    classNamePrefix="select2-selection"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Nivel Mínimo</Label>
                  <Input
                    type="number"
                    name="nivelMinimo"
                    value={filters.nivelMinimo}
                    onChange={handleFilterChange}
                    placeholder="Ej: 10"
                    min="0"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Nivel Máximo</Label>
                  <Input
                    type="number"
                    name="nivelMaximo"
                    value={filters.nivelMaximo}
                    onChange={handleFilterChange}
                    placeholder="Ej: 100"
                    min="0"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Proveedor</Label>
                  <Select
                    name="proveedor"
                    value={filters.proveedor}
                    onChange={(option) => handleSelectChange('proveedor', option)}
                    options={getProveedores()}
                    isClearable
                    placeholder="Seleccione proveedor"
                    classNamePrefix="select2-selection"
                    isLoading={load_proveedores}
                  />
                </FormGroup>
              </Col>

              <Col md="2">
                <FormGroup>
                  <Label>Fecha Inicio</Label>
                  <DatePicker
                    selected={filters.fechaInicio}
                    onChange={handleStartDateChange}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    disabled={!filters.usarFechas}
                  />
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label>Fecha Fin</Label>
                  <DatePicker
                    selected={filters.fechaFin}
                    onChange={handleEndDateChange}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date(filters.fechaInicio.getTime() + 24 * 60 * 60 * 1000)}
                    disabled={!filters.usarFechas}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md="6">
                <FormGroup>
                  <Label>Opciones de Exportación</Label>
                  <div className="d-flex align-items-center gap-5">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="excel-checkbox"
                        style={{ width: '30px', height: '30px' }}
                        onChange={(e) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            excel: e.target.checked
                          }))
                        }
                        disabled={loading}
                      />
                      <label className="form-check-label ms-2 mt-2" htmlFor="excel-checkbox">
                        Excel
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="pdf-checkbox"
                        style={{ width: '30px', height: '30px' }}
                        onChange={(e) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            pdf: e.target.checked
                          }))
                        }
                        disabled={loading}
                      />
                      <label className="form-check-label ms-2 mt-2" htmlFor="pdf-checkbox">
                        PDF
                      </label>
                    </div>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="text-end">
                <Button
                  color="primary"
                  onClick={handleGenerateReports}
                  disabled={loading || (!exportOptions.excel && !exportOptions.pdf)}
                >
                  {loading ? 'Generando Reportes...' : 'Generar Reportes'}
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default withRouter(StockReport);
