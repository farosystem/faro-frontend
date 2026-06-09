/**
 * https://atv.hacienda.go.cr/ATV/ComprobanteElectronico/docs/esquemas/2024/v4.4/ANEXOS%20Y%20ESTRUCTURAS_V4.4.pdf
 * Pagina 64.
 *
 * Nota 1/ En la representación gráfica los campos “Tipo de documento electrónico”, “Clave del comprobante” y “numeración consecutiva”
 * del comprobante deben quedar juntos.
 *
 * Nota 2/ Cada tipo de comprobante electrónico tiene su etiqueta y XML Schema.
 *
 * Nota 3/ La numeración de los comprobantes electrónicos y documentos asociados iniciará en 1, en aquellos casos donde el obligado
 * tributario se traslade a utilizar comprobantes electrónicos por primera vez o se encuentre emitiendo los mismos conforme lo estipulado
 * en la resolución Nº DGT-02-09, el sistema lo asignará automáticamente en el momento de la generación.
 *
 * Para aquellos casos donde el obligado tributario ya se encuentra utilizando comprobantes electrónicos conforme a la resolución vigente,
 * y decida cambiar de plataforma de emisión deberá mantener la numeración consecutiva.
 *
 * Para generar la numeración consecutiva y la clave numérica del comprobante electrónico, definidas en la resolución vigente de comprobantes
 * electrónicos que regula dicho consecutivo, se debe basar en la siguiente codificación:
 *
 * -------------------------------------------------------
 * Numeración consecutiva de los comprobantes electrónicos
 * -------------------------------------------------------
 * Se conformará de la siguiente manera:
 *
 * a)
 * Los tres primeros dígitos identifican el local o establecimiento en el que se emitió el comprobante electrónico o documento asociado.
 * El número 001 corresponde a la oficina central, casa matriz o establecimiento principal y los número 002 y subsiguientes identifican
 * cada una de las sucursales.
 *
 * b)
 * Del cuarto al octavo dígito identificará la terminal o punto de venta de emisión del comprobante electrónico o documento asociado;
 * en los casos que sólo se cuente con una terminal o se posea un servidor centralizado deberá visualizarse de la siguiente manera "00001".
 *
 * c)
 * Del noveno al décimo espacio corresponderá al tipo de comprobante electrónico o documento asociado; se deben utilizar los siguientes códigos:
 *
 * d)
 * Del undécimo al vigésimo dígito le corresponderá al consecutivo de los comprobantes electrónicos o documento asociado iniciando en el número 1,
 * para cada sucursal o terminal según sea el caso.
 *
 * En caso de que se llegue al tope del uso de la numeración consecutiva, se podrá volver a empezar desde el número 1.
 *
 * Dicho consecutivo deberá visualizarse de la siguiente manera:
 *
 * A:1-3    B:4-8   C:9-10  D:11-20
 * 001      00001   01      0000000001
 *
 * A: Casa matriz, sucursales
 * B: Terminal o punto de venta
 * C: Tipo de comprobante de documento asociado
 * D: Numeración del comprobante electrónico
 *
 * -------------------------------------------------------
 * Clave Numérica de los comprobantes electrónicos
 * -------------------------------------------------------
 *
 * Se conformará de la siguiente manera:
 *
 * a)
 * Los primeros tres dígitos corresponden al código del país (506).
 *
 * b)
 * Del cuarto al quinto dígito, corresponde al día en que se genere el comprobante electrónico.
 *
 * c)
 * Del sexto al séptimo dígito, corresponde al mes en que se genere el comprobante electrónico.
 *
 * d)
 * Del octavo al noveno dígito, corresponde al año en que se genere el comprobante electrónico.
 *
 * e)
 * Del décimo al vigésimo primero dígito, corresponde al número de cédula del emisor.
 *
 * f)
 * Del vigésimo segundo al cuadragésimo primero dígito, corresponde a la numeración consecutiva del comprobante electrónico.
 *
 * g)
 * El cuadragésimo segundo le corresponde a la situación del comprobante electrónico para el cual se debe de utilizar la siguiente codificación:
 *
 * h)
 * Del cuadragésimo tercero al quincuagésimo dígito, corresponde al código de seguridad, el cual debe ser generado por el sistema del obligado tributario.
 *
 * El formato de la clave del comprobante electrónico debe visualizarse de la siguiente manera:
 *
 * A:1-3    B:4-5   C:6-7   D:8-9   E:10-21         F:22-41                 G:42    H:43-50
 * 506      01      01      16      003101123456    00100001010000000001    1       99999999
 *
 * A: Codigo Pais;
 * B: Dia;
 * C: Mes;
 * D: Ano;
 * E: Numero Identificacion;
 * F: Numeracion consecutiva
 * G: Situacion del comprobante electronico;
 * H: Codigo de seguridad;
 *
 * Con respecto a los archivos que se generan para envió por correo y almacenamiento se debe acatar el siguiente formato:
 *
 * - XML del comprobante electrónico: clave.xml (50600000000000000000000000000000000000000000000000.xml)
 * - XML de respuesta enviado por Hacienda: clave_respuesta.xml (50600000000000000000000000000000000000000000000000_respuesta.xml)
 * - PDF del comprobante electrónico: clave.pdf (50600000000000000000000000000000000000000000000000.pdf)
 *
 * En el caso de los XML de confirmación de los comprobantes electrónicos se debe utilizar el siguiente formato, el cual se encuentra
 * compuesto de la clave del comprobante que se está confirmando guion (-) número de consecutivo del documento de confirmación:
 *
 * - clave-consecutivo.xml (50600000000000000000000000000000000000000000000000-00100000000000000000.xml)
 * - clave-consecutivo.pdf (50600000000000000000000000000000000000000000000000-00100000000000000000.pdf)
 * - clave-consecutivo_respuesta.xml (50600000000000000000000000000000000000000000000000-00100000000000000000_respuesta.xml)
 */

/**
 * @enum
 */
enum SITUACION_COMPROBANTE {
  /**
   * Corresponde a aquellos comprobantes electrónicos que son generados y transmitidos en el mismo acto
   * de compraventa y prestación del servicio al sistema de validación de comprobantes electrónicos de la
   * Dirección General de Tributación, conforme con lo establecido en la norma vigente.
   */
  NORMAL = 1,
  /**
   * Corresponde a aquellos comprobantes electrónicos que sustituyen al comprobante físico emitido por
   * contingencia, conforme lo establecido en la norma vigente.
   */
  CONTINGENCIA = 2,
  /**
   * Corresponde a aquellos comprobantes que han sido generados y expresados en formato electrónico
   * conforme lo establecido en la norma vigente, pero que no se cuenta con el respectivo acceso a internet.
   */
  SIN_INTERNET = 3
}

export { SITUACION_COMPROBANTE };
