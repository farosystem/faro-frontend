import { Card, CardBody, Input } from 'reactstrap';

import { ReservaHabitacion } from '@/gql/graphql';

import { useReservationBillingContext } from '../../context/ReservationBillingContext';
import { useReservationBillingActions } from '../../context/reducer/useReservationBillingActions';
import { reservationBillingInitialState } from '../../context/state/reservationBillingInitialState';
import styles from './InvoiceStepper.module.css';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

interface RoomItemRowProps {
  line: LineaDetalleReservaUI;
  roomData?: ReservaHabitacion | null;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const categories = ['Reserva', 'Habitaciones', 'Servicios', 'Tours', 'Paquetes', 'Otros'];

const SelectionReview = () => {
  const { state } = useReservationBillingContext();
  const { toggleLine } = useReservationBillingActions();

  const {
    data = reservationBillingInitialState.data,
    selection = reservationBillingInitialState.selection
  } = state || {};

  const { selectedLineIds = {} } = selection;
  const { lines = [], rooms } = data;

  const subtotalSeleccionado = lines
    .filter((l) => selectedLineIds[l.id])
    .reduce((acc, l: LineaDetalleReservaUI) => {
      const p = Number(l.precioCompra || l.PrecioUnitario || 0);
      const q = Number(l.cantidadArticulo || l.Cantidad || 0);
      return acc + p * q;
    }, 0);

  const handleToggle = (id: string) => {
    toggleLine(id);
  };

  return (
    <Card className={`${styles.infoCard} mb-3`}>
      <CardBody className={styles.cardBodyCompact}>
        {categories.map((cat) => {
          const items = (lines || []).filter((item) => item.category === cat);
          if (!items.length) return null;

          return (
            <div key={cat} className="mb-4">
              <h6 className={`${styles.sectionTitle} mb-3`}>{cat}</h6>

              {items.map((l) => {
                const isSelected = !!selectedLineIds[l.id];

                if (l.category === 'Habitaciones' || l.source === 'room') {
                  const roomBooking = (data.rooms as ReservaHabitacion[]).find(
                    (r) => r.id === l.reservaHabitacionId
                  );

                  return (
                    <RoomItemRow
                      key={l.id}
                      line={l}
                      roomData={roomBooking}
                      isSelected={isSelected}
                      onToggle={handleToggle}
                    />
                  );
                }

                return (
                  <ServiceItemRow
                    key={l.id}
                    line={l}
                    isSelected={isSelected}
                    onToggle={handleToggle}
                  />
                );
              })}
            </div>
          );
        })}

        <hr />
        <div className="d-flex justify-content-end">
          <div className={styles.summary}>
            Total Seleccionado: <strong>{subtotalSeleccionado.toFixed(2)} CRC</strong>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const RoomItemRow = ({ line, roomData, isSelected, onToggle }: RoomItemRowProps) => {
  const unitPrice = Number(line.precioCompra || line.PrecioUnitario || 0);
  const quantity = Number(line.cantidadArticulo || line.Cantidad || 0);
  const total = unitPrice * quantity;

  const roomNumber = roomData?.habitacion?.numeroHabitacion || '';

  return (
    <div className={`${styles.itemCard} ${styles.roomCard} mb-2`}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className={styles.titleText}>
            {line.descripcion || line.Detalle || `Habitación ${roomNumber}`}
          </div>
          <div className="text-muted small mt-1">
            <i className="mdi mdi-calendar-range me-1" />
            {roomData?.fechaEntrada && roomData?.fechaSalida
              ? `${new Date(Number(roomData.fechaEntrada)).toLocaleDateString('es-CR')} - ${new Date(Number(roomData.fechaSalida)).toLocaleDateString('es-CR')}`
              : 'Reserva de habitación'}
          </div>
        </div>
        <div className="text-end">
          <Input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(line.id)}
            className="ms-2"
          />
          <div className={styles.roomTotal} style={{ marginTop: '10px' }}>
            <strong>{total.toFixed(2)} CRC</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceItemRow = ({
  line,
  isSelected,
  onToggle
}: {
  line: any;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => {
  const unitPrice = Number(line.precioCompra || line.PrecioUnitario || 0);
  const quantity = Number(line.cantidadArticulo || line.Cantidad || 0);
  const total = unitPrice * quantity;

  return (
    <div className={`${styles.itemCard} mb-2`}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className={styles.titleText}>{line.descripcion || line.Detalle}</div>
          <div className="text-muted small">Cantidad: {quantity}</div>
        </div>
        <div className="text-end d-flex align-items-center">
          <div className="me-3">
            <strong>{total.toFixed(2)} CRC</strong>
          </div>
          <Input type="checkbox" checked={isSelected} onChange={() => onToggle(line.id)} />
        </div>
      </div>
    </div>
  );
};
export default SelectionReview;
