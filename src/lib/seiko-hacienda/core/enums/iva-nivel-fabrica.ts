/**
 * Nota 21: Condición del IVA cobrado a nivel de fábrica
 */
enum IVA_COBRADO_NIVEL_FABRICA {
  /**
   * Venta de bienes con IVA según el sistema especial de determinación de IVA a nivel de fábrica.
   */
  _01_VENTA_BIENES_CON_IVA = '01',
  /**
   * Ventas exentas según el sistema especial de determinación de IVA a nivel de fábrica, mayorista y aduanas.
   */
  _02_VENTAS_EXENTAS = '02'
}

export { IVA_COBRADO_NIVEL_FABRICA };
