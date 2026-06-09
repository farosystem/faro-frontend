/**
 * Nota 22: Tipo de Transacción
 */
enum TIPO_TRANSACCION {
  _01_VENTA_NORMAL_BIENES_SERVICIOS = '01',
  _02_MERCANCIA_AUTOCONSUMO_EXENTO = '02',
  _03_MERCANCIA_AUTOCONSUMO_GRAVADO = '03',
  _04_SERVICIO_AUTOCONSUMO_EXENTO = '04',
  _05_SERVICIO_AUTOCONSUMO_GRAVADO = '05',
  _06_CUOTA_AFILIACION = '06',
  _07_CUOTA_AFILIACION_EXENTA = '07',
  _08_BIENES_CAPITAL_PARA_EMISOR = '08',
  _09_BIENES_CAPITAL_PARA_RECEPTOR = '09',
  _10_BIENES_CAPITAL_PARA_EMISOR_Y_RECEPTOR = '10',
  /**
   * Se utiliza cuando se haya retirado bienes de capital para uso o consumo personal del contribuyente
   * (LIVA art. 2, párrafo 1 e inciso 1, subinciso e) y RLIVA art. 1, incisos 4 y 5).
   */
  _11_BIENES_CAPITAL_AUTOCONSUMO_EXENTO_PARA_EMISOR = '11',
  /**
   * Se utiliza cuando se haya retirado bienes de capital para su transferencia sin contraprestación a terceros
   * (LIVA art. 2, párrafo 1 e inciso 1, subinciso e) y RLIVA art. 1, inciso 5).
   */
  _12_BIENES_CAPITAL_SIN_CONTRAPRESTACION_TERCEROS_EXENTO_PARA_EMISOR = '12',
  /**
   * Se utiliza cuando se haya el retiro de bienes para uso o consumo personal del contribuyente o su transferencia
   * sin contraprestación a terceros (LIVA art 2, inciso 1, subinciso e).
   */
  _13_SIN_CONTRAPRESTACION_A_TERCEROS = '13'
}

export { TIPO_TRANSACCION };
