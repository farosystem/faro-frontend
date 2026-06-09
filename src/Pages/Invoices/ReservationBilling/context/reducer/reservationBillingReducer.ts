import { Reserva, Tour, Paquete } from '@/gql/graphql';
import { ReservationBillingState } from '../state/ReservationBillingState';
import { reservationBillingInitialState } from '../state/reservationBillingInitialState';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

export type ReservationBillingAction =
  | { type: 'INIT'; payload: Partial<ReservationBillingState> }
  | {
      type: 'HYDRATE_RESERVATION';
      payload: { reservation: Reserva; lines: LineaDetalleReservaUI[] };
    }
  | {
      type: 'SET_CATALOGS';
      payload: { tours: Record<string, Tour>; packages: Record<string, Paquete> };
    }
  | { type: 'TOGGLE_LINE'; payload: { id: string } }
  | { type: 'UPDATE_LINE'; payload: { id: string; field: keyof LineaDetalleReservaUI; value: any } }
  | { type: 'SET_STEPPER_VISIBLE'; payload: boolean }
  | { type: 'RESET' };

export const reservationBillingReducer = (
  state: ReservationBillingState,
  action: ReservationBillingAction
): ReservationBillingState => {
  switch (action.type) {
    case 'INIT': {
      const rawPayload = action.payload || {};
      const actualData = (rawPayload as any).data ? (rawPayload as any).data : rawPayload;

      return {
        ...state,
        data: {
          ...state.data,
          ...actualData
        },
        selection: {
          ...state.selection,
          ...(rawPayload.selection || {})
        }
      };
    }

    case 'HYDRATE_RESERVATION': {
      const { reservation, lines } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          reservation,
          lines,
          client: reservation?.cliente || (reservation as any)?.data?.cliente || state.data.client
        }
      };
    }

    case 'SET_CATALOGS':
      return {
        ...state,
        data: {
          ...state.data,
          tours: action.payload.tours,
          packages: action.payload.packages
        }
      };

    case 'TOGGLE_LINE': {
      const { id } = action.payload;
      const newSelected = { ...state.selection.selectedLineIds };

      if (newSelected[id]) {
        delete newSelected[id];
      } else {
        newSelected[id] = true;
      }

      return {
        ...state,
        selection: {
          ...state.selection,
          selectedLineIds: newSelected
        }
      };
    }

    case 'UPDATE_LINE': {
      const { id, field, value } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          lines: state.data.lines.map((line) =>
            line.id === id ? { ...line, [field]: value } : line
          )
        }
      };
    }

    case 'SET_STEPPER_VISIBLE':
      return {
        ...state,
        ui: { ...state.ui, showStepper: action.payload }
      };

    case 'RESET':
      return reservationBillingInitialState;

    default:
      return state;
  }
};
