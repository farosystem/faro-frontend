/**
 * Nota 12: Tipo de Código de producto/servicio
 */
enum TIPO_CODIGO_PRODUCTO_SERVICIO {
  _01_CODIGO_DEL_PRODUCTO_DEL_VENDEDOR = '01',
  _02_CODIGO_DEL_PRODUCTO_DEL_COMPRADOR = '02',
  /**
   * Código del producto asignado por el fabricante - industriales o importadores
   * (Usado frecuentemente para SKUs o GTIN en paquetes/surtidos)
   */
  _03_CODIGO_DEL_PRODUCTO_ASIGNADO_POR_EL_FABRICANTE = '03',
  _04_CODIGO_USO_INTERNO = '04',
  _99_OTROS = '99'
}

export { TIPO_CODIGO_PRODUCTO_SERVICIO };
