/**
 * https://atv.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2024/v4.4/ANEXOS%20Y%20ESTRUCTURAS_V4.4.pdf
 * Pagina 71.
 *
 * Nota 8.1/ Cuando se trata del IVA las tarifas y códigos a utilizar son las siguientes:
 */
enum TARIFA_IMPUESTO_VALOR_AGREGADO {
  /**
   * La tarifa 0% se utilizará únicamente cuando la transacciones que se realicen correspondan a las transacciones
   * definidas en el artículo 32, numeral 1 del Reglamento de la Ley sobre el Impuesto al Valor Agregado, que otorga
   * derecho a crédito pleno, como por ejemplo ventas a la CCSS o a municipalidades, entre otros.
   */
  _01_TARIFA_0 = '01',
  _02_TARIFA_REDUCIDA_1 = '02',
  _03_TARIFA_REDUCIDA_2 = '03',
  _04_TARIFA_REDUCIDA_4 = '04',
  /**
   * El código 05, Transitorio 0% se utilizará únicamente para efectos de las Notas de Crédito y
   * Notas de Débito que lo requieran.
   */
  _05_TRANSITORIO_0 = '05',
  /**
   * El código 06, Transitorio 4% se utilizará únicamente para efectos de las Notas de Crédito y
   * Notas de Débito que lo requieran.
   */
  _06_TRANSITORIO_4 = '06',
  /**
   * El código 07, Transitorio 8% se utilizará únicamente para efectos de las Notas de Crédito y
   * Notas de Débito que lo requieran.
   */
  _07_TARIFA_TRANSITORIA_8 = '07',
  _08_TARIFA_GENERAL_13 = '08',
  _09_TARIFA_REDUCIDA_0_5 = '09',
  /**
   * El código 10, Tarifa Exenta Ley 9635, Articulo 8.
   */
  _10_TARIFA_EXENTA = '10',
  /**
   * El código 11, se utilizará únicamente en aquellos casos en los que se registre la transacción
   * de un bien o servicio no sujeto pero que no otorga derecho a crédito.
   */
  _11_TARIFA_0_SIN_DERECHO_CREDITO = '11'
}

export { TARIFA_IMPUESTO_VALOR_AGREGADO };
