import { Cliente, Reserva } from '@/gql/graphql';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

export interface BillingData {
  articulosLista?: LineaDetalleReservaUI[];
  lines?: LineaDetalleReservaUI[];
}

export interface BillingStepProps {
  data?: BillingData;
  cliente?: Cliente;
  reserva?: Reserva;
  isInline?: boolean;
  hideEmitButton?: boolean;
  isModal?: boolean;
  onElectronicInvoiceSuccess?: (data?: any) => void;
  onPartialPaymentSuccess?: (data?: any) => void;
  registerSubmit?: (api: any) => void;
}

export interface SelectOption {
  label: string;
  value: string | number;
}
