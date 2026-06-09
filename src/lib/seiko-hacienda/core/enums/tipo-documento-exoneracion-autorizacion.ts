/**
 * Nota 10.1: Tipo de Documento de exoneración o autorización
 */
enum TIPO_DOCUMENTO_EXONERACION {
  _01_COMPRAS_AUTORIZADAS_POR_DGT = '01',
  _02_VENTAS_EXENTAS_A_DIPLOMATICOS = '02',
  _03_AUTORIZADO_POR_LEY_ESPECIAL = '03',
  _04_EXENCIONES_DGH_AUTORIZACION_LOCAL_GENERICA = '04',
  /**
   * Exenciones Dirección General de Hacienda Transitorio V
   * (servicios de ingeniería, arquitectura, topografía obra civil)
   */
  _05_EXENCIONES_DGH_TRANSITORIO_V = '05',
  _06_SERVICIOS_TURISTICOS_INSCRITOS_ANTE_ICT = '06',
  /**
   * Transitorio XVII (Recolección, Clasificación, almacenamiento de Reciclaje y reutilizable)
   */
  _07_TRANSITORIO_XVII_RECICLAJE = '07',
  _08_EXONERACION_A_ZONA_FRANCA = '08',
  _09_EXONERACION_SERVICIOS_COMPLEMENTARIOS_EXPORTACION = '09',
  _10_ORGANO_DE_LAS_CORPORACIONES_MUNICIPALES = '10',
  /**
   * Exenciones Dirección General de Hacienda Autorización de Impuesto Local Concreta
   */
  _11_EXENCIONES_DGH_AUTORIZACION_IMPUESTO_LOCAL_CONCRETA = '11',
  _99_OTROS = '99'
}

export { TIPO_DOCUMENTO_EXONERACION };
