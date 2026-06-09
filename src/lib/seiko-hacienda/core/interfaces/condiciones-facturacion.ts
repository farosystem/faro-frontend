import {
  TIPO_DOCUMENTO,
  CONDICION_VENTA,
  MEDIO_PAGO,
  CODIGO_MONEDA
} from '@/lib/seiko-hacienda/core/enums';

export interface CondicionesFacturacion {
  TipoDocumento: TIPO_DOCUMENTO;
  CondicionVenta: CONDICION_VENTA;
  CodigoMoneda: CODIGO_MONEDA;
  TipoMedioPago: MEDIO_PAGO;
  /** only used when TipoMedioPago = '99' (OTRO). Hacienda requires an "Otro" string describing the method */
  MedioPagoOtros?: string;
  /** plazo en días para ventas a crédito; Hacienda exige >=1 cuando CondicionVenta es crédito */
  PlazoCredito?: number | string;
}
