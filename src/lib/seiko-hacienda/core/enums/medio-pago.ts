/**
 * https://atv.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2024/v4.4/ANEXOS%20Y%20ESTRUCTURAS_V4.4.pdf
 * Pagina 70.
 *
 * Nota 6/ En los medios de pago, se debe de utilizar la siguiente codificación:
 */
enum MEDIO_PAGO {
  _01_EFECTIVO = '01',
  _02_TARJETA = '02',
  _03_CHEQUE = '03',
  _04_TRANSFERENCIA = '04',
  /**
   * El código 05, Recaudado por terceros se utilizará cuando el pago sea recibido
   * por un tercero y no por quien emite el servicio o mercancía ejemplo:
   * pago de recibos telefónicos en supermercados.
   */
  _05_RECAUDADO_TERCEROS = '05',
  _06_SINPE_MOVIL = '06',
  _07_PLATAFORMA_DIGITAL = '07',
  /**
   * se debe indicar el medio de pago en la representación gráfica
   */
  _99_OTROS = '99'
}

export { MEDIO_PAGO };
