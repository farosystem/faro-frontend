import { ReservationBillingState } from './ReservationBillingState';

export const reservationBillingInitialState: ReservationBillingState = {
  data: {
    client: null,
    reservation: null,
    tours: {},
    packages: {},
    rooms: [],
    lines: []
  },
  selection: {
    selectedLineIds: {},
    modifiedLines: {}
  },
  ui: {
    showStepper: true,
    isOpen: false,
    currentStep: 1,
    isLoading: false,
    error: null
  }
};
