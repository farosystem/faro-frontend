/**
 * https://atv.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2024/v4.4/ANEXOS%20Y%20ESTRUCTURAS_V4.4.pdf
 * Pagina 69.
 *
 * Nota 5/ En las Condiciones de la venta, se debe utilizar la siguiente codificación:
 */
enum CONDICION_VENTA {
  _01_CONTADO = '01',
  _02_CREDITO = '02',
  _03_CONSIGNACION = '03',
  _04_APARTADO = '04',
  _05_ARRENDAMIENTO_CON_OPCION_COMPRA = '05',
  _06_ARRENDAMIENTO_EN_FUNCION_FINANCIERA = '06',
  _07_COBRO_A_FAVOR_DE_UN_TERCERO = '07',
  /**
   * Se utiliza dicha condición de venta cuanto el servicio que se le preste al estado,
   * una vez generada la factura no se recibe el pago de forma inmediata.
   */
  _08_SERVICIOS_PRESTADOS_AL_ESTADO = '08',
  /**
   * El código 09, Pago de servicios prestado al Estado se utilizará únicamente para efectos
   * de los Recibos Electrónicos de Pago que cancelen una Factura Electrónica original con código 08.
   * Cualquier modificación por medio de NC o ND, debe realizarse a la factura electrónica original, con código 08.
   */
  _09_PAGO_SERVICIOS_PRESTADOS_AL_ESTADO = '09',
  /**
   * Este código se debe de utilizar, cuando el comprobante electrónico que se está generando
   * por la venta de un bien o servicio gravado con IVA es a crédito y además la venta del bien
   * o servicio cumple con las características establecidas en el artículo 3 inciso 8) y 27 de la LIVA.
   */
  _10_VENTA_A_CREDITO_EN_IVA_HASTA_90_DIAS = '10',
  /**
   * El código 11, Pago de venta a crédito en IVA hasta 90 días (Artículo 27, LIVA) se utilizará.
   * utilizará únicamente para efectos del Recibo Electrónico que cancelen una Factura Electrónica
   * original con código 10. Cualquier modificación por medio de NC o ND, debe realizarse a la factura
   * electrónica original, con código 10.
   */
  _11_PAGO_VENTA_A_CREDITO_EN_IVA_HASTA_90_DIAS = '11',
  /**
   * Ventas de una mercancía cuando la misma no se encuentra nacionalizada en Costa Rica, puede ser
   * antes o después de haber presentado la Declaración de Mercancías ante la Autoridad Aduanera del
   * país destino. Ejemplo: Ventas Sucesivas.
   */
  _12_VENTA_MERCANCIA_NO_NACIONALIZADA = '12',
  /**
   * Ventas de bienes usados por parte un no contribuyente a un Obligado Tributario, que ocupe respaldar
   * en su contabilidad dicha compra. Aplicará únicamente en factura electrónica de compra.
   */
  _13_VENTA_BIENES_USADOS_NO_CONTRIBUYENTES = '13',
  /**
   * Se entiende como arrendamiento operativo, lo definido en las normas tributarias, por ejemplo,
   * el Decreto 32876-H y sus modificaciones.
   */
  _14_ARRENDAMIENTO_OPERATIVO = '14',
  /**
   * Se entiende como arrendamiento financiero, lo definido en las normas tributarias, por ejemplo,
   * el Decreto 32876-H y sus modificaciones.
   */
  _15_ARRENDAMIENTO_FINANCIERO = '15',
  /**
   * Se debe indicar la condición de la venta en la representación gráfica
   */
  _99_OTROS = '99'
}

export { CONDICION_VENTA };
