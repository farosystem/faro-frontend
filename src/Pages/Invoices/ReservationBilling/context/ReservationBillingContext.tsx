import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { reservationBillingInitialState } from './state/reservationBillingInitialState';
import { ReservationBillingState } from './state/ReservationBillingState';
import {
  ReservationBillingAction,
  reservationBillingReducer
} from './reducer/reservationBillingReducer';

interface ReservationBillingValue {
  state: ReservationBillingState;
  dispatch: React.Dispatch<ReservationBillingAction>;
}

const ReservationBillingContext = createContext<ReservationBillingValue | null>(null);

export const useReservationBillingContext = () => {
  const ctx = useContext(ReservationBillingContext);
  if (!ctx) {
    throw new Error('useReservationBillingContext must be used within ReservationBillingProvider');
  }
  return ctx;
};

export const ReservationBillingProvider = ({
  children,
  initialData
}: {
  children: React.ReactNode;
  initialData?: Partial<ReservationBillingState>;
}) => {
  const initial: Partial<ReservationBillingState> = {
    ...reservationBillingInitialState,
    ...initialData
  };

  const [state, dispatch] = useReducer(
    reservationBillingReducer,
    initial as ReservationBillingState
  );

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ReservationBillingContext.Provider value={value}>
      {children}
    </ReservationBillingContext.Provider>
  );
};
