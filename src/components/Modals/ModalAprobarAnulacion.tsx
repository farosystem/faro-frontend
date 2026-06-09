import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from 'reactstrap';

const ModalAprobarAnulacion = ({ isOpen, toggle, anulacion, action, onConfirm }) => {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    onConfirm(motivo);
    setMotivo('');
  };

  if (!anulacion) return null;

  const esAprobacion = action === 'APROBAR';

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        {esAprobacion ? 'Aprobar Anulación' : 'Rechazar Anulación'}
      </ModalHeader>
      <ModalBody>
        <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h6 className="mb-2">Detalles de la Anulación:</h6>
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted">Platillo:</small>
              <p className="fw-bold mb-2">{anulacion.platillo}</p>

              <small className="text-muted">Usuario:</small>
              <p className="mb-2">{anulacion.usuarioAnulo}</p>

              <small className="text-muted">Monto:</small>
              <p className="mb-2">₡{anulacion.monto?.toLocaleString() || '0'}</p>
            </div>
            <div className="col-md-6">
              <small className="text-muted">Motivo Original:</small>
              <p className="mb-2">{anulacion.motivo || 'Sin motivo'}</p>

              <small className="text-muted">Tipo:</small>
              <p className="mb-2">
                {anulacion.esConCobro ? (
                  <Badge color="danger">Con Cobro</Badge>
                ) : (
                  <Badge color="success">Sin Cobro</Badge>
                )}
              </p>
            </div>
          </div>

          {anulacion.deducciones && anulacion.deducciones.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">Ingredientes a descontar:</small>
              <ul className="small mb-0">
                {anulacion.deducciones.map((d) => (
                  <li key={d.producto}>
                    {d.nombre}:{' '}
                    <strong>
                      {d.cantidad} {d.unidad}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {esAprobacion && anulacion.esConCobro && (
          <div className="alert alert-warning mb-3">
            <i className="mdi mdi-alert-circle me-2"></i>
            <strong>Nota:</strong> Al aprobar, se generará automáticamente una Cuenta por Cobrar
            (CxC) por ₡{anulacion.monto?.toLocaleString() || '0'} a nombre de{' '}
            {anulacion.usuarioAnulo}
          </div>
        )}

        {!esAprobacion && (
          <div className="alert alert-info mb-3">
            <i className="mdi mdi-info-circle me-2"></i>
            <strong>Nota:</strong> Al rechazar, se revertirán los cambios de inventario
            {anulacion.deducciones?.length > 0 &&
              ` (se reintegrarán ${anulacion.deducciones.map((d) => d.nombre).join(', ')})`}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">
            {esAprobacion ? 'Comentario de Aprobación (opcional)' : 'Motivo del Rechazo (opcional)'}
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={
              esAprobacion
                ? 'Ej: Verificado, ingredientes confirmados...'
                : 'Ej: Documentación incompleta, investigación pendiente...'
            }
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color={esAprobacion ? 'success' : 'danger'} onClick={handleConfirm}>
          {esAprobacion ? 'Aprobar' : 'Rechazar'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAprobarAnulacion;
