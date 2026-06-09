enum CODIGO_REFERENCIA {
  _01_ANULA_DOCUMENTO_REFERENCIA = '01',
  _02_CORRIGE_MONTO = '02',
  _04_REFERENCIA_A_OTRO_DOCUMENTO = '04',
  _05_SUSTITUYE_COMPROBANTE_PROVISIONAL_POR_CONTINGENCIA = '05',
  _06_DEVOLUCION_MERCANCIA = '06',
  _07_SUSTITUYE_COMPROBANTE_ELECTRONICO = '07',
  _08_FACTURA_ENDOSADA = '08',
  _09_NOTA_CREDITO_FINANCIERA = '09',
  _10_NOTA_DEBITO_FINANCIERA = '10',
  _11_PROVEEDOR_NO_DOMICILIADO = '11',
  /**
   * El código 12, Crédito por exoneración posterior a la facturación se utilizará únicamente
   * para efectos de las notas de crédito que lo requieran cuando se aplique una exoneración concreta de impuestos locales aprobada posterior a la transacción.
   */
  _12_CREDITO_POR_EXONERACION_POSTERIOR_A_LA_FACTURACION = '12',
  _99_OTROS = '99'
}

export { CODIGO_REFERENCIA };
