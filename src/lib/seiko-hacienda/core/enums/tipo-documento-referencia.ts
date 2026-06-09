enum TIPO_DOCUMENTO_REFERENCIA {
  _01_FACTURA_ELECTRONICA = '01',
  _02_NOTA_DEBITO_ELECTRONICA = '02',
  _03_NOTA_CREDITO_ELECTRONICA = '03',
  _04_TIQUETE_ELECTRONICO = '04',
  _05_NOTA_DESPACHO = '05',
  _06_CONTRATO = '06',
  _07_PROCEDIMIENTO = '07',
  _08_COMPROBANTE_EMITIDO_EN_CONTIGENCIA = '08',
  /**
   * El código 09, Devolución de mercadería se utilizará
   * únicamente para efectos de las Notas de Crédito y Notas de Débito que lo requieran.
   */
  _09_DEVOLUCION_MERCADERIA = '09',
  _10_COMPROBANTE_ELECTRONICO_RECHAZADO_POR_MINISTERIO_HACIENDA = '10',
  _11_SUSTITUYE_FACTURA_RECHAZADA_POR_EL_RECEPTOR_DEL_COMPROBANTE = '11',
  _12_SUSTITUYE_FACTURA_EXPORTACION = '12',
  /**
   * El código 13 se puede utilizar en los comprobantes electrónicos únicamente cuando el servicio
   * prestado vence el último día del mes, como por ejemplo servicios públicos, los cuales se facturan
   * en los primeros días del mes, pero los ingresos pertenecen al mes anterior; En el campo
   * “fecha de emisión del documento de referencia” del apartado de referencia de debe de indicar la
   * fecha del periodo fiscal que corresponde el ingreso de la factura.
   */
  _13_FACTURACION_MES_VENCIDO = '13',
  _14_COMPROBANTE_APORTADO_POR_CONTRIBUYENTE_DE_REGIMEN_ESPECIAL = '14',
  _15_SUSTITUYE_FACTURA_ELECTRONICA_COMPRA = '15',
  /**
   * El código 16 únicamente podrá ser utilizado en la Factura Electrónica de Compra.
   */
  _16_COMPROBANTE_DE_PROVEEDOR_NO_DOMICILIADO = '16',
  _17_NOTA_CREDITO_A_FACTURA_ELETRONICA_COMPRA = '17',
  _18_NOTA_DEBITO_A_FACTURA_ELETRONICA_COMPRA = '18',
  _99_OTROS = '99'
}

export { TIPO_DOCUMENTO_REFERENCIA };
