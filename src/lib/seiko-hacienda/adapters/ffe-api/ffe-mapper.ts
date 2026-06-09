import { CODIGO_MONEDA, CONDICION_VENTA, MEDIO_PAGO, TIPO_DOCUMENTO } from '../../core/enums';

export const mapCondicionVentaToFFE = (condicion: CONDICION_VENTA): number => {
  return parseInt(condicion, 10);
};

export const mapTipoDocumentoToFFE = (tipoDocumento: TIPO_DOCUMENTO): number => {
  return parseInt(tipoDocumento, 10);
};

export const mapMedioPagoToFFE = (medioPago: MEDIO_PAGO): number => {
  return parseInt(medioPago, 10);
};

export const mapCodigoMonedaToFFE = (codigoMoneda: CODIGO_MONEDA | string): string => {
  switch (codigoMoneda) {
    case 'CRC':
    case CODIGO_MONEDA.CRC:
      return '1';
    case 'USD':
    case CODIGO_MONEDA.USD:
      return '2';
    default:
      return '1';
  }
};
