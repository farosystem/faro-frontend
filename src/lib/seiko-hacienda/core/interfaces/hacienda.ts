import { TIPO_DOCUMENTO_REFERENCIA } from '../enums';

export interface EmitirFacturaElectronicaRequest {
  CodigoCliente: string;
  DocElectronicos: DocElectronico[];
}

export interface DocElectronico {
  Encabezado: Encabezado;
  LineasDetalle: LineaDetalle[];
  MedioPago: MedioPago[];
  InformacionReferencia: InformacionReferencia[] | null;
}

export interface Encabezado {
  TipoDocumento: number;
  SecuenciaControlada: number;
  NumeroConsecutivo: string;
  Clave: string;
  SecuenciaDocumento: number;
  Sucursal: string;
  Terminal: string;
  SituacionEnvio: number;
  CodigoActividad: string;
  FechaEmision: string;
  CondicionVenta: number;
  PlazoCredito: string;
  TipoCambio: number;
  CodigoMoneda: string;
  Receptor: Receptor;
}

export interface Receptor {
  Nombre: string;
  IdentificacionTipo: string;
  IdentificacionNumero: string;
  NombreComercial: string | null;
  CorreoElectronico: string | null;
  CorreoElectronicoCC: string | null;
  ActividadEconomica: string;
}

export interface LineaDetalle {
  EsServicio: string;
  CodigoCabys: string;
  CodigoTipo: string;
  Codigo: string;
  PartidaArancelaria: string;
  Cantidad: string;
  UnidadMedida: number;
  UnidadMedidaComercial: string;
  Detalle: string;
  PrecioUnitario: string;
  DescripcionExtra: string;
  BaseImponible: number;
  DescuentoMonto: number;
  DescuentoDetalle: string;
  DescuentoCodigo: string;
  Impuestos: ImpuestoDetalle[];
}

export interface ImpuestoDetalle {
  Codigo: string;
  CodigoTarifa: string;
  Tarifa: number;
  Monto: number;
  FactorIVA: number;
  MontoExportacion: number;
  Exoneracion: Exoneracion | null;
}

export type Exoneracion = {
  TipoDocumento?: string;
  NumeroDocumento?: string;
  NombreInstitucion?: string;
  PorcentajeExoneracion?: number;
  MontoExoneracion?: number;
} | null;

export interface MedioPago {
  TipoMedioPago: string;
  TotalMedioPago: string;
  /** descripción requerida por Hacienda cuando TipoMedioPago es "99" (OTRO); se serializa como <MedioPagoOtros> */
  MedioPagoOtros?: string;
}

export interface InformacionReferencia {
  TipoDoc: TIPO_DOCUMENTO_REFERENCIA;
  Numero: string;
  FechaEmision: string;
  Codigo: string;
  Razon: string;
}
