import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Badge,
  Collapse,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { useQuery, useLazyQuery } from '@apollo/client';
import { OBTENER_MOVIMIENTOS_DE_GESTION } from '@/services/MovimientosCajasService';
import { OBTENER_COMANDAS_PENDIENTES } from '@/services/ComandaService';
import { CIERRE_CAJA } from '@/services/GestionCajasService';
import { CERRAR_CAJA } from '@/services/CajasService';
import { getSimboloMoneda } from '@/helpers/helpers';
import { useMutation } from '@apollo/client';
import { generarPDFResumenCierre } from '@/helpers/exportPDF';
import Swal from 'sweetalert2';
import { calcularResumenCierre } from '../FinancialSummary';

const ClosureDetails = ({ gestionActual, selectedCaja, onBack, administrador, usuario }) => {
  const [resumenCierre, setResumenCierre] = useState([]);
  const [gestionId, setGestionId] = useState(null);
  const [detallesAbiertos, setDetallesAbiertos] = useState({});
  const [cierre_caja] = useMutation(CIERRE_CAJA);
  const [cerrar_caja] = useMutation(CERRAR_CAJA);
  const [obtenerComandasPendientes] = useLazyQuery(OBTENER_COMANDAS_PENDIENTES);
  const [modalObservaciones, setModalObservaciones] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const { data, loading } = useQuery(OBTENER_MOVIMIENTOS_DE_GESTION, {
    variables: { gestionCajaId: gestionId || '' },
    fetchPolicy: 'network-only',
    skip: !gestionId
  });

  useEffect(() => {
    if (gestionActual?.id) setGestionId(gestionActual.id);
  }, [gestionActual]);

  useEffect(() => {
    if (data?.obtenerMovimientosDeGestion && gestionActual) {
      const resumen = calcularResumenCierre(gestionActual, data.obtenerMovimientosDeGestion);
      setResumenCierre(resumen);
    } else {
      setResumenCierre([]);
    }
  }, [data, gestionActual]);

  const toggleDetalleMetodo = (moneda, metodo) => {
    setDetallesAbiertos((prev) => ({
      ...prev,
      [`${moneda}-${metodo}`]: !prev[`${moneda}-${metodo}`]
    }));
  };

  const getEstadoBalance = (diferencia) => {
    if (Math.abs(diferencia) < 0.01) return 'balanceado';
    return diferencia > 0 ? 'a favor' : 'en contra';
  };

  const getColorBalance = (estado) => {
    switch (estado) {
      case 'balanceado':
        return 'success';
      case 'a favor':
        return 'info';
      case 'en contra':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const prepararDatosCierreSistema = () => {
    return resumenCierre.map((monedaData) => {
      const estado = getEstadoBalance(monedaData.diferencia).toUpperCase();

      return {
        codigoMoneda: monedaData.moneda,
        ingresos: monedaData.ingresosSistema,
        egresos: monedaData.egresosSistema,
        diferencia: monedaData.diferencia,
        estado,
        totalUsuario: monedaData.totalUsuario
      };
    });
  };

  const handleOpenModalCierre = () => {
    setModalObservaciones(true);
  };

  const handleCloseModalCierre = () => {
    setModalObservaciones(false);
    setObservaciones('');
  };

  const prepararDatosParaPDF = (data) => {
    const now = new Date();

    return {
      caja: `${selectedCaja.nombre} ${selectedCaja?.numero} - ${selectedCaja?.modulo === 'Punto_Venta' ? 'Punto de Venta' : selectedCaja?.modulo}`,
      usuario: data.usuario,
      administrador: administrador,
      fecha: now.toISOString().split('T')[0],
      hora_apertura: data.hora_apertura,
      hora_cierre: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      observaciones: observaciones || '',
      resumenCierre: resumenCierre,
      montos_apertura: selectedCaja?.montos_apertura
    };
  };

  const closeCaja = async () => {
    // ensure no open comandas exist in the system before allowing caja closure
    try {
      const { data: pendData } = await obtenerComandasPendientes();
      if (pendData?.obtenerComandasPendientes?.length > 0) {
        await Swal.fire(
          'Error',
          'No es posible cerrar el turno: existen comandas abiertas.',
          'error'
        );
        return;
      }
    } catch (err) {
      console.warn('Error verificando comandas abiertas', err);
    }

    handleCloseModalCierre();
    const { isConfirmed } = await Swal.fire({
      title: '¿Cerrar caja?',
      text: '¿Está seguro de realizar el cierre de la caja?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, cerrar caja',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    const datos_cierre = prepararDatosCierreSistema();
    const closeData = {
      caja: selectedCaja.id,
      usuario: {
        cedula: usuario.cedula,
        nombre: usuario.nombre
      },
      administrador: {
        cedula: administrador.cedula,
        nombre: administrador.nombre
      },
      datos_cierre_sistema: datos_cierre,
      observaciones: observaciones || ''
    };

    try {
      const response = await cierre_caja({ variables: { id: gestionActual.id, input: closeData } });
      const { estado, message } = response.data.cierreCaja;

      if (!estado) {
        await Swal.fire('Error', message, 'error');
        return;
      }

      await cerrar_caja({ variables: { id: selectedCaja.id } });

      const descargarPDF = await Swal.fire({
        title: 'Cierre guardado',
        text: '¿Desea descargar un PDF del cierre?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, descargar',
        cancelButtonText: 'No'
      });

      if (descargarPDF.isConfirmed) {
        const datosPDF = prepararDatosParaPDF(gestionActual);
        console.log('Datos para PDF:', datosPDF);
        const blob = await generarPDFResumenCierre(datosPDF);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const formattedDate = new Date().toISOString().split('T')[0];
        a.download = `Cierre_${selectedCaja.nombre}_${selectedCaja.modulo}_${formattedDate}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }

      await Swal.fire('Éxito', 'Caja cerrada correctamente', 'success');
      onBack();
    } catch (error) {
      console.error(error);
      await Swal.fire('Error', 'Ha ocurrido un error inesperado.', 'error');
    }
  };

  if (!gestionId) return <div>Selecciona una gestión para mostrar el resumen</div>;
  if (loading) return <div>Cargando movimientos...</div>;
  if (!resumenCierre.length) return <div>No hay datos para mostrar.</div>;

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-1">
        <Button color="secondary" size="sm" onClick={onBack}>
          ← Retroceder
        </Button>
      </div>

      {resumenCierre.map((monedaData, index) => {
        const estadoBalance = getEstadoBalance(monedaData.diferencia);
        const colorBalance = getColorBalance(estadoBalance);

        return (
          <div key={index} className="mb-5">
            <h4 className="mb-3">
              Moneda: {monedaData.moneda}
              <Badge color={colorBalance} className="ms-2">
                {estadoBalance.toUpperCase()}
              </Badge>
            </h4>

            <Row className="mb-4">
              <Col md="3">
                <Card className="border border-primary text-center">
                  <CardBody>
                    <h6>Monto Inicial</h6>
                    <h4>
                      {getSimboloMoneda(monedaData.moneda)}
                      {monedaData.montoInicial.toFixed(2)}
                    </h4>
                  </CardBody>
                </Card>
              </Col>
              <Col md="3">
                <Card className="border border-success text-center">
                  <CardBody>
                    <h6>Ingresos Sistema</h6>
                    <h4>
                      {getSimboloMoneda(monedaData.moneda)}
                      {monedaData.ingresosSistema.toFixed(2)}
                    </h4>
                  </CardBody>
                </Card>
              </Col>
              <Col md="3">
                <Card className="border border-danger text-center">
                  <CardBody>
                    <h6>Egresos Sistema</h6>
                    <h4>
                      {getSimboloMoneda(monedaData.moneda)}
                      {monedaData.egresosSistema.toFixed(2)}
                    </h4>
                  </CardBody>
                </Card>
              </Col>
              <Col md="3">
                <Card className={`border border-${colorBalance} text-center`}>
                  <CardBody>
                    <h6>Diferencia</h6>
                    <h4>
                      {getSimboloMoneda(monedaData.moneda)}
                      {Math.abs(monedaData.diferencia).toFixed(2)}
                    </h4>
                    <small className="text-muted">
                      Total Sistema: {getSimboloMoneda(monedaData.moneda)}
                      {monedaData.totalSistema.toFixed(2)} <br />
                      Total Usuario: {getSimboloMoneda(monedaData.moneda)}
                      {monedaData.totalUsuario.toFixed(2)}
                    </small>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <h5 className="mb-3">Detalle por Método de Pago</h5>
            {monedaData.metodosPago.map((metodo, idx) => {
              const detalleKey = `${monedaData.moneda}-${metodo.metodo}`;
              const isOpen = detallesAbiertos[detalleKey] || false;

              return (
                <div key={idx} className="mb-3">
                  <Card>
                    <CardBody className="p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Método: {metodo.metodo}</h6>
                        <div>
                          <span className="me-3">
                            <strong>Ingresos Sistema:</strong> {getSimboloMoneda(monedaData.moneda)}
                            {metodo?.ingresos.toFixed(2)}
                          </span>
                          {metodo.egresos > 0 && (
                            <span className="me-3">
                              <strong>Egresos Sistema:</strong>{' '}
                              {getSimboloMoneda(monedaData.moneda)}
                              {metodo?.egresos.toFixed(2)}
                            </span>
                          )}
                          <span className="me-3">
                            <strong>Total Usuario:</strong> {getSimboloMoneda(monedaData.moneda)}
                            {metodo?.totalUsuario.toFixed(2)}
                          </span>
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => toggleDetalleMetodo(monedaData.moneda, metodo.metodo)}
                          >
                            {isOpen ? 'Ocultar' : 'Mostrar'} detalles
                          </Button>
                        </div>
                      </div>

                      <Collapse isOpen={isOpen}>
                        <div className="mt-3">
                          <Table bordered responsive size="sm">
                            <thead>
                              <tr>
                                <th>Tipo</th>
                                <th>Módulo</th>
                                <th>Concepto</th>
                                <th>Monto</th>
                                <th>Fecha/Hora</th>
                              </tr>
                            </thead>
                            <tbody>
                              {metodo.detalles.map((detalle, detalleIdx) => (
                                <tr key={detalleIdx}>
                                  <td>
                                    <Badge
                                      color={
                                        detalle.tipo === 'ENTRADA' || detalle.tipo === 'ingreso'
                                          ? 'success'
                                          : 'danger'
                                      }
                                    >
                                      {detalle.tipo === 'ENTRADA' || detalle.tipo === 'ingreso'
                                        ? 'Ingreso'
                                        : 'Egreso'}
                                    </Badge>
                                  </td>
                                  <td>{detalle.modulo}</td>
                                  <td>{detalle.concepto}</td>
                                  <td>
                                    {getSimboloMoneda(monedaData.moneda)}
                                    {detalle.monto.toFixed(2)}
                                  </td>
                                  <td>
                                    {detalle.fecha &&
                                    detalle.fecha !== 'Desconocida' &&
                                    !isNaN(Number(detalle.fecha))
                                      ? new Date(Number(detalle.fecha)).toLocaleDateString('es-ES')
                                      : 'Desconocida'}{' '}
                                    {detalle.hora}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Collapse>
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        );
      })}

      <div className="text-end mt-4">
        <Button color="danger" onClick={handleOpenModalCierre}>
          Cerrar Caja
        </Button>
      </div>

      <Modal isOpen={modalObservaciones} toggle={handleCloseModalCierre}>
        <ModalHeader toggle={handleCloseModalCierre}>Observaciones de cierre</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="observaciones">
              Por favor, ingrese cualquier observación relevante sobre el cierre de caja:
            </Label>
            <Input
              type="textarea"
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Diferencia por cambio no registrado, billetes faltantes, etc."
              rows={5}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCloseModalCierre}>
            Cancelar
          </Button>
          <Button color="primary" onClick={closeCaja}>
            Confirmar cierre
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ClosureDetails;
