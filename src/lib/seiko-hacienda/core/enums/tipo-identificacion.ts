/**
 * https://atv.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2024/v4.4/ANEXOS%20Y%20ESTRUCTURAS_V4.4.pdf
 * Pagina 68.
 *
 * Nota 4/ El formato para el tipo de identificación es el siguiente:
 */
enum TIPO_IDENTIFICACION {
  _01_CEDULA_FISICA = '01',
  _02_CEDULA_JURIDICA = '02',
  _03_DIMEX = '03',
  _04_NITE = '04',
  /**
   * Este tipo de identificación estará disponible en los Datos del Emisor de la Factura Electrónica de Compra
   * únicamente para el registro de las adquisiciones de servicios o bienes intangibles a proveedores no
   * domiciliados en Costa Rica, según el artículo 29 inciso d) y el Transitorio XV del Reglamento del IVA.
   *
   * En Factura Electrónica, estará disponible en los Datos del Receptor, únicamente cuando en el campo
   * “Condición de la Venta” se haya seleccionado el código 12 “Ventas de Bienes No Nacionalizados” Este código
   * también estará habilitado para su uso en la Factura Electrónica de Exportación y Tiquete Electrónico.
   */
  _05_EXTRANJERO_NO_DOMICILIADO = '05',
  /**
   * Este tipo de identificación estará disponible en los Datos del Emisor de la Factura Electrónica de Compra
   * únicamente para el registro de las adquisiciones de bienes usados vendidos por un no contribuyente para
   * los efectos contables que corresponda. Estará disponible únicamente cuando en el campo
   * “Condición de la Venta” se haya seleccionado el código 13 “Ventas Bienes Usados No Contribuyentes”.
   */
  _06_NO_CONTRIBUYENTE = '06'
}

export { TIPO_IDENTIFICACION };
