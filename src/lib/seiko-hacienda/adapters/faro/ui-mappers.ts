import { CONDICION_VENTA, TIPO_DOCUMENTO, MEDIO_PAGO, CODIGO_MONEDA } from '../../core/enums';

const padEnumCode = (value: string | number, length: number = 2): string => {
  return String(value).padStart(length, '0');
};

export const parseTipoDocumento = (value: string | number): TIPO_DOCUMENTO => {
  // first try to pad numeric codes
  let parsed = padEnumCode(value);

  // if the value looks like a human-readable label, try to infer
  if (typeof value === 'string' && isNaN(Number(value))) {
    const lower = value.toLowerCase();
    if (lower.includes('factura electronica export') || lower.includes('exportación')) {
      parsed = '09';
    } else if (lower.includes('tiquete')) {
      parsed = '04';
    } else if (lower.includes('factura')) {
      // any kind of factura (compra, electronica, etc.) defaults to 01
      parsed = '01';
    }
  }

  // Validamos que realmente sea un valor válido del Enum
  if (!Object.values(TIPO_DOCUMENTO).includes(parsed as TIPO_DOCUMENTO)) {
    throw new Error(`Tipo de documento inválido: ${parsed}`);
  }
  return parsed as TIPO_DOCUMENTO;
};

export const parseCondicionVenta = (value: string | number): CONDICION_VENTA => {
  // Hacienda does not recognise "00" or empty; treat missing as contado (01)
  const str = String(value || '').trim();
  if (str === '' || str === '00') {
    return CONDICION_VENTA._01_CONTADO;
  }

  const parsed = padEnumCode(str);
  if (!Object.values(CONDICION_VENTA).includes(parsed as CONDICION_VENTA)) {
    throw new Error(`Condición de venta inválida: ${parsed}`);
  }
  return parsed as CONDICION_VENTA;
};

export const parseMedioPago = (value: string | number): MEDIO_PAGO => {
  // pad numeric
  let parsed = padEnumCode(value);
  // if looks like a label, infer from text
  if (typeof value === 'string' && isNaN(Number(value))) {
    const lower = value.toLowerCase();
    if (lower.includes('efectivo')) parsed = '01';
    else if (lower.includes('tarjeta')) parsed = '02';
    else if (lower.includes('cheque')) parsed = '03';
    else if (lower.includes('transfer')) parsed = '04';
    else if (lower.includes('otro')) parsed = '99';
  }

  if (!Object.values(MEDIO_PAGO).includes(parsed as MEDIO_PAGO)) {
    throw new Error(`Medio de pago inválido: ${parsed}`);
  }
  return parsed as MEDIO_PAGO;
};

export const parseCodigoMoneda = (value: string | number): CODIGO_MONEDA => {
  const strValue = String(value);
  if (strValue === '1') return CODIGO_MONEDA.CRC;
  if (strValue === '2') return CODIGO_MONEDA.USD;

  if (!Object.values(CODIGO_MONEDA).includes(strValue as CODIGO_MONEDA)) {
    throw new Error(`Moneda inválida: ${strValue}`);
  }
  return strValue as CODIGO_MONEDA;
};
