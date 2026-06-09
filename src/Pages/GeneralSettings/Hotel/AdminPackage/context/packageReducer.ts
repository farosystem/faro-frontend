import { Paquete, Servicios } from '@/gql/graphql';

export interface PackageState {
  service: Partial<Servicios>;
  services?: Partial<Servicios>[];
  state: Partial<Paquete>;
}
export type PackageAction =
  | { type: 'UPDATE_CURRENT_SERVICE'; update: Partial<Servicios> }
  | { type: 'SAVE_SERVICE_TO_LIST'; update: Partial<Servicios> }
  | { type: 'REMOVE_SERVICE'; nombre: string }
  | { type: 'UPDATE_SERVICE_AMOUNT'; nombre: string; amount: number }
  | { type: 'SET_SERVICES'; update: Servicios[] }
  | { type: 'SAVE_PACKAGE'; update: Partial<Paquete> }
  | { type: 'CLEAN' }
  | { type: 'RESET_ALL' };

export const packageReducer = (state: PackageState, action: PackageAction): PackageState => {
  switch (action.type) {
    case 'UPDATE_CURRENT_SERVICE':
      return {
        ...state,
        service: {
          ...state.service,
          ...action.update
        }
      };

    case 'SAVE_PACKAGE':
      return {
        ...state,
        state: {
          ...action.update
        }
      };

    case 'SAVE_SERVICE_TO_LIST':
      return {
        ...state,
        services: [...(state.services || []), action.update],
        service: {} as Servicios
      };

    case 'REMOVE_SERVICE':
      return {
        ...state,
        services: (state.services || []).filter((s) => s.nombre !== action.nombre)
      };

    case 'UPDATE_SERVICE_AMOUNT':
      return {
        ...state,
        services: (state.services || []).map((s) =>
          s.nombre === action.nombre ? { ...s, extra: action.amount } : s
        )
      };

    case 'SET_SERVICES':
      return {
        ...state,
        services: action.update
      };

    case 'CLEAN':
      // Clear only the current selected service
      return {
        ...state,
        service: {} as Servicios
      };

    case 'RESET_ALL':
      return {
        service: {} as Servicios,
        services: [],
        state: {}
      };

    default:
      return state;
  }
};
