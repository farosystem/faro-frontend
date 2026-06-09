import { useMemo } from 'react';
import { Card, CardBody } from 'reactstrap';
import { useReservationBillingContext } from '../../context/ReservationBillingContext';
import styles from '../../ReservationBillingPage.module.css';

interface Props {
  daysUntilCheckin: number | null;
  penaltyRate: number;
}

const ReservationSidebar = ({ daysUntilCheckin, penaltyRate }: Props) => {
  // 1. Consumimos el estado global
  const { state } = useReservationBillingContext();
  const { lines = [] } = state.data;
  const { selectedLineIds = {} } = state.selection;

  const { allLinesTotal, selectedTotal } = useMemo(() => {
    const totals = (lines || []).reduce(
      (acc, line) => {
        const precio = Number(line.precioCompra || line.PrecioUnitario || 0);
        const cantidad = Number(line.cantidadArticulo || line.Cantidad || 1);

        const lineAmount = precio * cantidad;

        acc.allLinesTotal += lineAmount;

        if (selectedLineIds[line.id]) {
          acc.selectedTotal += lineAmount;
        }

        return acc;
      },
      { allLinesTotal: 0, selectedTotal: 0 }
    );

    return totals;
  }, [lines, selectedLineIds]);

  const penaltyOnSelected = selectedTotal * penaltyRate;

  return (
    <div>
      <Card className={styles.infoCard}>
        <CardBody>
          <div className="mb-2">
            <strong>Total lista:</strong>
          </div>
          <div className="mb-3 fw-bold">{allLinesTotal.toFixed(2)} CRC</div>

          <div className="mb-2">
            <strong>Penalidad por cancelación</strong>
          </div>
          <div className="text-muted small">
            Días hasta check-in: {daysUntilCheckin === null ? 'N/A' : daysUntilCheckin}
          </div>
          <div className="text-muted small">Tasa: {penaltyRate * 100}%</div>
          <div className="mb-2">
            Estimado: <strong>{penaltyOnSelected.toFixed(2)} CRC</strong>
          </div>

          <hr />
          <div className="text-muted small">
            Seleccionadas: <strong>{selectedTotal.toFixed(2)} CRC</strong>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReservationSidebar;
