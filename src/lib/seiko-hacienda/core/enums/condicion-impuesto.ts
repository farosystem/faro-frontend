/**
 * Nota 18: Condición del impuesto
 */
enum CONDICION_IMPUESTO {
  /**
   * Se utiliza, cuando el IVA pagado se utilizará en su totalidad como un crédito en la declaración
   * del Impuesto al Valor Agregado.
   */
  _01_GENERA_CREDITO_IVA = '01',
  /**
   * Se utiliza, cuando el crédito que se aplica es proporcional a la tarifa reducida, ejemplo
   * se adquiere una computadora gravada al 13% para servicios médicos, por lo cual del impuesto
   * pagado me acredito un 4% y el restante 9% se constituye como un costo, o la factura posee
   * líneas para diferentes actividades.
   */
  _02_GENERA_CREDITO_PARCIAL_IVA = '02',
  /**
   * Se utiliza, cuando se adquieren bienes utilizados en la producción o fabricación de productos
   * (bienes de consumo) que no están incorporados como componentes o materias primas de estos.
   * ejemplo equipos, inmuebles etc.
   */
  _03_BIENES_DE_CAPITAL = '03',
  /**
   * Se utiliza cuando el IVA pagado no es aplicable en la declaración de Impuesto al Valor Agregado,
   * por el contrario, representa un gasto en la declaración de utilidades.
   */
  _04_GASTO_CORRIENTE_NO_GENERA_CREDITO = '04',
  /**
   * Se utiliza, cuando al momento que la confirmación de la factura se desconoce si el bien o servicio,
   * será utilizado en la producción o prestación de servicio que se encuentren gravados del IVA,
   * o desconozco la tarifa que puedo aplicar como crédito para cada actividad económica.
   */
  _05_PROPORCIONALIDAD = '05'
}

export { CONDICION_IMPUESTO };
