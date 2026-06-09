/**
 * https://atv.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2024/v4.4/ANEXOS%20Y%20ESTRUCTURAS_V4.4.pdf
 * Pagina 70.
 *
 * Nota 8/ El desglose de los Códigos de los impuestos son los siguientes:
 */
enum CODIGO_IMPUESTO {
  _01_IMPUESTO_VALOR_AGREGADO = '01',
  _02_IMPUESTO_SELECTIVO_DE_CONSUMO = '02',
  _03_IMPUESTO_UNICO_A_LOS_COMBUSTIBLES = '03',
  _04_IMPUESTO_ESPECIFICO_DE_BEBIDAS_ALCOHOLICAS = '04',
  _05_IMPUESTO_ESPECIFICO_SOBRE_LAS_BEBIDAS_ENVASADAS_SIN_CONTENIDO_ALCOHOLICO_Y_JABONES_DE_TOCADOR = '05',
  _06_IMPUESTO_A_LOS_PRODUCTOS_DE_TABACO = '06',
  /**
   * Este código se utilizará cuando se realicen ventas de bienes o servicios donde
   * el cálculo de la base imponible del IVA sea especial, por ejemplo, bienes usados,
   * ventas por catálogo, bebidas alcohólicas o no alcohólicas.
   */
  _07_IVA_CALCULO_ESPECIAL = '07',
  _08_IVA_REGIMEN_DE_BIENES_USADOS = '08',
  _12_IMPUESTO_ESPECIFICO_AL_CEMENTO = '12',
  _99_OTROS = '99'
}

export { CODIGO_IMPUESTO };
