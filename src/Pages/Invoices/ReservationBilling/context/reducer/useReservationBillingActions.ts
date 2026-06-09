import { useMemo } from 'react';

import { useReservationBillingContext } from '../ReservationBillingContext';
import { ReservationBillingState } from '../state/ReservationBillingState';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

export const useReservationBillingActions = () => {
  const { dispatch } = useReservationBillingContext();

  return useMemo(
    () => ({
      /**
       * Inicializa todo el estado.
       * Aquí es donde deberías pasar las líneas ya con sus IDs generados.
       */
      initialize: (payload: Partial<ReservationBillingState>) =>
        dispatch({ type: 'INIT', payload }),

      /**
       * Selecciona o deselecciona una línea para la factura.
       * El payload es directamente el string del ID.
       */
      toggleLine: (id: string) => dispatch({ type: 'TOGGLE_LINE', payload: { id } }),

      /**
       * Actualiza un campo específico de una línea (Precio, Cantidad, Detalle, etc.)
       * 'field' está restringido a las llaves de LineaDetalleReservaUI para evitar errores.
       */
      updateLine: (id: string, field: keyof LineaDetalleReservaUI, value: any) =>
        dispatch({ type: 'UPDATE_LINE', payload: { id, field, value } }),

      /**
       * Cambia la visibilidad del stepper
       */
      setStepperVisible: (visible: boolean) =>
        dispatch({ type: 'SET_STEPPER_VISIBLE', payload: visible }),

      /**
       * Limpia el estado (útil al cerrar el proceso o terminar la factura)
       */
      reset: () => dispatch({ type: 'RESET' })
    }),
    [dispatch]
  );
};
