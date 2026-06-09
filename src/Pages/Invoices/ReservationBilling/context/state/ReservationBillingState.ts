import { Cliente, Paquete, Reserva, ReservaHabitacion, Tour } from '@/gql/graphql';
import { LineaDetalle } from '@/lib/seiko-hacienda/core/interfaces/hacienda';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

export interface ReservationBillingState {
  data: {
    client: Cliente | null;
    reservation: Reserva | null;
    rooms: ReservaHabitacion[];
    tours: Record<string, Tour>;
    packages: Record<string, Paquete>;
    lines: LineaDetalleReservaUI[];
  };

  selection: {
    selectedLineIds: Record<string, boolean>;
    modifiedLines: Record<string, Partial<LineaDetalle>>;
  };

  ui: {
    showStepper: boolean;
    isOpen: boolean;
    currentStep: number;
    isLoading: boolean;
    error: string | null;
  };
}
