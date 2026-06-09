import { Button } from 'reactstrap';
import styles from './ReservationHeader.module.css';

const ReservationHeader = ({ reserva, onBack }: any) => {
  return (
    <div className={`${styles.headerRow} mb-3 align-items-center`}>
      <div className={styles.headerActions}>
        <Button color="secondary" onClick={onBack}>
          Volver a reservas
        </Button>
      </div>
      <div className="d-flex align-items-center">
        <div className={styles.avatar} aria-hidden>
          {(reserva?.cliente?.nombreFacturacion || reserva?.cliente?.nombre || ' ')[0] || '?'}
        </div>
        <div className="ms-3">
          <h4 className="m-0">Reserva</h4>
          <div className="text-muted">
            {reserva?.cliente?.nombreFacturacion || reserva?.cliente?.nombre || ''}
          </div>
          <div className="text-muted small">
            Fecha reserva:{' '}
            {reserva?.fechaReserva
              ? new Date(Number(reserva.fechaReserva)).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationHeader;
