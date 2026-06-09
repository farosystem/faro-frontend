export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  JSON: { input: any; output: any };
  Number: { input: any; output: any };
};

export type ActividadEconomica = {
  __typename?: 'ActividadEconomica';
  _id?: Maybe<Scalars['ID']['output']>;
  codigo?: Maybe<Scalars['String']['output']>;
  codigoSubclaseTribu?: Maybe<Scalars['String']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  descripcion?: Maybe<Scalars['String']['output']>;
  descripcionSubclaseTribu?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type ActividadEconomicaInput = {
  codigo?: InputMaybe<Scalars['String']['input']>;
  codigoSubclaseTribu?: InputMaybe<Scalars['String']['input']>;
  descripcion?: InputMaybe<Scalars['String']['input']>;
  descripcionSubclaseTribu?: InputMaybe<Scalars['String']['input']>;
};

export type Activo = {
  __typename?: 'Activo';
  estado?: Maybe<Scalars['String']['output']>;
  fechaRegistro?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  referenciaInterna?: Maybe<Scalars['String']['output']>;
  unidad?: Maybe<Unidad>;
};

export type ActivoConMovimientos = {
  __typename?: 'ActivoConMovimientos';
  estado?: Maybe<Scalars['String']['output']>;
  fechaRegistro?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  movimientos?: Maybe<Array<Maybe<MovimientosActivoType>>>;
  nombre?: Maybe<Scalars['String']['output']>;
  referenciaInterna?: Maybe<Scalars['String']['output']>;
  unidad?: Maybe<Unidad>;
};

export type ActivoInput = {
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  referenciaInterna?: InputMaybe<Scalars['String']['input']>;
  unidad?: InputMaybe<Unidad>;
};

export type ActivoMovimientos = {
  __typename?: 'ActivoMovimientos';
  activo?: Maybe<Activo>;
  movimientos?: Maybe<Array<Maybe<MovimientosActivoType>>>;
};

export type Almacen = {
  __typename?: 'Almacen';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type AlmacenInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type AlmacenLinea = {
  __typename?: 'AlmacenLinea';
  almacen?: Maybe<Almacen>;
  cantidad?: Maybe<Scalars['Number']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  producto?: Maybe<MateriaPrima>;
};

export type AlmacenLineaInput = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
};

export type AnulacionComanda = {
  __typename?: 'AnulacionComanda';
  _id?: Maybe<Scalars['ID']['output']>;
  accion?: Maybe<Scalars['String']['output']>;
  caja?: Maybe<Scalars['ID']['output']>;
  cantidad?: Maybe<Scalars['Int']['output']>;
  comanda?: Maybe<Scalars['ID']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  monto?: Maybe<Scalars['Number']['output']>;
  motivo?: Maybe<Scalars['String']['output']>;
  platilloId?: Maybe<Scalars['ID']['output']>;
  platilloNombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  registroContable?: Maybe<Scalars['ID']['output']>;
  turno?: Maybe<Scalars['ID']['output']>;
  usuarioAnula?: Maybe<Scalars['ID']['output']>;
  usuarioOrden?: Maybe<Scalars['ID']['output']>;
};

export type AnulacionComandaInput = {
  accion: Scalars['String']['input'];
  caja?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Int']['input']>;
  comanda: Scalars['ID']['input'];
  monto?: InputMaybe<Scalars['Number']['input']>;
  motivo?: InputMaybe<Scalars['String']['input']>;
  platilloId?: InputMaybe<Scalars['ID']['input']>;
  platilloNombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  turno?: InputMaybe<Scalars['ID']['input']>;
  usuarioAnula: Scalars['ID']['input'];
  usuarioOrden?: InputMaybe<Scalars['ID']['input']>;
};

export type AnulacionPendienteComanda = {
  __typename?: 'AnulacionPendienteComanda';
  _id?: Maybe<Scalars['ID']['output']>;
  accion?: Maybe<Scalars['String']['output']>;
  deducciones?: Maybe<Array<Maybe<DeduccionInventario>>>;
  esConCobro?: Maybe<Scalars['Boolean']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  monto?: Maybe<Scalars['Number']['output']>;
  motivo?: Maybe<Scalars['String']['output']>;
  platillo?: Maybe<Scalars['String']['output']>;
  usuarioAnulo?: Maybe<Scalars['String']['output']>;
  usuarioOrden?: Maybe<Scalars['String']['output']>;
};

export type AprobarAnulacionInput = {
  anulacionId: Scalars['ID']['input'];
  motivo?: InputMaybe<Scalars['String']['input']>;
  usuarioAprobador: Scalars['ID']['input'];
};

export type Area = {
  __typename?: 'Area';
  nombre?: Maybe<Scalars['String']['output']>;
};

export type AreaInput = {
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type Areas = {
  __typename?: 'Areas';
  descripcion?: Maybe<Scalars['String']['output']>;
  eliminable?: Maybe<Scalars['Boolean']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type AreasChequeo = {
  __typename?: 'AreasChequeo';
  area?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['Boolean']['output']>;
};

export type AreasChequeoInput = {
  area?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AreasInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type Caja = {
  __typename?: 'Caja';
  codigo?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<EstadoCaja>;
  id?: Maybe<Scalars['ID']['output']>;
  modulo?: Maybe<ModuloCaja>;
  montos_apertura?: Maybe<Scalars['JSON']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  numero?: Maybe<Scalars['Int']['output']>;
};

export type CajaInput = {
  codigo?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<EstadoCaja>;
  modulo?: InputMaybe<ModuloCaja>;
  montos_apertura?: InputMaybe<Scalars['JSON']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  numero?: InputMaybe<Scalars['Int']['input']>;
};

export type CambiarEstadoComandaRespuesta = {
  __typename?: 'CambiarEstadoComandaRespuesta';
  estado?: Maybe<Scalars['String']['output']>;
  exitoso?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Chequeo = {
  __typename?: 'Chequeo';
  aprobado?: Maybe<Scalars['Boolean']['output']>;
  areas?: Maybe<Array<Maybe<AreasChequeo>>>;
  fecha?: Maybe<Scalars['Date']['output']>;
  fechaRegistro?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  puesto_limpieza?: Maybe<PuestoLimpieza>;
  usuario?: Maybe<Usuario>;
};

export type ChequeoInput = {
  aprobado?: InputMaybe<Scalars['Boolean']['input']>;
  areas?: InputMaybe<Array<InputMaybe<AreasChequeoInput>>>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  fechaRegistro?: InputMaybe<Scalars['Date']['input']>;
  puesto_limpieza?: InputMaybe<Scalars['ID']['input']>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type Cliente = {
  __typename?: 'Cliente';
  calle?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  ciudad?: Maybe<Scalars['String']['output']>;
  codigo?: Maybe<Scalars['String']['output']>;
  correos?: Maybe<Array<Maybe<Email>>>;
  cp?: Maybe<Scalars['String']['output']>;
  credito?: Maybe<Credito>;
  direccion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  nombreFacturacion?: Maybe<Scalars['String']['output']>;
  pais?: Maybe<Scalars['String']['output']>;
  redes?: Maybe<Array<Maybe<RedSocial>>>;
  telefonos?: Maybe<Array<Maybe<Telefono>>>;
  tipo?: Maybe<Scalars['String']['output']>;
};

export type ClienteInput = {
  calle?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  ciudad?: InputMaybe<Scalars['String']['input']>;
  codigo?: InputMaybe<Scalars['String']['input']>;
  correos?: InputMaybe<Array<InputMaybe<EmailInput>>>;
  cp?: InputMaybe<Scalars['String']['input']>;
  credito?: InputMaybe<Credito>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  nombreFacturacion?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  redes?: InputMaybe<Array<InputMaybe<RedSocialInput>>>;
  telefonos?: InputMaybe<Array<InputMaybe<TelefonoInput>>>;
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export type Comanda = {
  __typename?: 'Comanda';
  estado?: Maybe<EstadoComanda>;
  fecha?: Maybe<Scalars['Date']['output']>;
  fechaEnPreparacion?: Maybe<Scalars['Date']['output']>;
  fechaEntregada?: Maybe<Scalars['Date']['output']>;
  fechaFinalizada?: Maybe<Scalars['Date']['output']>;
  fechaGenerada?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  mesa?: Maybe<Mesa>;
  numeroHabitacion?: Maybe<Scalars['String']['output']>;
  preFactura?: Maybe<Scalars['Boolean']['output']>;
  reservaHabitacion?: Maybe<ReservaHabitacion>;
  subcuentas?: Maybe<Array<Maybe<Subcuenta>>>;
};

export type ComandaConSubcuentas = {
  __typename?: 'ComandaConSubcuentas';
  comanda?: Maybe<Comanda>;
  subcuentas?: Maybe<Array<Maybe<Subcuenta>>>;
};

export type ComandaException = {
  __typename?: 'ComandaException';
  _id?: Maybe<Scalars['ID']['output']>;
  comanda?: Maybe<Scalars['ID']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  mesero?: Maybe<Scalars['ID']['output']>;
  motivo?: Maybe<Scalars['String']['output']>;
};

export type ComandaInput = {
  estado?: InputMaybe<EstadoComanda>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  fechaEnPreparacion?: InputMaybe<Scalars['Date']['input']>;
  fechaEntregada?: InputMaybe<Scalars['Date']['input']>;
  fechaFinalizada?: InputMaybe<Scalars['Date']['input']>;
  fechaGenerada?: InputMaybe<Scalars['Date']['input']>;
  mesa?: InputMaybe<Scalars['ID']['input']>;
  preFactura?: InputMaybe<Scalars['Boolean']['input']>;
  reservaHabitacionId?: InputMaybe<Scalars['ID']['input']>;
};

export type ComandaReport = {
  __typename?: 'ComandaReport';
  _id?: Maybe<Scalars['ID']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  fechaFinalizada?: Maybe<Scalars['Date']['output']>;
  mesa?: Maybe<Mesa>;
};

export type ComandasPorPiso = {
  __typename?: 'ComandasPorPiso';
  mesas?: Maybe<Array<Maybe<MesaConComandas>>>;
  piso?: Maybe<Piso>;
};

export type Comodidades = {
  __typename?: 'Comodidades';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type ComodidadesInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export enum Credito {
  Aprobado = 'Aprobado',
  NoAprobado = 'No_Aprobado'
}

export type Data = {
  __typename?: 'Data';
  CodigoCliente?: Maybe<Scalars['String']['output']>;
  DocElectronicos?: Maybe<Array<Maybe<DocElectronicos>>>;
};

export type Data_Items = {
  __typename?: 'Data_Items';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
};

export type DeduccionInventario = {
  __typename?: 'DeduccionInventario';
  cantidad?: Maybe<Scalars['Float']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  producto?: Maybe<Scalars['ID']['output']>;
  unidad?: Maybe<Scalars['String']['output']>;
};

export enum Disponibilidad {
  Libre = 'LIBRE',
  Ocupada = 'OCUPADA',
  Reservada = 'RESERVADA'
}

export type DocElectronicos = {
  __typename?: 'DocElectronicos';
  Encabezado?: Maybe<Encabezado>;
  InformacionReferencia?: Maybe<Scalars['JSON']['output']>;
  LineasDetalle?: Maybe<Array<Maybe<LineasDetalle>>>;
};

export enum ETipoMesa {
  Mesa = 'Mesa',
  Silla = 'Silla'
}

export type Email = {
  __typename?: 'Email';
  email?: Maybe<Scalars['String']['output']>;
};

export type EmailInput = {
  email?: InputMaybe<Scalars['String']['input']>;
};

export type Encabezado = {
  __typename?: 'Encabezado';
  CantDeci?: Maybe<Scalars['Int']['output']>;
  Clave?: Maybe<Scalars['String']['output']>;
  CodigoActividad?: Maybe<Scalars['String']['output']>;
  CodigoMoneda?: Maybe<Scalars['String']['output']>;
  CondicionVenta?: Maybe<Scalars['String']['output']>;
  FechaEmision?: Maybe<Scalars['String']['output']>;
  MedioPago?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  NumeroConsecutivo?: Maybe<Scalars['String']['output']>;
  PlazoCredito?: Maybe<Scalars['Int']['output']>;
  Receptor?: Maybe<Receptor>;
  SecuenciaControlada?: Maybe<Scalars['Int']['output']>;
  SecuenciaDocumento?: Maybe<Scalars['Int']['output']>;
  SituacionEnvio?: Maybe<Scalars['Int']['output']>;
  Sucursal?: Maybe<Scalars['Int']['output']>;
  Terminal?: Maybe<Scalars['Int']['output']>;
  TipoCambio?: Maybe<Scalars['Int']['output']>;
  TipoDocumento?: Maybe<Scalars['String']['output']>;
};

export enum Estado {
  Activo = 'ACTIVO',
  Inactivo = 'INACTIVO'
}

export enum EstadoCaja {
  Abierta = 'ABIERTA',
  Cerrada = 'CERRADA',
  CierreParcial = 'CIERRE_PARCIAL',
  Inactiva = 'INACTIVA'
}

export enum EstadoComanda {
  Descartada = 'DESCARTADA',
  Finalizada = 'FINALIZADA',
  Generada = 'GENERADA'
}

export enum EstadoCuenta {
  Borrador = 'BORRADOR',
  Pagado = 'PAGADO',
  Pendiente = 'PENDIENTE'
}

export enum EstadoPedido {
  Borrador = 'Borrador',
  Cancelado = 'Cancelado',
  Confirmado = 'Confirmado',
  Facturado = 'Facturado',
  Recibido = 'Recibido'
}

export enum EstadoPiso {
  Activo = 'ACTIVO',
  Inactivo = 'INACTIVO'
}

export enum EstadoRecepcion {
  Borrador = 'Borrador',
  Cancelado = 'Cancelado',
  Confirmado = 'Confirmado'
}

export type FacturaEmitida = {
  __typename?: 'FacturaEmitida';
  data?: Maybe<Data>;
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Scalars['JSON']['output']>;
  response?: Maybe<FacturaEmitidaResponse>;
  result?: Maybe<Scalars['Boolean']['output']>;
};

export type FacturaEmitidaResponse = {
  __typename?: 'FacturaEmitidaResponse';
  Clave?: Maybe<Scalars['String']['output']>;
  Cliente?: Maybe<Scalars['Int']['output']>;
  CodigoRespuesta?: Maybe<Scalars['Int']['output']>;
  Fecha?: Maybe<Scalars['Date']['output']>;
  Id?: Maybe<Scalars['ID']['output']>;
  Mensaje?: Maybe<Scalars['String']['output']>;
  NumeroConsecutivo?: Maybe<Scalars['String']['output']>;
};

export type FacturasParametro = {
  __typename?: 'FacturasParametro';
  id?: Maybe<Scalars['ID']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type FormaPago = {
  __typename?: 'FormaPago';
  moneda?: Maybe<Scalars['String']['output']>;
  monto?: Maybe<Scalars['Number']['output']>;
  tipo?: Maybe<TipoMetodoPago>;
};

export type FormaPagoInput = {
  label?: InputMaybe<Scalars['String']['input']>;
  moneda?: InputMaybe<Scalars['String']['input']>;
  monto?: InputMaybe<Scalars['Number']['input']>;
  tipo?: InputMaybe<Scalars['ID']['input']>;
};

export type GenerarConsecutivoInput = {
  cedula?: InputMaybe<Scalars['String']['input']>;
  modulo?: InputMaybe<Scalars['String']['input']>;
};

export type GestionCaja = {
  __typename?: 'GestionCaja';
  administrador?: Maybe<UsuarioCaja>;
  caja?: Maybe<Scalars['ID']['output']>;
  consecutivo?: Maybe<Scalars['ID']['output']>;
  datos_cierre_sistema?: Maybe<Scalars['JSON']['output']>;
  datos_cierre_usuario?: Maybe<Scalars['JSON']['output']>;
  datos_inicio_usuario?: Maybe<Scalars['JSON']['output']>;
  fecha?: Maybe<Scalars['String']['output']>;
  hora_apertura?: Maybe<Scalars['String']['output']>;
  hora_cierre?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  observaciones?: Maybe<Scalars['String']['output']>;
  usuario?: Maybe<UsuarioCaja>;
};

export type GestionCajaCierreInput = {
  administrador?: InputMaybe<UsuarioCajaInput>;
  caja?: InputMaybe<Scalars['ID']['input']>;
  datos_cierre_sistema?: InputMaybe<Scalars['JSON']['input']>;
  observaciones?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<UsuarioCajaInput>;
};

export type GestionCajaConMovimientos = {
  __typename?: 'GestionCajaConMovimientos';
  gestion?: Maybe<GestionCaja>;
  movimientos?: Maybe<Array<Maybe<MovimientoCaja>>>;
};

export type GestionCajaInput = {
  administrador?: InputMaybe<UsuarioCajaInput>;
  caja?: InputMaybe<Scalars['ID']['input']>;
  cedula?: InputMaybe<Scalars['String']['input']>;
  datos_cierre_sistema?: InputMaybe<Scalars['JSON']['input']>;
  datos_cierre_usuario?: InputMaybe<Scalars['JSON']['input']>;
  datos_inicio_usuario?: InputMaybe<Scalars['JSON']['input']>;
  fecha?: InputMaybe<Scalars['String']['input']>;
  hora_apertura?: InputMaybe<Scalars['String']['input']>;
  hora_cierre?: InputMaybe<Scalars['String']['input']>;
  observaciones?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<UsuarioCajaInput>;
};

export type Habitaciones = {
  __typename?: 'Habitaciones';
  capacidad?: Maybe<Scalars['Number']['output']>;
  comodidades?: Maybe<Array<Maybe<Comodidades>>>;
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  numeroHabitacion?: Maybe<Scalars['String']['output']>;
  petFriendly?: Maybe<Scalars['Boolean']['output']>;
  petQuantity?: Maybe<Scalars['Number']['output']>;
  precioPorNoche?: Maybe<Scalars['Number']['output']>;
  tipoCama?: Maybe<Scalars['String']['output']>;
  tipoHabitacion?: Maybe<TipoHabitacion>;
};

export type HabitacionesInput = {
  capacidad?: InputMaybe<Scalars['Number']['input']>;
  comodidades?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  numeroHabitacion?: InputMaybe<Scalars['String']['input']>;
  petFriendly?: InputMaybe<Scalars['Boolean']['input']>;
  petQuantity?: InputMaybe<Scalars['Number']['input']>;
  precioPorNoche?: InputMaybe<Scalars['Number']['input']>;
  tipoCama?: InputMaybe<Scalars['String']['input']>;
  tipoHabitacion?: InputMaybe<Scalars['ID']['input']>;
};

export type HistorialConsecutivo = {
  __typename?: 'HistorialConsecutivo';
  consecutivo?: Maybe<Scalars['String']['output']>;
  fechaAsignacion?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  usuario?: Maybe<Usuario>;
};

export type Huesped = {
  __typename?: 'Huesped';
  identificacion?: Maybe<Scalars['String']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type HuespedInput = {
  identificacion?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type Impuesto = {
  __typename?: 'Impuesto';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  valor?: Maybe<Scalars['Number']['output']>;
};

export type ImpuestoInput = {
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  valor?: InputMaybe<Scalars['Number']['input']>;
};

export type Impuestos = {
  __typename?: 'Impuestos';
  Codigo?: Maybe<Scalars['Int']['output']>;
  CodigoTarifa?: Maybe<Scalars['String']['output']>;
  Exoneracion?: Maybe<Scalars['String']['output']>;
  FactorIVA?: Maybe<Scalars['Int']['output']>;
  MontoExportacion?: Maybe<Scalars['Int']['output']>;
  Tarifa?: Maybe<Scalars['Int']['output']>;
};

export type Items = {
  items?: InputMaybe<Array<InputMaybe<Item>>>;
};

export type ItemsInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
};

export type LineaImpuestos = {
  __typename?: 'LineaImpuestos';
  aplicaCompras?: Maybe<Scalars['Boolean']['output']>;
  aplicaVentas?: Maybe<Scalars['Boolean']['output']>;
  impuesto?: Maybe<Scalars['ID']['output']>;
};

export type LineaImpuestosInput = {
  aplicaCompras?: InputMaybe<Scalars['Boolean']['input']>;
  aplicaVentas?: InputMaybe<Scalars['Boolean']['input']>;
  impuesto?: InputMaybe<Scalars['ID']['input']>;
};

export type LineaOrdenCompra = {
  __typename?: 'LineaOrdenCompra';
  cantidad?: Maybe<Scalars['Number']['output']>;
  cantidadRecibida?: Maybe<Scalars['Number']['output']>;
  descuento?: Maybe<Scalars['Number']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  impuesto?: Maybe<Impuesto>;
  montoImpuestos?: Maybe<Scalars['Number']['output']>;
  porcentajeDescuento?: Maybe<Scalars['Number']['output']>;
  precioUnitario?: Maybe<Scalars['Number']['output']>;
  producto?: Maybe<MateriaPrima>;
  subtotalConImpuesto?: Maybe<Scalars['Number']['output']>;
  subtotalSinImpuesto?: Maybe<Scalars['Number']['output']>;
};

export type LineaOrdenCompraInput = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  cantidadRecibida?: InputMaybe<Scalars['Number']['input']>;
  descuento?: InputMaybe<Scalars['Number']['input']>;
  estado?: InputMaybe<Estado>;
  impuesto?: InputMaybe<Scalars['ID']['input']>;
  montoImpuestos?: InputMaybe<Scalars['Number']['input']>;
  porcentajeDescuento?: InputMaybe<Scalars['Number']['input']>;
  precioUnitario?: InputMaybe<Scalars['Number']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
  subtotalConImpuesto?: InputMaybe<Scalars['Number']['input']>;
  subtotalSinImpuesto?: InputMaybe<Scalars['Number']['input']>;
};

export type LineasDetalle = {
  __typename?: 'LineasDetalle';
  BaseImponible?: Maybe<Scalars['Float']['output']>;
  Cantidad?: Maybe<Scalars['Int']['output']>;
  Codigo?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  CodigoCabys?: Maybe<Scalars['Float']['output']>;
  CodigoTipo?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  DescripcionExtra?: Maybe<Scalars['String']['output']>;
  Descuento?: Maybe<Scalars['Float']['output']>;
  Descuentos?: Maybe<Scalars['String']['output']>;
  Detalle?: Maybe<Scalars['String']['output']>;
  DetalleDescuento?: Maybe<Scalars['String']['output']>;
  EsServicio?: Maybe<Scalars['Int']['output']>;
  Impuestos?: Maybe<Array<Maybe<Impuestos>>>;
  PartidaArancelaria?: Maybe<Scalars['String']['output']>;
  PrecioUnitario?: Maybe<Scalars['Float']['output']>;
  UnidadMedida?: Maybe<Scalars['Int']['output']>;
  UnidadMedidaComercial?: Maybe<Scalars['String']['output']>;
};

export type LineasEditarInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  linea?: InputMaybe<LineaOrdenCompraInput>;
};

export type LineasRecepcionPedido = {
  __typename?: 'LineasRecepcionPedido';
  almacen?: Maybe<Almacen>;
  cantidadRecibida?: Maybe<Scalars['Number']['output']>;
  cantidadSolicitada?: Maybe<Scalars['Number']['output']>;
  descuento?: Maybe<Scalars['Number']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  impuesto?: Maybe<Impuesto>;
  montoImpuestos?: Maybe<Scalars['Number']['output']>;
  porcentajeDescuento?: Maybe<Scalars['Number']['output']>;
  precioUnitario?: Maybe<Scalars['Number']['output']>;
  producto?: Maybe<MateriaPrima>;
  recepcion?: Maybe<RecepcionProductos>;
  subtotalConImpuesto?: Maybe<Scalars['Number']['output']>;
  subtotalSinImpuesto?: Maybe<Scalars['Number']['output']>;
};

export type LineasRecepcionPedidoInput = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  cantidadRecibida?: InputMaybe<Scalars['Number']['input']>;
  cantidadSolicitada?: InputMaybe<Scalars['Number']['input']>;
  descuento?: InputMaybe<Scalars['Number']['input']>;
  estado?: InputMaybe<Estado>;
  impuesto?: InputMaybe<Scalars['ID']['input']>;
  montoImpuestos?: InputMaybe<Scalars['Number']['input']>;
  porcentajeDescuento?: InputMaybe<Scalars['Number']['input']>;
  precioUnitario?: InputMaybe<Scalars['Number']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
  recepcion?: InputMaybe<Scalars['ID']['input']>;
  subtotalConImpuesto?: InputMaybe<Scalars['Number']['input']>;
  subtotalSinImpuesto?: InputMaybe<Scalars['Number']['input']>;
};

export type MateriaPrima = {
  __typename?: 'MateriaPrima';
  codigoBarras?: Maybe<Scalars['String']['output']>;
  codigoCabys?: Maybe<Scalars['String']['output']>;
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  existencias?: Maybe<Scalars['Number']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  impuestos?: Maybe<Array<Maybe<LineaImpuestos>>>;
  margen?: Maybe<Scalars['Number']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  pais?: Maybe<Scalars['String']['output']>;
  precioCompra?: Maybe<Scalars['Number']['output']>;
  precioCostoPromedio?: Maybe<Scalars['Number']['output']>;
  referenciaInterna?: Maybe<Scalars['String']['output']>;
  tipo?: Maybe<TipoMateriaPrima>;
  unidad?: Maybe<Unidad>;
};

export type MateriaPrimaConMovimientos = {
  __typename?: 'MateriaPrimaConMovimientos';
  codigoBarras?: Maybe<Scalars['String']['output']>;
  codigoCabys?: Maybe<Scalars['String']['output']>;
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  existencias?: Maybe<Scalars['Number']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  impuestos?: Maybe<Array<Maybe<LineaImpuestos>>>;
  margen?: Maybe<Scalars['Number']['output']>;
  movimientos?: Maybe<Array<Maybe<MovimientosType>>>;
  nombre?: Maybe<Scalars['String']['output']>;
  pais?: Maybe<Scalars['String']['output']>;
  precioCompra?: Maybe<Scalars['Number']['output']>;
  precioCostoPromedio?: Maybe<Scalars['Number']['output']>;
  referenciaInterna?: Maybe<Scalars['String']['output']>;
  tipo?: Maybe<TipoMateriaPrima>;
  unidad?: Maybe<Unidad>;
};

export type MateriaPrimaInput = {
  codigoBarras?: InputMaybe<Scalars['String']['input']>;
  codigoCabys?: InputMaybe<Scalars['String']['input']>;
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  existencias?: InputMaybe<Scalars['Number']['input']>;
  impuestos?: InputMaybe<Array<InputMaybe<LineaImpuestosInput>>>;
  margen?: InputMaybe<Scalars['Number']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  precioCompra?: InputMaybe<Scalars['Number']['input']>;
  precioCostoPromedio?: InputMaybe<Scalars['Number']['input']>;
  referenciaInterna?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<TipoMateriaPrima>;
  unidad?: InputMaybe<Unidad>;
};

export type MateriaPrimaMovimientos = {
  __typename?: 'MateriaPrimaMovimientos';
  materia_prima?: Maybe<MateriaPrima>;
  movimientos?: Maybe<Array<Maybe<MovimientosType>>>;
};

export type MateriaPrimaReporte = {
  __typename?: 'MateriaPrimaReporte';
  existencias?: Maybe<Scalars['Number']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  pais?: Maybe<Scalars['String']['output']>;
  unidad?: Maybe<Unidad>;
};

export type Menu = {
  __typename?: 'Menu';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  porcentajeGanancia?: Maybe<Scalars['Number']['output']>;
  precioCosto?: Maybe<Scalars['Number']['output']>;
  tipoMenu?: Maybe<Array<Maybe<TipoMenu>>>;
  tipoPlatillo?: Maybe<TipoPlatillo>;
};

export type MenuInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  porcentajeGanancia?: InputMaybe<Scalars['Number']['input']>;
  precioCosto?: InputMaybe<Scalars['Number']['input']>;
  tipoMenu?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  tipoPlatillo?: InputMaybe<Scalars['ID']['input']>;
};

export type MenuLinea = {
  __typename?: 'MenuLinea';
  cantidad?: Maybe<Scalars['Number']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  menu?: Maybe<Menu>;
  producto?: Maybe<MateriaPrima>;
};

export type MenuLineaInput = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  menu?: InputMaybe<Scalars['ID']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
};

export type MenuLineaInput2 = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
};

export type Mesa = {
  __typename?: 'Mesa';
  disponibilidad?: Maybe<Disponibilidad>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  numero?: Maybe<Scalars['Int']['output']>;
  piso?: Maybe<Piso>;
  temporizador?: Maybe<Scalars['Int']['output']>;
  tipo?: Maybe<ETipoMesa>;
  ubicacion?: Maybe<Ubicacion>;
};

export type MesaConComandas = {
  __typename?: 'MesaConComandas';
  comandas?: Maybe<Array<Maybe<ComandaConSubcuentas>>>;
  mesa?: Maybe<Mesa>;
};

export type MesaInput = {
  disponibilidad?: InputMaybe<Disponibilidad>;
  estado?: InputMaybe<Estado>;
  numero?: InputMaybe<Scalars['Int']['input']>;
  piso?: InputMaybe<Scalars['ID']['input']>;
  temporizador?: InputMaybe<Scalars['Int']['input']>;
  tipo?: InputMaybe<ETipoMesa>;
  ubicacion?: InputMaybe<UbicacionInput>;
};

export enum ModuloCaja {
  PuntoVenta = 'Punto_Venta',
  Recepcion = 'Recepcion',
  Restaurante = 'Restaurante',
  SinDefinir = 'Sin_definir'
}

export type ModuloConsecutivo = {
  __typename?: 'ModuloConsecutivo';
  abreviatura?: Maybe<Scalars['String']['output']>;
  actual?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  siguiente?: Maybe<Scalars['String']['output']>;
};

export type ModuloConsecutivoInput = {
  abreviatura?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type MovimientoCaja = {
  __typename?: 'MovimientoCaja';
  codigoMoneda?: Maybe<Scalars['String']['output']>;
  consecutivo?: Maybe<Scalars['ID']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  fecha?: Maybe<Scalars['String']['output']>;
  gestionCaja?: Maybe<Scalars['ID']['output']>;
  hora?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  medioPago?: Maybe<Scalars['String']['output']>;
  modulo?: Maybe<ModuloCaja>;
  monto?: Maybe<Scalars['Float']['output']>;
  observaciones?: Maybe<Scalars['String']['output']>;
  tipo?: Maybe<Scalars['String']['output']>;
};

export type MovimientoCajaInput = {
  cedula?: InputMaybe<Scalars['String']['input']>;
  codigoMoneda?: InputMaybe<Scalars['String']['input']>;
  gestionCaja: Scalars['ID']['input'];
  medioPago?: InputMaybe<Scalars['String']['input']>;
  modulo?: InputMaybe<ModuloCaja>;
  monto?: InputMaybe<Scalars['Float']['input']>;
  observaciones?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export type MovimientoRestaurante = {
  __typename?: 'MovimientoRestaurante';
  IVA?: Maybe<Scalars['Number']['output']>;
  _id?: Maybe<Scalars['ID']['output']>;
  accion?: Maybe<Scalars['String']['output']>;
  caja?: Maybe<Scalars['ID']['output']>;
  cedulaUsuario?: Maybe<Scalars['String']['output']>;
  cliente?: Maybe<Scalars['ID']['output']>;
  codigoMoneda?: Maybe<Scalars['String']['output']>;
  comanda: Comanda;
  comprobante?: Maybe<Scalars['String']['output']>;
  condicionVenta?: Maybe<Scalars['String']['output']>;
  deducciones?: Maybe<Array<Maybe<DeduccionInventario>>>;
  descuento?: Maybe<Scalars['Number']['output']>;
  esExcepcion?: Maybe<Scalars['Boolean']['output']>;
  fecha: Scalars['Date']['output'];
  impuestoServicio?: Maybe<Scalars['Number']['output']>;
  medioPago?: Maybe<Scalars['String']['output']>;
  mesero?: Maybe<Scalars['ID']['output']>;
  monto?: Maybe<Scalars['Number']['output']>;
  motivo?: Maybe<Scalars['String']['output']>;
  motivoExcepcion?: Maybe<Scalars['String']['output']>;
  nombreFacturacion: Scalars['String']['output'];
  numeroHabitacion?: Maybe<Scalars['String']['output']>;
  platillo?: Maybe<Scalars['String']['output']>;
  platillos?: Maybe<Array<Maybe<Platillos>>>;
  reserva?: Maybe<Scalars['ID']['output']>;
  subtotal?: Maybe<Scalars['Number']['output']>;
  tipoCambio?: Maybe<Scalars['Number']['output']>;
  total?: Maybe<Scalars['Number']['output']>;
  usuario?: Maybe<Scalars['ID']['output']>;
  usuarioAnulo?: Maybe<Scalars['String']['output']>;
};

export type MovimientoRestauranteInput = {
  IVA?: InputMaybe<Scalars['Number']['input']>;
  accion?: InputMaybe<Scalars['String']['input']>;
  caja?: InputMaybe<Scalars['ID']['input']>;
  cedulaUsuario?: InputMaybe<Scalars['String']['input']>;
  cliente?: InputMaybe<Scalars['ID']['input']>;
  codigoMoneda?: InputMaybe<Scalars['String']['input']>;
  comanda: Scalars['ID']['input'];
  comprobante?: InputMaybe<Scalars['String']['input']>;
  condicionVenta?: InputMaybe<Scalars['String']['input']>;
  descuento?: InputMaybe<Scalars['Number']['input']>;
  esExcepcion?: InputMaybe<Scalars['Boolean']['input']>;
  fecha: Scalars['Date']['input'];
  impuestoServicio?: InputMaybe<Scalars['Number']['input']>;
  medioPago?: InputMaybe<Scalars['String']['input']>;
  mesero?: InputMaybe<Scalars['ID']['input']>;
  monto?: InputMaybe<Scalars['Number']['input']>;
  motivo?: InputMaybe<Scalars['String']['input']>;
  motivoExcepcion?: InputMaybe<Scalars['String']['input']>;
  nombreFacturacion: Scalars['String']['input'];
  numeroHabitacion?: InputMaybe<Scalars['String']['input']>;
  platillo?: InputMaybe<Scalars['String']['input']>;
  platillos?: InputMaybe<Array<InputMaybe<PlatillosInput>>>;
  reserva?: InputMaybe<Scalars['ID']['input']>;
  subtotal?: InputMaybe<Scalars['Number']['input']>;
  tipoCambio?: InputMaybe<Scalars['Number']['input']>;
  total?: InputMaybe<Scalars['Number']['input']>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
  usuarioAnulo?: InputMaybe<Scalars['String']['input']>;
};

export type MovimientosActivoInput = {
  activos?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  beneficiario?: InputMaybe<Scalars['String']['input']>;
  cedula?: InputMaybe<Scalars['String']['input']>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  tipo?: InputMaybe<Tipo>;
};

export type MovimientosActivoType = {
  __typename?: 'MovimientosActivoType';
  activos?: Maybe<Array<Maybe<Activo>>>;
  beneficiario?: Maybe<Scalars['String']['output']>;
  consecutivo?: Maybe<HistorialConsecutivo>;
  fecha?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  tipo?: Maybe<Tipo>;
};

export type MovimientosInput = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  cedido?: InputMaybe<Scalars['Boolean']['input']>;
  cliente?: InputMaybe<Scalars['ID']['input']>;
  existencia?: InputMaybe<Scalars['Number']['input']>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  lote?: InputMaybe<Scalars['String']['input']>;
  materia_prima?: InputMaybe<Scalars['ID']['input']>;
  moneda?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  precio_unidad?: InputMaybe<Scalars['Number']['input']>;
  proveedor?: InputMaybe<Scalars['ID']['input']>;
  tipo?: InputMaybe<Tipo>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type MovimientosType = {
  __typename?: 'MovimientosType';
  almacen?: Maybe<Almacen>;
  cantidad?: Maybe<Scalars['Number']['output']>;
  cedido?: Maybe<Scalars['Boolean']['output']>;
  cliente?: Maybe<Cliente>;
  existencia?: Maybe<Scalars['Number']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lote?: Maybe<Scalars['String']['output']>;
  materia_prima?: Maybe<MateriaPrima>;
  moneda?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  precio_unidad?: Maybe<Scalars['Number']['output']>;
  proveedor?: Maybe<Proveedor>;
  tipo?: Maybe<Tipo>;
  usuario?: Maybe<Usuario>;
};

export type Mutation = {
  __typename?: 'Mutation';
  abrirCaja?: Maybe<RespuestaCaja>;
  actualizarActividadEconomica?: Maybe<RespuestaActividadEconomica>;
  actualizarActivo?: Maybe<RespuestaActivos>;
  actualizarAlmacen?: Maybe<RespuestaAlmacen>;
  actualizarArea?: Maybe<RespuestaAreas>;
  actualizarCaja?: Maybe<RespuestaCaja>;
  actualizarCantidadRecibidaLineaRecepcion?: Maybe<RespuestaLineasRecepcionPedido>;
  actualizarCliente?: Maybe<RespuestaCliente>;
  actualizarComanda?: Maybe<RespuestaComanda>;
  actualizarComodidad?: Maybe<RespuestaComodidades>;
  actualizarEntregados?: Maybe<RespuestaSubcuenta>;
  actualizarEstadoOrdenCompra?: Maybe<RespuestaOrdenCompra>;
  actualizarEstadoRecepcion?: Maybe<RespuestaRecepcionProductos>;
  actualizarExistenciasMateriaPrima?: Maybe<RespuestaMateriaPrima>;
  actualizarHabitacion?: Maybe<RespuestaHabitaciones>;
  actualizarImpuesto?: Maybe<RespuestaImpuesto>;
  actualizarItem?: Maybe<RespuestaItems>;
  actualizarLineaAlmacen?: Maybe<RespuestaAlmacenLinea>;
  actualizarLineaMenu?: Maybe<RespuestaMenuLinea>;
  actualizarLineaOrdenCompra?: Maybe<RespuestaLineaOrdenCompra>;
  actualizarLineaTransferenciaInterna?: Maybe<RespuestaTransferenciaInternaLinea>;
  actualizarLineasRecepcionPedido?: Maybe<RespuestaLineasRecepcionPedido>;
  actualizarMateriaPrima?: Maybe<RespuestaMateriaPrima>;
  actualizarMenu?: Maybe<RespuestaMenu>;
  actualizarMesa?: Maybe<RespuestaMesa>;
  actualizarModuloConsecutivo?: Maybe<RespuestaModuloConsecutivo>;
  actualizarNota?: Maybe<RespuestaNotas>;
  actualizarObservacionesPlatillo?: Maybe<RespuestaSubcuenta>;
  actualizarOrdenCompra?: Maybe<RespuestaOrdenCompra>;
  actualizarPagados?: Maybe<RespuestaSubcuenta>;
  actualizarPaquete?: Maybe<RespuestaPaquete>;
  actualizarPermiso?: Maybe<Permiso>;
  actualizarPiso?: Maybe<RespuestaPiso>;
  actualizarProveedor?: Maybe<RespuestaProveedor>;
  actualizarPuestoLimpieza?: Maybe<RespuestaPuestoLimpieza>;
  actualizarRecepcionPedido?: Maybe<RespuestaRecepcionProductos>;
  actualizarRegistroContable?: Maybe<RespuestaRegistroContable>;
  actualizarReserva?: Maybe<RespuestaReserva>;
  actualizarReservaHabitacion?: Maybe<RespuestaReservaHabitacion>;
  actualizarReservaInfo?: Maybe<RespuestaReserva>;
  actualizarRol?: Maybe<RespuestaRol>;
  actualizarServicio?: Maybe<RespuestaServicios>;
  actualizarServicioExterno?: Maybe<RespuestaServicios>;
  actualizarServiciosExtras?: Maybe<RespuestaReservaHabitacion>;
  actualizarServiciosGrupales?: Maybe<RespuestaReserva>;
  actualizarSubcuenta?: Maybe<RespuestaSubcuenta>;
  actualizarTemporada?: Maybe<RespuestaTemporada>;
  actualizarTipoHabitacion?: Maybe<RespuestaTipoHabitacion>;
  actualizarTipoMenu?: Maybe<RespuestaTipoMenu>;
  actualizarTipoMetodoPago?: Maybe<RespuestaTipoMetodoPago>;
  actualizarTipoPlatillo?: Maybe<RespuestaTipoPlatillo>;
  actualizarTipoProveduria?: Maybe<RespuestaTipoProveduria>;
  actualizarTipoServicio?: Maybe<RespuestaTipoServicio>;
  actualizarTour?: Maybe<RespuestaTour>;
  actualizarTransferenciaInterna?: Maybe<RespuestaTransferenciaInterna>;
  actualizarUbicacion?: Maybe<RespuestaUbicacion>;
  actualizarUsuario?: Maybe<RespuestaUsuario>;
  anularComanda?: Maybe<RespuestaAnulacionComanda>;
  aperturaCaja?: Maybe<RespuestaGestionCaja>;
  aprobarAnulacion?: Maybe<RespuestaAnulacionComanda>;
  aprobarChequeo?: Maybe<RespuestaChequeo>;
  autenticarUsuario?: Maybe<RespuestaAutenticar>;
  cambiarClave?: Maybe<Confirmacion>;
  cambiarEstadoComanda?: Maybe<CambiarEstadoComandaRespuesta>;
  cambiarEstadoPlatillos?: Maybe<CambiarEstadoComandaRespuesta>;
  cerrarCaja?: Maybe<RespuestaCaja>;
  checkIn?: Maybe<RespuestaReserva>;
  checkInInHouse?: Maybe<RespuestaReserva>;
  checkOut?: Maybe<RespuestaReserva>;
  cierreCaja?: Maybe<RespuestaGestionCaja>;
  cierreParcial?: Maybe<RespuestaCaja>;
  cierreParcialCaja?: Maybe<RespuestaGestionCaja>;
  comprobarUsuario?: Maybe<RespuestaComprobar>;
  desactivarActivo?: Maybe<RespuestaActivos>;
  desactivarAlmacen?: Maybe<RespuestaAlmacen>;
  desactivarArea?: Maybe<RespuestaAreas>;
  desactivarCliente?: Maybe<RespuestaCliente>;
  desactivarComanda?: Maybe<RespuestaComanda>;
  desactivarComodidad?: Maybe<RespuestaComodidades>;
  desactivarHabitacion?: Maybe<RespuestaHabitaciones>;
  desactivarImpuesto?: Maybe<RespuestaImpuesto>;
  desactivarItem?: Maybe<RespuestaItems>;
  desactivarLineaMenu?: Maybe<RespuestaMenuLinea>;
  desactivarLineaOrdenCompra?: Maybe<RespuestaLineaOrdenCompra>;
  desactivarLineasRecepcionPedido?: Maybe<RespuestaLineasRecepcionPedido>;
  desactivarMateriaPrima?: Maybe<RespuestaMateriaPrima>;
  desactivarMenu?: Maybe<RespuestaMenu>;
  desactivarMesa?: Maybe<RespuestaMesa>;
  desactivarNota?: Maybe<RespuestaNotas>;
  desactivarOrdenCompra?: Maybe<RespuestaOrdenCompra>;
  desactivarPaquete?: Maybe<RespuestaPaquete>;
  desactivarPermiso?: Maybe<Scalars['String']['output']>;
  desactivarPiso?: Maybe<RespuestaPiso>;
  desactivarPlatillo?: Maybe<RespuestaSubcuenta>;
  desactivarProveedor?: Maybe<RespuestaProveedor>;
  desactivarPuestoLimpieza?: Maybe<RespuestaPuestoLimpieza>;
  desactivarRecepcion?: Maybe<RespuestaRecepcionProductos>;
  desactivarRegistroContable?: Maybe<RespuestaRegistroContable>;
  desactivarReserva?: Maybe<RespuestaReserva>;
  desactivarReservaHabitacion?: Maybe<RespuestaReservaHabitacion>;
  desactivarRol?: Maybe<RespuestaRol>;
  desactivarServicio?: Maybe<RespuestaServicios>;
  desactivarServicioExterno?: Maybe<RespuestaServicios>;
  desactivarSubcuenta?: Maybe<RespuestaSubcuenta>;
  desactivarTipoHabitacion?: Maybe<RespuestaTipoHabitacion>;
  desactivarTipoMenu?: Maybe<RespuestaTipoMenu>;
  desactivarTipoMetodoPago?: Maybe<RespuestaTipoMetodoPago>;
  desactivarTipoPlatillo?: Maybe<RespuestaTipoPlatillo>;
  desactivarTipoProveduria?: Maybe<RespuestaTipoProveduria>;
  desactivarTipoServicio?: Maybe<RespuestaTipoServicio>;
  desactivarTour?: Maybe<RespuestaTour>;
  desactivarUbicacion?: Maybe<RespuestaUbicacion>;
  desactivarUsuario?: Maybe<RespuestaUsuario>;
  descontarStock?: Maybe<RespuestaOperacionStock>;
  eliminarActividadEconomica?: Maybe<RespuestaActividadEconomica>;
  enviarCodigoVerificacion?: Maybe<RespuestaVerificacion>;
  finalizarComanda?: Maybe<RespuestaComanda>;
  generarConsecutivo?: Maybe<RespuestaGenerarConsecutivo>;
  insertarActividadEconomica?: Maybe<RespuestaActividadEconomica>;
  insertarActivo?: Maybe<RespuestaActivos>;
  insertarAlmacen?: Maybe<RespuestaAlmacen>;
  insertarArea?: Maybe<RespuestaAreas>;
  insertarCaja?: Maybe<RespuestaCaja>;
  insertarChequeo?: Maybe<RespuestaChequeo>;
  insertarCliente?: Maybe<RespuestaCliente>;
  insertarComanda?: Maybe<RespuestaComanda>;
  insertarComodidad?: Maybe<RespuestaComodidades>;
  insertarHabitacion?: Maybe<RespuestaHabitaciones>;
  insertarImpuesto?: Maybe<RespuestaImpuesto>;
  insertarItem?: Maybe<RespuestaItems>;
  insertarLineaAlmacen?: Maybe<RespuestaAlmacenLinea>;
  insertarLineaMenu?: Maybe<RespuestaMenuLinea>;
  insertarLineaOrdenCompra?: Maybe<RespuestaLineaOrdenCompra>;
  insertarLineaTransferenciaInterna?: Maybe<RespuestaTransferenciaInternaLinea>;
  insertarLineasRecepcionPedido?: Maybe<RespuestaLineasRecepcionPedido>;
  insertarMateriaPrima?: Maybe<RespuestaMateriaPrima>;
  insertarMenu?: Maybe<RespuestaMenu>;
  insertarMesa?: Maybe<RespuestaMesa>;
  insertarModuloConsecutivo?: Maybe<RespuestaModuloConsecutivo>;
  insertarMovimiento?: Maybe<RespuestaMovimientos>;
  insertarMovimientoRestaurante?: Maybe<RespuestaMovimientoRestaurante>;
  insertarMovimientosActivo?: Maybe<RespuestaMovimientosActivo>;
  insertarNota?: Maybe<RespuestaNotas>;
  insertarOrdenCompra?: Maybe<RespuestaOrdenCompra>;
  insertarPaquete?: Maybe<RespuestaPaquete>;
  insertarPermiso?: Maybe<Permiso>;
  insertarPiso?: Maybe<RespuestaPiso>;
  insertarProveedor?: Maybe<RespuestaProveedor>;
  insertarPuestoLimpieza?: Maybe<RespuestaPuestoLimpieza>;
  insertarRecepcionPedido?: Maybe<RespuestaRecepcionProductos>;
  insertarRegistroContable?: Maybe<RespuestaRegistroContable>;
  insertarReserva?: Maybe<RespuestaReserva>;
  insertarReservaHabitacion?: Maybe<RespuestaReservaHabitacion>;
  insertarReservaServicioExterno?: Maybe<RespuestaReservaServicioExterno>;
  insertarRol?: Maybe<RespuestaRol>;
  insertarSalida?: Maybe<RespuestaMovimientos>;
  insertarServicio?: Maybe<RespuestaServicios>;
  insertarServicioExterno?: Maybe<RespuestaServicios>;
  insertarSubcuenta?: Maybe<RespuestaSubcuenta>;
  insertarTemporada?: Maybe<RespuestaTemporada>;
  insertarTipoHabitacion?: Maybe<RespuestaTipoHabitacion>;
  insertarTipoMenu?: Maybe<RespuestaTipoMenu>;
  insertarTipoMetodoPago?: Maybe<RespuestaTipoMetodoPago>;
  insertarTipoPlatillo?: Maybe<RespuestaTipoPlatillo>;
  insertarTipoProveduria?: Maybe<RespuestaTipoProveduria>;
  insertarTipoServicio?: Maybe<RespuestaTipoServicio>;
  insertarTour?: Maybe<RespuestaTour>;
  insertarTransferenciaInterna?: Maybe<RespuestaTransferenciaInterna>;
  insertarUbicacion?: Maybe<RespuestaUbicacion>;
  insertarUsuario?: Maybe<RespuestaUsuario>;
  obtenerChequeo?: Maybe<RespuestaBuscar>;
  rechazarAnulacion?: Maybe<RespuestaAnulacionComanda>;
  recuperarClave?: Maybe<Confirmacion>;
  registrarMovimiento?: Maybe<RespuestaMovimientoCaja>;
  updateState?: Maybe<RespuestaReserva>;
  upsertFacturasParametro?: Maybe<FacturasParametro>;
  verificarExistencias?: Maybe<RespuestaVerificar>;
};

export type MutationAbrirCajaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationActualizarActividadEconomicaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ActividadEconomicaInput>;
};

export type MutationActualizarActivoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ActivoInput>;
};

export type MutationActualizarAlmacenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<AlmacenInput>;
};

export type MutationActualizarAreaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<AreasInput>;
};

export type MutationActualizarCajaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<CajaInput>;
};

export type MutationActualizarCantidadRecibidaLineaRecepcionArgs = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationActualizarClienteArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ClienteInput>;
};

export type MutationActualizarComandaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ComandaInput>;
};

export type MutationActualizarComodidadArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ComodidadesInput>;
};

export type MutationActualizarEntregadosArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ActualizarEntregadosInput>;
};

export type MutationActualizarEstadoOrdenCompraArgs = {
  estado?: InputMaybe<EstadoPedido>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationActualizarEstadoRecepcionArgs = {
  estado?: InputMaybe<EstadoRecepcion>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationActualizarExistenciasMateriaPrimaArgs = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationActualizarHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<HabitacionesInput>;
};

export type MutationActualizarImpuestoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ImpuestoInput>;
};

export type MutationActualizarItemArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ItemsInput>;
};

export type MutationActualizarLineaAlmacenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<AlmacenLineaInput>;
};

export type MutationActualizarLineaMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MenuLineaInput>;
};

export type MutationActualizarLineaOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<LineaOrdenCompraInput>;
};

export type MutationActualizarLineaTransferenciaInternaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TransferenciaInternaLineaInput>;
};

export type MutationActualizarLineasRecepcionPedidoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<LineasRecepcionPedidoInput>;
};

export type MutationActualizarMateriaPrimaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MateriaPrimaInput>;
};

export type MutationActualizarMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MenuInput>;
};

export type MutationActualizarMesaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MesaInput>;
};

export type MutationActualizarModuloConsecutivoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ModuloConsecutivoInput>;
};

export type MutationActualizarNotaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<NotasInput>;
};

export type MutationActualizarObservacionesPlatilloArgs = {
  observaciones?: InputMaybe<Scalars['String']['input']>;
  platilloId?: InputMaybe<Scalars['ID']['input']>;
  subcuentaId?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationActualizarOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<OrdenCompraInput>;
  inputLineasEditar?: InputMaybe<Array<InputMaybe<LineasEditarInput>>>;
};

export type MutationActualizarPagadosArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<Array<InputMaybe<PlatillosInput>>>;
};

export type MutationActualizarPaqueteArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PaqueteInput>;
};

export type MutationActualizarPermisoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PermisoInput>;
};

export type MutationActualizarPisoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PisoInput>;
};

export type MutationActualizarProveedorArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ProveedorInput>;
};

export type MutationActualizarPuestoLimpiezaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PuestoLimpiezaInput>;
};

export type MutationActualizarRecepcionPedidoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<OrdenCompraInput>;
};

export type MutationActualizarRegistroContableArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<RegistroContableInput>;
};

export type MutationActualizarReservaArgs = {
  bookingRoom?: InputMaybe<ReservaHabitacionInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ReservaInput>;
};

export type MutationActualizarReservaHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ReservaHabitacionInput>;
};

export type MutationActualizarReservaInfoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ReservaInput>;
};

export type MutationActualizarRolArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<RolInput>;
};

export type MutationActualizarServicioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ServiciosInput>;
};

export type MutationActualizarServicioExternoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ServiciosInput>;
};

export type MutationActualizarServiciosExtrasArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  serviciosExtras?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
};

export type MutationActualizarServiciosGrupalesArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  serviciosGrupales?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
};

export type MutationActualizarSubcuentaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<SubcuentaInput>;
};

export type MutationActualizarTemporadaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TemporadaInput>;
};

export type MutationActualizarTipoHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoHabitacionInput>;
};

export type MutationActualizarTipoMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoMenuInput>;
};

export type MutationActualizarTipoMetodoPagoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoMetodoPagoInput>;
};

export type MutationActualizarTipoPlatilloArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoPlatilloInput>;
};

export type MutationActualizarTipoProveduriaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoProveduriaInput>;
};

export type MutationActualizarTipoServicioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoServicioInput>;
};

export type MutationActualizarTourArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TourInput>;
};

export type MutationActualizarTransferenciaInternaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TransferenciaInternaInput>;
};

export type MutationActualizarUbicacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<UbicacionInput>;
};

export type MutationActualizarUsuarioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<UsuarioInput>;
};

export type MutationAnularComandaArgs = {
  input?: InputMaybe<AnulacionComandaInput>;
};

export type MutationAperturaCajaArgs = {
  input?: InputMaybe<GestionCajaInput>;
};

export type MutationAprobarAnulacionArgs = {
  input: AprobarAnulacionInput;
};

export type MutationAprobarChequeoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationAutenticarUsuarioArgs = {
  cedula: Scalars['String']['input'];
  clave: Scalars['String']['input'];
};

export type MutationCambiarClaveArgs = {
  actual?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  nueva?: InputMaybe<Scalars['String']['input']>;
};

export type MutationCambiarEstadoComandaArgs = {
  estado: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type MutationCambiarEstadoPlatillosArgs = {
  estado?: InputMaybe<Scalars['String']['input']>;
  platilloIds: Array<Scalars['ID']['input']>;
  subcuentaId: Scalars['ID']['input'];
};

export type MutationCerrarCajaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationCheckInArgs = {
  huespedes: Array<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  items: Array<Scalars['JSON']['input']>;
  reserva?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationCheckInInHouseArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  reserva?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationCheckOutArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  reserva?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationCierreCajaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<GestionCajaCierreInput>;
};

export type MutationCierreParcialArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationCierreParcialCajaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<GestionCajaInput>;
};

export type MutationComprobarUsuarioArgs = {
  cedula: Scalars['String']['input'];
  clave: Scalars['String']['input'];
};

export type MutationDesactivarActivoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarAlmacenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarAreaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarClienteArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarComandaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarComodidadArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarImpuestoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarItemArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarLineaMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarLineaOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  idOrden?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarLineasRecepcionPedidoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarMateriaPrimaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarMesaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarNotaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarPaqueteArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarPermisoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarPisoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarPlatilloArgs = {
  platilloId?: InputMaybe<Scalars['ID']['input']>;
  subcuentaId?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarProveedorArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarPuestoLimpiezaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarRecepcionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarRegistroContableArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarReservaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarReservaHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarRolArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarServicioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarServicioExternoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarSubcuentaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTipoHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTipoMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTipoMetodoPagoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTipoPlatilloArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTipoProveduriaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTipoServicioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarTourArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarUbicacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDesactivarUsuarioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationDescontarStockArgs = {
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationEliminarActividadEconomicaArgs = {
  id: Scalars['ID']['input'];
};

export type MutationEnviarCodigoVerificacionArgs = {
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
};

export type MutationFinalizarComandaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationGenerarConsecutivoArgs = {
  input?: InputMaybe<GenerarConsecutivoInput>;
};

export type MutationInsertarActividadEconomicaArgs = {
  input?: InputMaybe<ActividadEconomicaInput>;
};

export type MutationInsertarActivoArgs = {
  input?: InputMaybe<ActivoInput>;
};

export type MutationInsertarAlmacenArgs = {
  input?: InputMaybe<AlmacenInput>;
};

export type MutationInsertarAreaArgs = {
  input?: InputMaybe<AreasInput>;
};

export type MutationInsertarCajaArgs = {
  input?: InputMaybe<CajaInput>;
};

export type MutationInsertarChequeoArgs = {
  input?: InputMaybe<ChequeoInput>;
};

export type MutationInsertarClienteArgs = {
  input?: InputMaybe<ClienteInput>;
};

export type MutationInsertarComandaArgs = {
  input?: InputMaybe<ComandaInput>;
};

export type MutationInsertarComodidadArgs = {
  input?: InputMaybe<ComodidadesInput>;
};

export type MutationInsertarHabitacionArgs = {
  input?: InputMaybe<HabitacionesInput>;
};

export type MutationInsertarImpuestoArgs = {
  input?: InputMaybe<ImpuestoInput>;
};

export type MutationInsertarItemArgs = {
  input?: InputMaybe<ItemsInput>;
};

export type MutationInsertarLineaAlmacenArgs = {
  input?: InputMaybe<AlmacenLineaInput>;
};

export type MutationInsertarLineaMenuArgs = {
  input?: InputMaybe<MenuLineaInput>;
};

export type MutationInsertarLineaOrdenCompraArgs = {
  input?: InputMaybe<LineaOrdenCompraInput>;
};

export type MutationInsertarLineaTransferenciaInternaArgs = {
  input?: InputMaybe<TransferenciaInternaLineaInput>;
};

export type MutationInsertarLineasRecepcionPedidoArgs = {
  input?: InputMaybe<LineasRecepcionPedidoInput>;
};

export type MutationInsertarMateriaPrimaArgs = {
  input?: InputMaybe<MateriaPrimaInput>;
};

export type MutationInsertarMenuArgs = {
  input?: InputMaybe<MenuInput>;
  lineasInput?: InputMaybe<Array<InputMaybe<MenuLineaInput2>>>;
};

export type MutationInsertarMesaArgs = {
  input?: InputMaybe<MesaInput>;
};

export type MutationInsertarModuloConsecutivoArgs = {
  input?: InputMaybe<ModuloConsecutivoInput>;
};

export type MutationInsertarMovimientoArgs = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MovimientosInput>;
};

export type MutationInsertarMovimientoRestauranteArgs = {
  input?: InputMaybe<MovimientoRestauranteInput>;
};

export type MutationInsertarMovimientosActivoArgs = {
  input?: InputMaybe<MovimientosActivoInput>;
};

export type MutationInsertarNotaArgs = {
  input?: InputMaybe<NotasInput>;
};

export type MutationInsertarOrdenCompraArgs = {
  input?: InputMaybe<OrdenCompraInput>;
  inputLineas?: InputMaybe<Array<InputMaybe<LineaOrdenCompraInput>>>;
};

export type MutationInsertarPaqueteArgs = {
  input?: InputMaybe<PaqueteInput>;
};

export type MutationInsertarPermisoArgs = {
  input?: InputMaybe<PermisoInput>;
};

export type MutationInsertarPisoArgs = {
  input?: InputMaybe<PisoInput>;
};

export type MutationInsertarProveedorArgs = {
  input?: InputMaybe<ProveedorInput>;
};

export type MutationInsertarPuestoLimpiezaArgs = {
  input?: InputMaybe<PuestoLimpiezaInput>;
};

export type MutationInsertarRecepcionPedidoArgs = {
  input?: InputMaybe<RecepcionProductosInput>;
};

export type MutationInsertarRegistroContableArgs = {
  input?: InputMaybe<RegistroContableInput>;
};

export type MutationInsertarReservaArgs = {
  bookingRoom?: InputMaybe<ReservaHabitacionInput>;
  input?: InputMaybe<ReservaInput>;
};

export type MutationInsertarReservaHabitacionArgs = {
  input?: InputMaybe<ReservaHabitacionInput>;
};

export type MutationInsertarReservaServicioExternoArgs = {
  input?: InputMaybe<ReservaServicioExternoInput>;
};

export type MutationInsertarRolArgs = {
  input?: InputMaybe<RolInput>;
};

export type MutationInsertarSalidaArgs = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<Salida_Inventario>;
};

export type MutationInsertarServicioArgs = {
  input?: InputMaybe<ServiciosInput>;
};

export type MutationInsertarServicioExternoArgs = {
  input?: InputMaybe<ServiciosInput>;
};

export type MutationInsertarSubcuentaArgs = {
  input?: InputMaybe<SubcuentaInput>;
};

export type MutationInsertarTemporadaArgs = {
  input?: InputMaybe<TemporadaInput>;
};

export type MutationInsertarTipoHabitacionArgs = {
  input?: InputMaybe<TipoHabitacionInput>;
};

export type MutationInsertarTipoMenuArgs = {
  input?: InputMaybe<TipoMenuInput>;
};

export type MutationInsertarTipoMetodoPagoArgs = {
  input?: InputMaybe<TipoMetodoPagoInput>;
};

export type MutationInsertarTipoPlatilloArgs = {
  input?: InputMaybe<TipoPlatilloInput>;
};

export type MutationInsertarTipoProveduriaArgs = {
  input?: InputMaybe<TipoProveduriaInput>;
};

export type MutationInsertarTipoServicioArgs = {
  input?: InputMaybe<TipoServicioInput>;
};

export type MutationInsertarTourArgs = {
  input?: InputMaybe<TourInput>;
};

export type MutationInsertarTransferenciaInternaArgs = {
  input?: InputMaybe<TransferenciaInternaInput>;
  lineas?: InputMaybe<Array<InputMaybe<TransferenciaInternaLineaInput2>>>;
};

export type MutationInsertarUbicacionArgs = {
  input?: InputMaybe<UbicacionInput>;
};

export type MutationInsertarUsuarioArgs = {
  input?: InputMaybe<UsuarioInput>;
};

export type MutationObtenerChequeoArgs = {
  fecha?: InputMaybe<Scalars['Date']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationRechazarAnulacionArgs = {
  input: RechazarAnulacionInput;
};

export type MutationRecuperarClaveArgs = {
  codigo?: InputMaybe<Scalars['String']['input']>;
  nueva?: InputMaybe<Scalars['String']['input']>;
};

export type MutationRegistrarMovimientoArgs = {
  gestionCaja?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MovimientoCajaInput>;
};

export type MutationUpdateStateArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MutationUpsertFacturasParametroArgs = {
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type MutationVerificarExistenciasArgs = {
  input?: InputMaybe<Items>;
};

export type Notas = {
  __typename?: 'Notas';
  area?: Maybe<Areas>;
  estado?: Maybe<Scalars['String']['output']>;
  fecha?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nota?: Maybe<Scalars['String']['output']>;
};

export type NotasInput = {
  area?: InputMaybe<Scalars['ID']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  fecha?: InputMaybe<Scalars['String']['input']>;
  nota?: InputMaybe<Scalars['String']['input']>;
};

export type NumeroPersonas = {
  __typename?: 'NumeroPersonas';
  adulto?: Maybe<Scalars['Number']['output']>;
  ninos?: Maybe<Scalars['Number']['output']>;
};

export type NumeroPersonasInput = {
  adulto?: InputMaybe<Scalars['Number']['input']>;
  ninos?: InputMaybe<Scalars['Number']['input']>;
};

export type OrdenCompra = {
  __typename?: 'OrdenCompra';
  consecutivo?: Maybe<HistorialConsecutivo>;
  estado?: Maybe<Estado>;
  estadoPedido?: Maybe<EstadoPedido>;
  fechaPedido?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  impuestosMonto?: Maybe<Scalars['Number']['output']>;
  lineasPedido?: Maybe<Array<Maybe<LineaOrdenCompra>>>;
  numeroComprobante?: Maybe<Scalars['String']['output']>;
  proveedor?: Maybe<Proveedor>;
  subtotal?: Maybe<Scalars['Number']['output']>;
  total?: Maybe<Scalars['Number']['output']>;
};

export type OrdenCompraInput = {
  cedula?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  estadoPedido?: InputMaybe<EstadoPedido>;
  fechaPedido?: InputMaybe<Scalars['Date']['input']>;
  impuestosMonto?: InputMaybe<Scalars['Number']['input']>;
  numeroComprobante?: InputMaybe<Scalars['String']['input']>;
  proveedor?: InputMaybe<Scalars['ID']['input']>;
  subtotal?: InputMaybe<Scalars['Number']['input']>;
  total?: InputMaybe<Scalars['Number']['input']>;
};

export type Paquete = {
  __typename?: 'Paquete';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  servicios?: Maybe<Scalars['JSON']['output']>;
  temporadas?: Maybe<Temporada>;
  tipo?: Maybe<Scalars['String']['output']>;
  tours?: Maybe<Scalars['JSON']['output']>;
};

export type PaqueteInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  servicios?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  temporadas?: InputMaybe<Scalars['ID']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  tours?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
};

export type Permiso = {
  __typename?: 'Permiso';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type PermisoInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
};

export type Permisos = {
  __typename?: 'Permisos';
  agregar?: Maybe<Scalars['Boolean']['output']>;
  editar?: Maybe<Scalars['Boolean']['output']>;
  eliminar?: Maybe<Scalars['Boolean']['output']>;
  modulo?: Maybe<Scalars['String']['output']>;
  ver?: Maybe<Scalars['Boolean']['output']>;
};

export type PermisosInput = {
  agregar?: InputMaybe<Scalars['Boolean']['input']>;
  editar?: InputMaybe<Scalars['Boolean']['input']>;
  eliminar?: InputMaybe<Scalars['Boolean']['input']>;
  modulo?: InputMaybe<Scalars['String']['input']>;
  ver?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Piso = {
  __typename?: 'Piso';
  estado?: Maybe<EstadoPiso>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type PisoInput = {
  estado?: InputMaybe<EstadoPiso>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export enum PlatilloEstado {
  Cancelado = 'Cancelado',
  EnPreparacion = 'EnPreparacion',
  Entregado = 'Entregado',
  Pagado = 'Pagado',
  Pendiente = 'Pendiente'
}

export type Platillos = {
  __typename?: 'Platillos';
  _id?: Maybe<Scalars['ID']['output']>;
  anulacionPendiente?: Maybe<Scalars['Boolean']['output']>;
  descuento?: Maybe<Scalars['Number']['output']>;
  esParaCocina?: Maybe<Scalars['Boolean']['output']>;
  estado?: Maybe<PlatilloEstado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  observaciones?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  puesto?: Maybe<Scalars['String']['output']>;
};

export type PlatillosInput = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  descuento?: InputMaybe<Scalars['Number']['input']>;
  esParaCocina?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<PlatilloEstado>;
  id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  observaciones?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  puesto?: InputMaybe<Scalars['String']['input']>;
};

export type Proveedor = {
  __typename?: 'Proveedor';
  alertaDiasAntes?: Maybe<Scalars['Number']['output']>;
  calle?: Maybe<Scalars['String']['output']>;
  cedula?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  ciudad?: Maybe<Scalars['String']['output']>;
  correos?: Maybe<Array<Maybe<Email>>>;
  cp?: Maybe<Scalars['String']['output']>;
  direccion?: Maybe<Scalars['String']['output']>;
  empresa?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  pais?: Maybe<Scalars['String']['output']>;
  provedurias?: Maybe<Array<Maybe<TipoProveduria>>>;
  redes?: Maybe<Array<Maybe<RedSocial>>>;
  telefonos?: Maybe<Array<Maybe<Telefono>>>;
  vencimientoPago?: Maybe<Scalars['Number']['output']>;
  vencimientoPagoTipo?: Maybe<Scalars['String']['output']>;
};

export type ProveedorInput = {
  alertaDiasAntes?: InputMaybe<Scalars['Number']['input']>;
  calle?: InputMaybe<Scalars['String']['input']>;
  cedula?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  ciudad?: InputMaybe<Scalars['String']['input']>;
  correos?: InputMaybe<Array<InputMaybe<EmailInput>>>;
  cp?: InputMaybe<Scalars['String']['input']>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  empresa?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  pais?: InputMaybe<Scalars['String']['input']>;
  provedurias?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  redes?: InputMaybe<Array<InputMaybe<RedSocialInput>>>;
  telefonos?: InputMaybe<Array<InputMaybe<TelefonoInput>>>;
  vencimientoPago?: InputMaybe<Scalars['Number']['input']>;
  vencimientoPagoTipo?: InputMaybe<Scalars['String']['input']>;
};

export type PuestoLimpieza = {
  __typename?: 'PuestoLimpieza';
  areas?: Maybe<Array<Maybe<Area>>>;
  codigo?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  ubicacion?: Maybe<Ubicacion>;
};

export type PuestoLimpiezaInput = {
  areas?: InputMaybe<Array<InputMaybe<AreaInput>>>;
  codigo?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  ubicacion?: InputMaybe<Scalars['ID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  obtenerActividadesEconomicas?: Maybe<Array<Maybe<ActividadEconomica>>>;
  obtenerActivo?: Maybe<Activo>;
  obtenerActivoConMovimientos?: Maybe<ActivoConMovimientos>;
  obtenerActivos?: Maybe<Array<Maybe<Activo>>>;
  obtenerActivosConMovimientos?: Maybe<Array<Maybe<ActivoMovimientos>>>;
  obtenerAlmacen?: Maybe<Almacen>;
  obtenerAlmacenLinea?: Maybe<AlmacenLinea>;
  obtenerAlmacenes?: Maybe<Array<Maybe<Almacen>>>;
  obtenerAnulacionesPendientes?: Maybe<Array<Maybe<AnulacionPendienteComanda>>>;
  obtenerArea?: Maybe<Areas>;
  obtenerAreas?: Maybe<Array<Maybe<Areas>>>;
  obtenerCajaById?: Maybe<Caja>;
  obtenerCajaByModulo?: Maybe<Caja>;
  obtenerCajas?: Maybe<Array<Maybe<Caja>>>;
  obtenerChequeoId?: Maybe<Chequeo>;
  obtenerChequeos?: Maybe<Array<Maybe<Chequeo>>>;
  obtenerCliente?: Maybe<Cliente>;
  obtenerClientes?: Maybe<Array<Maybe<Cliente>>>;
  obtenerComandaById?: Maybe<Comanda>;
  obtenerComandaPorMesa?: Maybe<Comanda>;
  obtenerComandas?: Maybe<Array<Maybe<Comanda>>>;
  obtenerComandasPendientes?: Maybe<Array<Maybe<Comanda>>>;
  obtenerComandasPendientesParaCocina?: Maybe<Array<Maybe<Comanda>>>;
  obtenerComandasPorPiso?: Maybe<ComandasPorPiso>;
  obtenerComodidadById?: Maybe<Comodidades>;
  obtenerComodidades?: Maybe<Array<Maybe<Comodidades>>>;
  obtenerExcepcionesComandas?: Maybe<Array<Maybe<ComandaException>>>;
  obtenerFacturasEmitidas?: Maybe<Array<Maybe<FacturaEmitida>>>;
  obtenerFacturasParametros?: Maybe<Array<Maybe<FacturasParametro>>>;
  obtenerFacturasParametrosByType?: Maybe<Array<Maybe<FacturasParametro>>>;
  obtenerGestionActual?: Maybe<GestionCaja>;
  obtenerGestionCajaById?: Maybe<GestionCaja>;
  obtenerGestionesCaja?: Maybe<Array<Maybe<GestionCaja>>>;
  obtenerGestionesPorCaja?: Maybe<Array<Maybe<GestionCaja>>>;
  obtenerGestionesPorRangoFecha?: Maybe<Array<Maybe<GestionCaja>>>;
  obtenerHabitacionById?: Maybe<Habitaciones>;
  obtenerHabitaciones?: Maybe<Array<Maybe<Habitaciones>>>;
  obtenerHabitacionesDisponibles?: Maybe<Array<Maybe<Habitaciones>>>;
  obtenerHabitacionesPetFriendly?: Maybe<Array<Maybe<Habitaciones>>>;
  obtenerHistorialConsecutivo?: Maybe<HistorialConsecutivo>;
  obtenerHistorialConsecutivos?: Maybe<Array<Maybe<HistorialConsecutivo>>>;
  obtenerImpuestoById?: Maybe<Impuesto>;
  obtenerImpuestoByNombre?: Maybe<Impuesto>;
  obtenerImpuestos?: Maybe<Array<Maybe<Impuesto>>>;
  obtenerItem?: Maybe<Data_Items>;
  obtenerItems?: Maybe<Array<Maybe<Data_Items>>>;
  obtenerLineaAlmacen?: Maybe<AlmacenLinea>;
  obtenerLineaMenu?: Maybe<MenuLinea>;
  obtenerLineaOrdenCompra?: Maybe<LineaOrdenCompra>;
  obtenerLineaRecepcionPedido?: Maybe<LineasRecepcionPedido>;
  obtenerLineaTransferenciaInterna?: Maybe<TransferenciaInternaLinea>;
  obtenerLineasAlmacen?: Maybe<Array<Maybe<AlmacenLinea>>>;
  obtenerLineasMenu?: Maybe<Array<Maybe<MenuLinea>>>;
  obtenerLineasOrdenCompra?: Maybe<Array<Maybe<LineaOrdenCompra>>>;
  obtenerLineasRecepcionPedido?: Maybe<Array<Maybe<LineasRecepcionPedido>>>;
  obtenerLineasTransferenciaInterna?: Maybe<Array<Maybe<TransferenciaInternaLinea>>>;
  obtenerMateriaPrima?: Maybe<MateriaPrimaConMovimientos>;
  obtenerMateriasPrimas?: Maybe<Array<Maybe<MateriaPrima>>>;
  obtenerMateriasPrimasConMovimientos?: Maybe<Array<Maybe<MateriaPrimaMovimientos>>>;
  obtenerMateriasPrimasDeOrdenes?: Maybe<Array<Maybe<MateriaPrimaReporte>>>;
  obtenerMateriasPrimasReporte?: Maybe<Array<Maybe<MateriaPrimaReporte>>>;
  obtenerMenu?: Maybe<Menu>;
  obtenerMenus?: Maybe<Array<Maybe<Menu>>>;
  obtenerMesaById?: Maybe<Mesa>;
  obtenerMesas?: Maybe<Array<Maybe<Mesa>>>;
  obtenerMesasPorPiso?: Maybe<Array<Maybe<Mesa>>>;
  obtenerModuloConsecutivo?: Maybe<ModuloConsecutivo>;
  obtenerModulosConsecutivos?: Maybe<Array<Maybe<ModuloConsecutivo>>>;
  obtenerMovimientoById?: Maybe<MovimientoCaja>;
  obtenerMovimientos?: Maybe<Array<Maybe<MovimientosType>>>;
  obtenerMovimientos2?: Maybe<Array<Maybe<MovimientosType>>>;
  obtenerMovimientosActivos?: Maybe<Array<Maybe<MovimientosActivoType>>>;
  obtenerMovimientosCajas?: Maybe<Array<Maybe<MovimientoCaja>>>;
  obtenerMovimientosDeGestion?: Maybe<Array<Maybe<MovimientoCaja>>>;
  obtenerMovimientosGestionesPorRangoFecha?: Maybe<Array<Maybe<GestionCajaConMovimientos>>>;
  obtenerMovimientosPorFecha?: Maybe<Array<Maybe<MovimientoRestaurante>>>;
  obtenerMovimientosRestaurante?: Maybe<Array<Maybe<MovimientoRestaurante>>>;
  obtenerNota?: Maybe<Notas>;
  obtenerNotas?: Maybe<Array<Maybe<Notas>>>;
  obtenerNotasPorFecha?: Maybe<Array<Maybe<Notas>>>;
  obtenerOrdenCompra?: Maybe<OrdenCompra>;
  obtenerOrdenesCompra?: Maybe<Array<Maybe<OrdenCompra>>>;
  obtenerPaquete?: Maybe<Paquete>;
  obtenerPaquetes?: Maybe<Array<Maybe<Paquete>>>;
  obtenerPermisos?: Maybe<Array<Maybe<Permiso>>>;
  obtenerPisoById?: Maybe<Piso>;
  obtenerPisos?: Maybe<Array<Maybe<Piso>>>;
  obtenerProveedor?: Maybe<Proveedor>;
  obtenerProveedores?: Maybe<Array<Maybe<Proveedor>>>;
  obtenerPuestoLimpieza?: Maybe<PuestoLimpieza>;
  obtenerPuestoLimpiezas?: Maybe<Array<Maybe<PuestoLimpieza>>>;
  obtenerRecepcionPedido?: Maybe<RecepcionProductos>;
  obtenerRecepcionPedidos?: Maybe<Array<Maybe<RecepcionProductos>>>;
  obtenerRegistroContable?: Maybe<RegistroContable>;
  obtenerRegistrosContables?: Maybe<Array<Maybe<RegistroContable>>>;
  obtenerRegistrosContablesTipo?: Maybe<Array<Maybe<RegistroContable>>>;
  obtenerReporteAnulaciones?: Maybe<Array<Maybe<ReporteAnulacionComanda>>>;
  obtenerReporteAnulacionesConDecision?: Maybe<Array<Maybe<ReporteAnulacionConDecision>>>;
  obtenerReporteComanda?: Maybe<Array<Maybe<ComandaReport>>>;
  obtenerReporteGastosGerencia?: Maybe<Array<Maybe<MovimientoRestaurante>>>;
  obtenerReporteMovimientosConDescuento?: Maybe<Array<Maybe<MovimientoRestaurante>>>;
  obtenerReporteVentas?: Maybe<Array<Maybe<MovimientoRestaurante>>>;
  obtenerReserva?: Maybe<Reserva>;
  obtenerReservaHabitacion?: Maybe<Array<Maybe<ReservaHabitacion>>>;
  obtenerReservaHabitaciones?: Maybe<Array<Maybe<ReservaHabitacion>>>;
  obtenerReservaHabitacionesPorFecha?: Maybe<Array<Maybe<ReservaHabitacion>>>;
  obtenerReservaPorCliente?: Maybe<Reserva>;
  obtenerReservaPorHabitacion?: Maybe<ReservaHabitacion>;
  obtenerReservas?: Maybe<Array<Maybe<Reserva>>>;
  obtenerReservasServiciosExternos?: Maybe<Array<Maybe<ReservaServicioExterno>>>;
  obtenerRol?: Maybe<Rol>;
  obtenerRoles?: Maybe<Array<Maybe<Rol>>>;
  obtenerServicio?: Maybe<Servicios>;
  obtenerServicioExterno?: Maybe<ServiciosExternos>;
  obtenerServicios?: Maybe<Array<Maybe<Servicios>>>;
  obtenerServiciosExternos?: Maybe<Array<Maybe<ServiciosExternos>>>;
  obtenerSubcuentaById?: Maybe<Subcuenta>;
  obtenerSubcuentas?: Maybe<Array<Maybe<Subcuenta>>>;
  obtenerSubcuentasPorComanda?: Maybe<Array<Maybe<Subcuenta>>>;
  obtenerTemporada?: Maybe<Array<Maybe<Temporada>>>;
  obtenerTemporadaById?: Maybe<Temporada>;
  obtenerTipoHabitacionById?: Maybe<TipoHabitacion>;
  obtenerTipoMenuById?: Maybe<TipoMenu>;
  obtenerTipoMetodoPagoById?: Maybe<TipoMetodoPago>;
  obtenerTipoPlatilloById?: Maybe<TipoPlatillo>;
  obtenerTipoProveduria?: Maybe<Array<Maybe<TipoProveduria>>>;
  obtenerTipoProveduriaById?: Maybe<TipoProveduria>;
  obtenerTipoServicio?: Maybe<Array<Maybe<TipoServicio>>>;
  obtenerTipoServicioId?: Maybe<TipoServicio>;
  obtenerTiposHabitaciones?: Maybe<Array<Maybe<TipoHabitacion>>>;
  obtenerTiposMenu?: Maybe<Array<Maybe<TipoMenu>>>;
  obtenerTiposMetodoPago?: Maybe<Array<Maybe<TipoMetodoPago>>>;
  obtenerTiposPlatillo?: Maybe<Array<Maybe<TipoPlatillo>>>;
  obtenerTodasMateriasPrimas?: Maybe<Array<Maybe<MateriaPrima>>>;
  obtenerTodosChequeos?: Maybe<Array<Maybe<Chequeo>>>;
  obtenerTour?: Maybe<Tour>;
  obtenerTours?: Maybe<Array<Maybe<Tour>>>;
  obtenerTransferenciaInterna?: Maybe<TransferenciaInterna>;
  obtenerTransferenciasInternas?: Maybe<Array<Maybe<TransferenciaInterna>>>;
  obtenerUbicacionById?: Maybe<Ubicacion>;
  obtenerUbicaciones?: Maybe<Array<Maybe<Ubicacion>>>;
  obtenerUsuario?: Maybe<Usuario>;
  obtenerUsuarioAutenticado?: Maybe<RespuestaUsuario>;
  obtenerUsuarioByCodigo?: Maybe<Usuario>;
  obtenerUsuariosActivos?: Maybe<Array<Maybe<Usuario>>>;
};

export type QueryObtenerActivoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerActivoConMovimientosArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerAlmacenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerAlmacenLineaArgs = {
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerAnulacionesPendientesArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerAreaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerCajaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerCajaByModuloArgs = {
  modulo?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerChequeoIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerChequeosArgs = {
  fecha1?: InputMaybe<Scalars['Date']['input']>;
  fecha2?: InputMaybe<Scalars['Date']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerClienteArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerComandaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerComandaPorMesaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerComandasPorPisoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerComodidadByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerExcepcionesComandasArgs = {
  comanda?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerFacturasParametrosByTypeArgs = {
  type?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerGestionActualArgs = {
  caja?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerGestionCajaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerGestionesPorCajaArgs = {
  caja?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerGestionesPorRangoFechaArgs = {
  caja?: InputMaybe<Scalars['ID']['input']>;
  fechaFin?: InputMaybe<Scalars['String']['input']>;
  fechaInicio?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerHabitacionByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerHistorialConsecutivoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerImpuestoByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerImpuestoByNombreArgs = {
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerItemArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineaAlmacenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineaMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineaOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineaRecepcionPedidoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineaTransferenciaInternaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineasAlmacenArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineasMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineasOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineasRecepcionPedidoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerLineasTransferenciaInternaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMateriaPrimaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMateriasPrimasArgs = {
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerMateriasPrimasConMovimientosArgs = {
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerMateriasPrimasDeOrdenesArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
  maximo?: InputMaybe<Scalars['Number']['input']>;
  minimo?: InputMaybe<Scalars['Number']['input']>;
  proveedorId?: InputMaybe<Scalars['ID']['input']>;
  unidad?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerMateriasPrimasReporteArgs = {
  maximo?: InputMaybe<Scalars['Number']['input']>;
  minimo?: InputMaybe<Scalars['Number']['input']>;
  unidad?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerMenuArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMesaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMesasPorPisoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerModuloConsecutivoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMovimientoByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMovimientosArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMovimientos2Args = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMovimientosDeGestionArgs = {
  gestionCajaId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerMovimientosGestionesPorRangoFechaArgs = {
  caja?: InputMaybe<Scalars['ID']['input']>;
  fechaFin?: InputMaybe<Scalars['String']['input']>;
  fechaInicio?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerMovimientosPorFechaArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerNotaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerNotasPorFechaArgs = {
  fecha: Scalars['String']['input'];
};

export type QueryObtenerOrdenCompraArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerOrdenesCompraArgs = {
  filtro?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerPaqueteArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerPisoByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerProveedorArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerPuestoLimpiezaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerRecepcionPedidoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerRecepcionPedidosArgs = {
  filtro?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerRegistroContableArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerRegistrosContablesTipoArgs = {
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerReporteAnulacionesArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerReporteAnulacionesConDecisionArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerReporteComandaArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerReporteGastosGerenciaArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerReporteMovimientosConDescuentoArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerReporteVentasArgs = {
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
};

export type QueryObtenerReservaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerReservaHabitacionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerReservaHabitacionesPorFechaArgs = {
  fecha: Scalars['String']['input'];
};

export type QueryObtenerReservaPorClienteArgs = {
  nombreCliente?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerReservaPorHabitacionArgs = {
  numeroHabitacion?: InputMaybe<Scalars['String']['input']>;
};

export type QueryObtenerRolArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerServicioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerServicioExternoArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerSubcuentaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerSubcuentasPorComandaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTemporadaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTipoHabitacionByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTipoMenuByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTipoMetodoPagoByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTipoPlatilloByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTipoProveduriaByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTipoServicioIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTourArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerTransferenciaInternaArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerUbicacionByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerUsuarioArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryObtenerUsuarioByCodigoArgs = {
  codigo?: InputMaybe<Scalars['String']['input']>;
};

export type RecepcionProductos = {
  __typename?: 'RecepcionProductos';
  estado?: Maybe<Estado>;
  estadoRecepcion?: Maybe<EstadoRecepcion>;
  fechaEntrega?: Maybe<Scalars['Date']['output']>;
  fechaPedido?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  impuestosMonto?: Maybe<Scalars['Number']['output']>;
  pedido?: Maybe<OrdenCompra>;
  proveedor?: Maybe<Proveedor>;
  subtotal?: Maybe<Scalars['Number']['output']>;
  total?: Maybe<Scalars['Number']['output']>;
};

export type RecepcionProductosInput = {
  estado?: InputMaybe<Estado>;
  estadoRecepcion?: InputMaybe<EstadoPedido>;
  fechaEntrega?: InputMaybe<Scalars['Date']['input']>;
  fechaPedido?: InputMaybe<Scalars['Date']['input']>;
  impuestosMonto?: InputMaybe<Scalars['Number']['input']>;
  pedido?: InputMaybe<Scalars['ID']['input']>;
  proveedor?: InputMaybe<Scalars['ID']['input']>;
  subtotal?: InputMaybe<Scalars['Number']['input']>;
  total?: InputMaybe<Scalars['Number']['input']>;
};

export type Receptor = {
  __typename?: 'Receptor';
  CorreoElectronico?: Maybe<Scalars['String']['output']>;
  CorreoElectronicoCC?: Maybe<Scalars['String']['output']>;
  FaxArea?: Maybe<Scalars['Int']['output']>;
  FaxNumero?: Maybe<Scalars['Int']['output']>;
  IdentificacionNumero?: Maybe<Scalars['String']['output']>;
  IdentificacionTipo?: Maybe<Scalars['String']['output']>;
  Nombre?: Maybe<Scalars['String']['output']>;
  NombreComercial?: Maybe<Scalars['String']['output']>;
};

export type RechazarAnulacionInput = {
  anulacionId: Scalars['ID']['input'];
  motivo?: InputMaybe<Scalars['String']['input']>;
  usuarioAprobador: Scalars['ID']['input'];
};

export type RedSocial = {
  __typename?: 'RedSocial';
  enlace?: Maybe<Scalars['String']['output']>;
  red?: Maybe<Scalars['String']['output']>;
};

export type RedSocialInput = {
  enlace?: InputMaybe<Scalars['String']['input']>;
  red?: InputMaybe<Scalars['String']['input']>;
};

export type RegistroContable = {
  __typename?: 'RegistroContable';
  cliente?: Maybe<Cliente>;
  comprobantePago?: Maybe<Scalars['String']['output']>;
  consecutivo?: Maybe<HistorialConsecutivo>;
  estado?: Maybe<Estado>;
  estadoRegistroContable?: Maybe<EstadoCuenta>;
  fechaPago?: Maybe<Scalars['Date']['output']>;
  fechaRegistro?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  monto?: Maybe<Scalars['Float']['output']>;
  proveedor?: Maybe<Proveedor>;
  referenciaID?: Maybe<Scalars['String']['output']>;
  referenciaModelo?: Maybe<Scalars['String']['output']>;
  referenciaNombre?: Maybe<Scalars['String']['output']>;
  tipoPago?: Maybe<TipoPago>;
  tipoRegistroContable?: Maybe<TipoRegistroContable>;
  usuario?: Maybe<Usuario>;
};

export type RegistroContableInput = {
  cedula?: InputMaybe<Scalars['String']['input']>;
  cliente?: InputMaybe<Scalars['ID']['input']>;
  comprobantePago?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estado>;
  estadoRegistroContable?: InputMaybe<EstadoCuenta>;
  fechaPago?: InputMaybe<Scalars['Date']['input']>;
  fechaRegistro?: InputMaybe<Scalars['Date']['input']>;
  monto?: InputMaybe<Scalars['Float']['input']>;
  proveedor?: InputMaybe<Scalars['ID']['input']>;
  referenciaID?: InputMaybe<Scalars['String']['input']>;
  referenciaModelo?: InputMaybe<Scalars['String']['input']>;
  referenciaNombre?: InputMaybe<Scalars['String']['input']>;
  tipoPago?: InputMaybe<TipoPago>;
  tipoRegistroContable?: InputMaybe<TipoRegistroContable>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type ReporteAnulacionComanda = {
  __typename?: 'ReporteAnulacionComanda';
  _id?: Maybe<Scalars['ID']['output']>;
  accion?: Maybe<Scalars['String']['output']>;
  deducciones?: Maybe<Array<Maybe<DeduccionInventario>>>;
  estado?: Maybe<Scalars['String']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  monto?: Maybe<Scalars['Number']['output']>;
  motivo?: Maybe<Scalars['String']['output']>;
  platillo?: Maybe<Scalars['String']['output']>;
  registroContableId?: Maybe<Scalars['ID']['output']>;
  tieneCobroPendiente?: Maybe<Scalars['Boolean']['output']>;
  usuarioAnulo?: Maybe<Scalars['String']['output']>;
  usuarioOrden?: Maybe<Scalars['String']['output']>;
};

export type ReporteAnulacionConDecision = {
  __typename?: 'ReporteAnulacionConDecision';
  _id?: Maybe<Scalars['ID']['output']>;
  accion?: Maybe<Scalars['String']['output']>;
  accionAprobacion?: Maybe<Scalars['String']['output']>;
  deducciones?: Maybe<Array<Maybe<DeduccionInventario>>>;
  estado?: Maybe<Scalars['String']['output']>;
  fecha?: Maybe<Scalars['Date']['output']>;
  fechaAprobacion?: Maybe<Scalars['Date']['output']>;
  monto?: Maybe<Scalars['Number']['output']>;
  motivo?: Maybe<Scalars['String']['output']>;
  motivoAprobacion?: Maybe<Scalars['String']['output']>;
  platillo?: Maybe<Scalars['String']['output']>;
  registroContableId?: Maybe<Scalars['ID']['output']>;
  tieneCobroPendiente?: Maybe<Scalars['Boolean']['output']>;
  usuarioAnulo?: Maybe<Scalars['String']['output']>;
  usuarioAprobador?: Maybe<Scalars['String']['output']>;
  usuarioOrden?: Maybe<Scalars['String']['output']>;
};

export type Reserva = {
  __typename?: 'Reserva';
  cliente?: Maybe<Cliente>;
  estado?: Maybe<Scalars['String']['output']>;
  fechaReserva?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  metodoPago?: Maybe<Scalars['String']['output']>;
  notas?: Maybe<Scalars['JSON']['output']>;
  numeroPersonas?: Maybe<NumeroPersonas>;
  paquetes?: Maybe<Scalars['JSON']['output']>;
  petFriendly?: Maybe<Scalars['Boolean']['output']>;
  petQuantity?: Maybe<Scalars['Number']['output']>;
  politicas?: Maybe<Scalars['String']['output']>;
  serviciosGrupal?: Maybe<Scalars['JSON']['output']>;
  tipo?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
  tours?: Maybe<Scalars['JSON']['output']>;
  ultimaModificacion?: Maybe<Scalars['String']['output']>;
  usuario?: Maybe<Usuario>;
};

export type ReservaClienteInput = {
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  nombreFacturacion?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
};

export type ReservaHabitacion = {
  __typename?: 'ReservaHabitacion';
  cargosHabitacion?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  cargosPerdida?: Maybe<Array<Maybe<CargosPerdida>>>;
  cliente?: Maybe<Array<Maybe<Clientes>>>;
  estado?: Maybe<Scalars['String']['output']>;
  fechaEntrada?: Maybe<Scalars['String']['output']>;
  fechaSalida?: Maybe<Scalars['String']['output']>;
  habitacion?: Maybe<Habitaciones>;
  horaCheckIn?: Maybe<Scalars['String']['output']>;
  horaCheckOut?: Maybe<Scalars['String']['output']>;
  huespedes?: Maybe<Array<Maybe<Huesped>>>;
  id?: Maybe<Scalars['ID']['output']>;
  items?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  reserva?: Maybe<Reserva>;
  serviciosExternos?: Maybe<Scalars['JSON']['output']>;
  serviciosExtra?: Maybe<Scalars['JSON']['output']>;
  toursExtra?: Maybe<Scalars['JSON']['output']>;
};

export type ReservaHabitacionInput = {
  cargosHabitacion?: InputMaybe<Scalars['JSON']['input']>;
  cargosPerdida?: InputMaybe<Array<InputMaybe<CargosPerdidainput>>>;
  cliente?: InputMaybe<Array<InputMaybe<ReservaClienteInput>>>;
  estado?: InputMaybe<Scalars['String']['input']>;
  fechaEntrada?: InputMaybe<Scalars['String']['input']>;
  fechaSalida?: InputMaybe<Scalars['String']['input']>;
  habitacion?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  horaCheckIn?: InputMaybe<Scalars['String']['input']>;
  horaCheckOut?: InputMaybe<Scalars['String']['input']>;
  huespedes?: InputMaybe<Array<InputMaybe<HuespedInput>>>;
  reserva?: InputMaybe<Scalars['ID']['input']>;
  serviciosExternos?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  serviciosExtra?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  toursExtra?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
};

export type ReservaInput = {
  cliente?: InputMaybe<Scalars['ID']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  fechaReserva?: InputMaybe<Scalars['String']['input']>;
  metodoPago?: InputMaybe<Scalars['String']['input']>;
  notas?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  numeroPersonas?: InputMaybe<NumeroPersonasInput>;
  paquetes?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  politicas?: InputMaybe<Scalars['String']['input']>;
  serviciosExternos?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  serviciosGrupal?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['Number']['input']>;
  tours?: InputMaybe<Array<InputMaybe<Scalars['JSON']['input']>>>;
  ultimaModificacion?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type ReservaServicioExterno = {
  __typename?: 'ReservaServicioExterno';
  clienteServicioExterno?: Maybe<Scalars['JSON']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  serviciosExternos?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  tipo?: Maybe<Scalars['String']['output']>;
  usuario?: Maybe<Usuario>;
};

export type ReservaServicioExternoInput = {
  clienteServicioExterno?: InputMaybe<Scalars['JSON']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type RespuestaActividadEconomica = {
  __typename?: 'RespuestaActividadEconomica';
  data?: Maybe<ActividadEconomica>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaActivos = {
  __typename?: 'RespuestaActivos';
  data?: Maybe<Activo>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaAlmacen = {
  __typename?: 'RespuestaAlmacen';
  data?: Maybe<Almacen>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaAlmacenLinea = {
  __typename?: 'RespuestaAlmacenLinea';
  data?: Maybe<AlmacenLinea>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaAnulacionComanda = {
  __typename?: 'RespuestaAnulacionComanda';
  data?: Maybe<AnulacionComanda>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaAreas = {
  __typename?: 'RespuestaAreas';
  data?: Maybe<Areas>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaAutenticar = {
  __typename?: 'RespuestaAutenticar';
  cedula?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type RespuestaBuscar = {
  __typename?: 'RespuestaBuscar';
  chequeo?: Maybe<Chequeo>;
  estado?: Maybe<Scalars['Number']['output']>;
};

export type RespuestaCaja = {
  __typename?: 'RespuestaCaja';
  data?: Maybe<Caja>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaChequeo = {
  __typename?: 'RespuestaChequeo';
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaCliente = {
  __typename?: 'RespuestaCliente';
  data?: Maybe<Cliente>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaComanda = {
  __typename?: 'RespuestaComanda';
  data?: Maybe<Comanda>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaComodidades = {
  __typename?: 'RespuestaComodidades';
  data?: Maybe<Comodidades>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaComprobar = {
  __typename?: 'RespuestaComprobar';
  cedula?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['JSON']['output']>>>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type RespuestaGenerarConsecutivo = {
  __typename?: 'RespuestaGenerarConsecutivo';
  data?: Maybe<HistorialConsecutivo>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaGestionCaja = {
  __typename?: 'RespuestaGestionCaja';
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  warning?: Maybe<Scalars['String']['output']>;
  warningCount?: Maybe<Scalars['Int']['output']>;
};

export type RespuestaHabitaciones = {
  __typename?: 'RespuestaHabitaciones';
  data?: Maybe<Habitaciones>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaHistorialConsecutivo = {
  __typename?: 'RespuestaHistorialConsecutivo';
  data?: Maybe<HistorialConsecutivo>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaImpuesto = {
  __typename?: 'RespuestaImpuesto';
  data?: Maybe<Impuesto>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaItems = {
  __typename?: 'RespuestaItems';
  data?: Maybe<Data_Items>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaLineaOrdenCompra = {
  __typename?: 'RespuestaLineaOrdenCompra';
  data?: Maybe<LineaOrdenCompra>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaLineasRecepcionPedido = {
  __typename?: 'RespuestaLineasRecepcionPedido';
  data?: Maybe<LineasRecepcionPedido>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaMateriaPrima = {
  __typename?: 'RespuestaMateriaPrima';
  data?: Maybe<MateriaPrima>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaMenu = {
  __typename?: 'RespuestaMenu';
  data?: Maybe<Menu>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaMenuLinea = {
  __typename?: 'RespuestaMenuLinea';
  data?: Maybe<MenuLinea>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaMesa = {
  __typename?: 'RespuestaMesa';
  data?: Maybe<Mesa>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaModuloConsecutivo = {
  __typename?: 'RespuestaModuloConsecutivo';
  data?: Maybe<ModuloConsecutivo>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaMovimientoCaja = {
  __typename?: 'RespuestaMovimientoCaja';
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaMovimientoRestaurante = {
  __typename?: 'RespuestaMovimientoRestaurante';
  data?: Maybe<MovimientoRestaurante>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaMovimientos = {
  __typename?: 'RespuestaMovimientos';
  data?: Maybe<MovimientosType>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaMovimientosActivo = {
  __typename?: 'RespuestaMovimientosActivo';
  data?: Maybe<MovimientosActivoType>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaNotas = {
  __typename?: 'RespuestaNotas';
  data?: Maybe<Notas>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaOperacionStock = {
  __typename?: 'RespuestaOperacionStock';
  almacenId?: Maybe<Scalars['ID']['output']>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaOrdenCompra = {
  __typename?: 'RespuestaOrdenCompra';
  data?: Maybe<OrdenCompra>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaPaquete = {
  __typename?: 'RespuestaPaquete';
  data?: Maybe<Paquete>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaPiso = {
  __typename?: 'RespuestaPiso';
  data?: Maybe<Piso>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaProveedor = {
  __typename?: 'RespuestaProveedor';
  data?: Maybe<Proveedor>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaPuestoLimpieza = {
  __typename?: 'RespuestaPuestoLimpieza';
  data?: Maybe<PuestoLimpieza>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaRecepcionProductos = {
  __typename?: 'RespuestaRecepcionProductos';
  data?: Maybe<RecepcionProductos>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaRegistroContable = {
  __typename?: 'RespuestaRegistroContable';
  data?: Maybe<RegistroContable>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaReserva = {
  __typename?: 'RespuestaReserva';
  data?: Maybe<Reserva>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaReservaHabitacion = {
  __typename?: 'RespuestaReservaHabitacion';
  data?: Maybe<ReservaHabitacion>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaReservaServicioExterno = {
  __typename?: 'RespuestaReservaServicioExterno';
  data?: Maybe<ReservaServicioExterno>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaRol = {
  __typename?: 'RespuestaRol';
  data?: Maybe<Rol>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaServicios = {
  __typename?: 'RespuestaServicios';
  data?: Maybe<Servicios>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaServiciosExternos = {
  __typename?: 'RespuestaServiciosExternos';
  data?: Maybe<Servicios>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaSubcuenta = {
  __typename?: 'RespuestaSubcuenta';
  data?: Maybe<Subcuenta>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['Date']['output']>;
};

export type RespuestaTemporada = {
  __typename?: 'RespuestaTemporada';
  data?: Maybe<Temporada>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTipoHabitacion = {
  __typename?: 'RespuestaTipoHabitacion';
  data?: Maybe<TipoHabitacion>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTipoMenu = {
  __typename?: 'RespuestaTipoMenu';
  data?: Maybe<TipoMenu>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTipoMetodoPago = {
  __typename?: 'RespuestaTipoMetodoPago';
  data?: Maybe<TipoMetodoPago>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTipoPlatillo = {
  __typename?: 'RespuestaTipoPlatillo';
  data?: Maybe<TipoPlatillo>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTipoProveduria = {
  __typename?: 'RespuestaTipoProveduria';
  data?: Maybe<TipoProveduria>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTipoServicio = {
  __typename?: 'RespuestaTipoServicio';
  data?: Maybe<TipoServicio>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTour = {
  __typename?: 'RespuestaTour';
  data?: Maybe<Tour>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTransferenciaInterna = {
  __typename?: 'RespuestaTransferenciaInterna';
  data?: Maybe<TransferenciaInterna>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaTransferenciaInternaLinea = {
  __typename?: 'RespuestaTransferenciaInternaLinea';
  data?: Maybe<TransferenciaInternaLinea>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaUbicacion = {
  __typename?: 'RespuestaUbicacion';
  data?: Maybe<Ubicacion>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaUpload = {
  __typename?: 'RespuestaUpload';
  estado?: Maybe<Scalars['Boolean']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaUsuario = {
  __typename?: 'RespuestaUsuario';
  data?: Maybe<Usuario>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaVerificacion = {
  __typename?: 'RespuestaVerificacion';
  codigo?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type RespuestaVerificar = {
  __typename?: 'RespuestaVerificar';
  estado?: Maybe<Scalars['Number']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Rol = {
  __typename?: 'Rol';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  permisos?: Maybe<Array<Maybe<Permisos>>>;
};

export type RolInput = {
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  permisos?: InputMaybe<Array<InputMaybe<PermisosInput>>>;
};

export type Servicios = {
  __typename?: 'Servicios';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  tipo?: Maybe<TipoServicio>;
};

export type ServiciosExternos = {
  __typename?: 'ServiciosExternos';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  tipo?: Maybe<TipoServicio>;
};

export type ServiciosExternosInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  tipo?: InputMaybe<Scalars['ID']['input']>;
};

export type ServiciosInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  tipo?: InputMaybe<Scalars['ID']['input']>;
};

export type Subcuenta = {
  __typename?: 'Subcuenta';
  cliente?: Maybe<Cliente>;
  comanda?: Maybe<Comanda>;
  descuento?: Maybe<Scalars['Number']['output']>;
  estado?: Maybe<SubcuentaEstado>;
  fecha?: Maybe<Scalars['Date']['output']>;
  fechaFinalizada?: Maybe<Scalars['Date']['output']>;
  fechaGenerada?: Maybe<Scalars['Date']['output']>;
  formaPago?: Maybe<Array<Maybe<FormaPago>>>;
  id?: Maybe<Scalars['ID']['output']>;
  moneda?: Maybe<Scalars['String']['output']>;
  numero?: Maybe<Scalars['Number']['output']>;
  platillos?: Maybe<Array<Maybe<Platillos>>>;
  total?: Maybe<Scalars['Number']['output']>;
};

export enum SubcuentaEstado {
  Cancelado = 'Cancelado',
  Entregado = 'Entregado',
  Pagado = 'Pagado',
  Pendiente = 'Pendiente'
}

export type SubcuentaInput = {
  cliente?: InputMaybe<Scalars['ID']['input']>;
  comanda?: InputMaybe<Scalars['ID']['input']>;
  descuento?: InputMaybe<Scalars['Number']['input']>;
  estado?: InputMaybe<SubcuentaEstado>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  fechaFinalizada?: InputMaybe<Scalars['Date']['input']>;
  fechaGenerada?: InputMaybe<Scalars['Date']['input']>;
  formaPago?: InputMaybe<Array<InputMaybe<FormaPagoInput>>>;
  moneda?: InputMaybe<Scalars['String']['input']>;
  numero?: InputMaybe<Scalars['Number']['input']>;
  platillos?: InputMaybe<Array<InputMaybe<PlatillosInput>>>;
  total?: InputMaybe<Scalars['Number']['input']>;
};

export type Telefono = {
  __typename?: 'Telefono';
  descripcion?: Maybe<Scalars['String']['output']>;
  ext?: Maybe<Scalars['String']['output']>;
  telefono?: Maybe<Scalars['String']['output']>;
};

export type TelefonoInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  ext?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
};

export type Temporada = {
  __typename?: 'Temporada';
  descripcion?: Maybe<Scalars['String']['output']>;
  fechaFin?: Maybe<Scalars['String']['output']>;
  fechaInicio?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  tipo?: Maybe<Scalars['String']['output']>;
  tiposHabitacion?: Maybe<Scalars['JSON']['output']>;
};

export type TemporadaInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  fechaFin?: InputMaybe<Scalars['String']['input']>;
  fechaInicio?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  tiposHabitacion?: InputMaybe<Scalars['JSON']['input']>;
};

export enum Tipo {
  Entrada = 'ENTRADA',
  Salida = 'SALIDA'
}

export type TipoHabitacion = {
  __typename?: 'TipoHabitacion';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precioBase?: Maybe<Scalars['Number']['output']>;
};

export type TipoHabitacionInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precioBase?: InputMaybe<Scalars['Number']['input']>;
};

export enum TipoMateriaPrima {
  Hotel = 'Hotel',
  Restaurante = 'Restaurante',
  Tienda = 'Tienda'
}

export type TipoMenu = {
  __typename?: 'TipoMenu';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type TipoMenuInput = {
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type TipoMetodoPago = {
  __typename?: 'TipoMetodoPago';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type TipoMetodoPagoInput = {
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export enum TipoPago {
  Cheque = 'CHEQUE',
  Efectivo = 'EFECTIVO',
  Sinpe = 'SINPE',
  Tarjeta = 'TARJETA',
  Transferencia = 'TRANSFERENCIA'
}

export type TipoPlatillo = {
  __typename?: 'TipoPlatillo';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type TipoPlatilloInput = {
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type TipoProveduria = {
  __typename?: 'TipoProveduria';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  tipo?: Maybe<Scalars['String']['output']>;
};

export type TipoProveduriaInput = {
  estado?: InputMaybe<Estado>;
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export enum TipoRegistroContable {
  Cobrar = 'COBRAR',
  Pagar = 'PAGAR'
}

export type TipoServicio = {
  __typename?: 'TipoServicio';
  cuantificable?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Estado>;
  horadia?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type TipoServicioInput = {
  cuantificable?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  horadia?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type Tour = {
  __typename?: 'Tour';
  descripcion?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  tipo?: Maybe<Scalars['String']['output']>;
};

export type TourInput = {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
};

export type TransferenciaInterna = {
  __typename?: 'TransferenciaInterna';
  almacenDesde?: Maybe<Almacen>;
  almacenHasta?: Maybe<Almacen>;
  fecha?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  nota?: Maybe<Scalars['String']['output']>;
  usuario?: Maybe<Usuario>;
};

export type TransferenciaInternaInput = {
  almacenDesde?: InputMaybe<Scalars['ID']['input']>;
  almacenHasta?: InputMaybe<Scalars['ID']['input']>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  nota?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type TransferenciaInternaLinea = {
  __typename?: 'TransferenciaInternaLinea';
  cantidad?: Maybe<Scalars['Number']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  producto?: Maybe<MateriaPrima>;
  transferenciaInterna?: Maybe<TransferenciaInterna>;
};

export type TransferenciaInternaLineaInput = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
  transferenciaInterna?: InputMaybe<Scalars['ID']['input']>;
};

export type TransferenciaInternaLineaInput2 = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  producto?: InputMaybe<Scalars['ID']['input']>;
};

export type Ubicacion = {
  __typename?: 'Ubicacion';
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  x?: Maybe<Scalars['Int']['output']>;
  y?: Maybe<Scalars['Int']['output']>;
};

export type UbicacionInput = {
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  x?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
};

export enum Unidad {
  Kilogramo = 'Kilogramo',
  Litro = 'Litro',
  Unidades = 'Unidades'
}

export type Usuario = {
  __typename?: 'Usuario';
  cedula?: Maybe<Scalars['String']['output']>;
  clave?: Maybe<Scalars['String']['output']>;
  correos?: Maybe<Array<Maybe<Email>>>;
  estado?: Maybe<Estado>;
  id?: Maybe<Scalars['ID']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Maybe<Rol>>>;
  telefonos?: Maybe<Array<Maybe<Telefono>>>;
};

export type UsuarioCaja = {
  __typename?: 'UsuarioCaja';
  cedula?: Maybe<Scalars['String']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
};

export type UsuarioCajaInput = {
  cedula?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type UsuarioInput = {
  cedula?: InputMaybe<Scalars['String']['input']>;
  clave?: InputMaybe<Scalars['String']['input']>;
  correos?: InputMaybe<Array<InputMaybe<EmailInput>>>;
  estado?: InputMaybe<Estado>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  telefonos?: InputMaybe<Array<InputMaybe<TelefonoInput>>>;
};

export type ActualizarEntregadosInput = {
  entregados?: InputMaybe<Scalars['Number']['input']>;
  platillo?: InputMaybe<Scalars['ID']['input']>;
  subcuenta?: InputMaybe<Scalars['ID']['input']>;
};

export type CargosPerdida = {
  __typename?: 'cargosPerdida';
  cantidad?: Maybe<Scalars['Number']['output']>;
  descripcion?: Maybe<Scalars['String']['output']>;
  precio?: Maybe<Scalars['Number']['output']>;
  precioTotal?: Maybe<Scalars['Number']['output']>;
};

export type CargosPerdidainput = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  descripcion?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Number']['input']>;
  precioTotal?: InputMaybe<Scalars['Number']['input']>;
};

export type Clientes = {
  __typename?: 'clientes';
  codigo?: Maybe<Scalars['String']['output']>;
  correo?: Maybe<Scalars['String']['output']>;
  nombre?: Maybe<Scalars['String']['output']>;
  nombreFacturacion?: Maybe<Scalars['String']['output']>;
  pais?: Maybe<Scalars['String']['output']>;
  telefono?: Maybe<Scalars['String']['output']>;
};

export type Confirmacion = {
  __typename?: 'confirmacion';
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Item = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
};

export type Salida = {
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Salida_Inventario = {
  almacen?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
  materia_prima?: InputMaybe<Scalars['ID']['input']>;
  proveedor?: InputMaybe<Scalars['ID']['input']>;
  tipo?: InputMaybe<Tipo>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type Salidas = {
  cotizacion?: InputMaybe<Scalars['ID']['input']>;
  elementos?: InputMaybe<Array<InputMaybe<Salida>>>;
  usuario?: InputMaybe<Scalars['ID']['input']>;
};

export type ServicesExtra = {
  roomId?: InputMaybe<Scalars['ID']['input']>;
  serviceIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ServiciosExtra = {
  room?: InputMaybe<Scalars['ID']['input']>;
  service?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type ObtenerActivosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerActivosQuery = {
  __typename?: 'Query';
  obtenerActivos?: Array<{
    __typename?: 'Activo';
    id?: string | null;
    nombre?: string | null;
    unidad?: Unidad | null;
    referenciaInterna?: string | null;
    fechaRegistro?: any | null;
    estado?: string | null;
  } | null> | null;
};

export type ObtenerActivoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerActivoQuery = {
  __typename?: 'Query';
  obtenerActivo?: {
    __typename?: 'Activo';
    id?: string | null;
    nombre?: string | null;
    unidad?: Unidad | null;
    referenciaInterna?: string | null;
    fechaRegistro?: any | null;
    estado?: string | null;
  } | null;
};

export type ObtenerActivoConMovimientosQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerActivoConMovimientosQuery = {
  __typename?: 'Query';
  obtenerActivoConMovimientos?: {
    __typename?: 'ActivoConMovimientos';
    id?: string | null;
    nombre?: string | null;
    unidad?: Unidad | null;
    referenciaInterna?: string | null;
    fechaRegistro?: any | null;
    estado?: string | null;
    movimientos?: Array<{
      __typename?: 'MovimientosActivoType';
      id?: string | null;
      fecha?: any | null;
      tipo?: Tipo | null;
      beneficiario?: string | null;
      consecutivo?: {
        __typename?: 'HistorialConsecutivo';
        id?: string | null;
        consecutivo?: string | null;
      } | null;
    } | null> | null;
  } | null;
};

export type InsertarActivoMutationVariables = Exact<{
  input?: InputMaybe<ActivoInput>;
}>;

export type InsertarActivoMutation = {
  __typename?: 'Mutation';
  insertarActivo?: {
    __typename?: 'RespuestaActivos';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarActivoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ActivoInput>;
}>;

export type ActualizarActivoMutation = {
  __typename?: 'Mutation';
  actualizarActivo?: {
    __typename?: 'RespuestaActivos';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarActivoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarActivoMutation = {
  __typename?: 'Mutation';
  desactivarActivo?: {
    __typename?: 'RespuestaActivos';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerLineasAlmacenQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineasAlmacenQuery = {
  __typename?: 'Query';
  obtenerLineasAlmacen?: Array<{
    __typename?: 'AlmacenLinea';
    id?: string | null;
    cantidad?: any | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      unidad?: Unidad | null;
    } | null;
    almacen?: { __typename?: 'Almacen'; id?: string | null; nombre?: string | null } | null;
  } | null> | null;
};

export type ObtenerLineaAlmacenQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineaAlmacenQuery = {
  __typename?: 'Query';
  obtenerLineaAlmacen?: {
    __typename?: 'AlmacenLinea';
    id?: string | null;
    cantidad?: any | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      unidad?: Unidad | null;
    } | null;
    almacen?: { __typename?: 'Almacen'; id?: string | null; nombre?: string | null } | null;
  } | null;
};

export type ObtenerAlmacenLineaQueryVariables = Exact<{
  producto?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
}>;

export type ObtenerAlmacenLineaQuery = {
  __typename?: 'Query';
  obtenerAlmacenLinea?: {
    __typename?: 'AlmacenLinea';
    id?: string | null;
    cantidad?: any | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      unidad?: Unidad | null;
    } | null;
    almacen?: { __typename?: 'Almacen'; id?: string | null; nombre?: string | null } | null;
  } | null;
};

export type InsertarLineaAlmacenMutationVariables = Exact<{
  input?: InputMaybe<AlmacenLineaInput>;
}>;

export type InsertarLineaAlmacenMutation = {
  __typename?: 'Mutation';
  insertarLineaAlmacen?: {
    __typename?: 'RespuestaAlmacenLinea';
    estado?: boolean | null;
    message?: string | null;
    data?: {
      __typename?: 'AlmacenLinea';
      id?: string | null;
      cantidad?: any | null;
      producto?: {
        __typename?: 'MateriaPrima';
        id?: string | null;
        nombre?: string | null;
        unidad?: Unidad | null;
      } | null;
      almacen?: { __typename?: 'Almacen'; id?: string | null; nombre?: string | null } | null;
    } | null;
  } | null;
};

export type DescontarStockMutationVariables = Exact<{
  producto?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
}>;

export type DescontarStockMutation = {
  __typename?: 'Mutation';
  descontarStock?: {
    __typename?: 'RespuestaOperacionStock';
    estado?: boolean | null;
    almacenId?: string | null;
    message?: string | null;
  } | null;
};

export type ObtenerAlmacenesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerAlmacenesQuery = {
  __typename?: 'Query';
  obtenerAlmacenes?: Array<{
    __typename?: 'Almacen';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerAlmacenQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerAlmacenQuery = {
  __typename?: 'Query';
  obtenerAlmacen?: {
    __typename?: 'Almacen';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarAlmacenMutationVariables = Exact<{
  input?: InputMaybe<AlmacenInput>;
}>;

export type InsertarAlmacenMutation = {
  __typename?: 'Mutation';
  insertarAlmacen?: {
    __typename?: 'RespuestaAlmacen';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarAlmacenMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<AlmacenInput>;
}>;

export type ActualizarAlmacenMutation = {
  __typename?: 'Mutation';
  actualizarAlmacen?: {
    __typename?: 'RespuestaAlmacen';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarAlmacenMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarAlmacenMutation = {
  __typename?: 'Mutation';
  desactivarAlmacen?: {
    __typename?: 'RespuestaAlmacen';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerAreasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerAreasQuery = {
  __typename?: 'Query';
  obtenerAreas?: Array<{
    __typename?: 'Areas';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: string | null;
    eliminable?: boolean | null;
  } | null> | null;
};

export type ObtenerAreaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerAreaQuery = {
  __typename?: 'Query';
  obtenerArea?: {
    __typename?: 'Areas';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: string | null;
  } | null;
};

export type InsertarAreaMutationVariables = Exact<{
  input?: InputMaybe<AreasInput>;
}>;

export type InsertarAreaMutation = {
  __typename?: 'Mutation';
  insertarArea?: {
    __typename?: 'RespuestaAreas';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarAreaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<AreasInput>;
}>;

export type ActualizarAreaMutation = {
  __typename?: 'Mutation';
  actualizarArea?: {
    __typename?: 'RespuestaAreas';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarAreaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarAreaMutation = {
  __typename?: 'Mutation';
  desactivarArea?: {
    __typename?: 'RespuestaAreas';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerCajasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerCajasQuery = {
  __typename?: 'Query';
  obtenerCajas?: Array<{
    __typename?: 'Caja';
    id?: string | null;
    codigo?: string | null;
    nombre?: string | null;
    numero?: number | null;
    estado?: EstadoCaja | null;
    modulo?: ModuloCaja | null;
    montos_apertura?: any | null;
  } | null> | null;
};

export type ObtenerCajaByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerCajaByIdQuery = {
  __typename?: 'Query';
  obtenerCajaById?: {
    __typename?: 'Caja';
    id?: string | null;
    codigo?: string | null;
    nombre?: string | null;
    numero?: number | null;
    estado?: EstadoCaja | null;
    modulo?: ModuloCaja | null;
    montos_apertura?: any | null;
  } | null;
};

export type ObtenerCajaByModuloQueryVariables = Exact<{
  modulo?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerCajaByModuloQuery = {
  __typename?: 'Query';
  obtenerCajaByModulo?: {
    __typename?: 'Caja';
    id?: string | null;
    codigo?: string | null;
    nombre?: string | null;
    numero?: number | null;
    estado?: EstadoCaja | null;
    modulo?: ModuloCaja | null;
    montos_apertura?: any | null;
  } | null;
};

export type InsertarCajaMutationVariables = Exact<{
  input?: InputMaybe<CajaInput>;
}>;

export type InsertarCajaMutation = {
  __typename?: 'Mutation';
  insertarCaja?: {
    __typename?: 'RespuestaCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarCajaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<CajaInput>;
}>;

export type ActualizarCajaMutation = {
  __typename?: 'Mutation';
  actualizarCaja?: {
    __typename?: 'RespuestaCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CerrarCajaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type CerrarCajaMutation = {
  __typename?: 'Mutation';
  cerrarCaja?: {
    __typename?: 'RespuestaCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type AbrirCajaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type AbrirCajaMutation = {
  __typename?: 'Mutation';
  abrirCaja?: {
    __typename?: 'RespuestaCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CierreParcialMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type CierreParcialMutation = {
  __typename?: 'Mutation';
  cierreParcial?: {
    __typename?: 'RespuestaCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarCajaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarCajaMutation = {
  __typename?: 'Mutation';
  cierreParcial?: {
    __typename?: 'RespuestaCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerChequeosQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  fecha1?: InputMaybe<Scalars['Date']['input']>;
  fecha2?: InputMaybe<Scalars['Date']['input']>;
}>;

export type ObtenerChequeosQuery = {
  __typename?: 'Query';
  obtenerChequeos?: Array<{
    __typename?: 'Chequeo';
    id?: string | null;
    fecha?: any | null;
    fechaRegistro?: any | null;
    aprobado?: boolean | null;
    puesto_limpieza?: {
      __typename?: 'PuestoLimpieza';
      id?: string | null;
      nombre?: string | null;
    } | null;
    areas?: Array<{
      __typename?: 'AreasChequeo';
      area?: string | null;
      estado?: boolean | null;
    } | null> | null;
    usuario?: { __typename?: 'Usuario'; nombre?: string | null } | null;
  } | null> | null;
};

export type ObtenerTodosChequeosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTodosChequeosQuery = {
  __typename?: 'Query';
  obtenerTodosChequeos?: Array<{
    __typename?: 'Chequeo';
    id?: string | null;
    fecha?: any | null;
    fechaRegistro?: any | null;
    aprobado?: boolean | null;
    puesto_limpieza?: {
      __typename?: 'PuestoLimpieza';
      id?: string | null;
      nombre?: string | null;
    } | null;
    areas?: Array<{
      __typename?: 'AreasChequeo';
      area?: string | null;
      estado?: boolean | null;
    } | null> | null;
    usuario?: { __typename?: 'Usuario'; nombre?: string | null } | null;
  } | null> | null;
};

export type ObtenerChequeoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  fecha?: InputMaybe<Scalars['Date']['input']>;
}>;

export type ObtenerChequeoMutation = {
  __typename?: 'Mutation';
  obtenerChequeo?: {
    __typename?: 'RespuestaBuscar';
    estado?: any | null;
    chequeo?: {
      __typename?: 'Chequeo';
      id?: string | null;
      fecha?: any | null;
      aprobado?: boolean | null;
      puesto_limpieza?: { __typename?: 'PuestoLimpieza'; nombre?: string | null } | null;
      areas?: Array<{
        __typename?: 'AreasChequeo';
        area?: string | null;
        estado?: boolean | null;
      } | null> | null;
    } | null;
  } | null;
};

export type ObtenerChequeoIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerChequeoIdQuery = {
  __typename?: 'Query';
  obtenerChequeoId?: {
    __typename?: 'Chequeo';
    id?: string | null;
    fecha?: any | null;
    fechaRegistro?: any | null;
    aprobado?: boolean | null;
    puesto_limpieza?: {
      __typename?: 'PuestoLimpieza';
      id?: string | null;
      nombre?: string | null;
    } | null;
    areas?: Array<{
      __typename?: 'AreasChequeo';
      area?: string | null;
      estado?: boolean | null;
    } | null> | null;
    usuario?: { __typename?: 'Usuario'; nombre?: string | null } | null;
  } | null;
};

export type InsertarChequeoMutationVariables = Exact<{
  input?: InputMaybe<ChequeoInput>;
}>;

export type InsertarChequeoMutation = {
  __typename?: 'Mutation';
  insertarChequeo?: {
    __typename?: 'RespuestaChequeo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarChequeoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ChequeoInput>;
}>;

export type ActualizarChequeoMutation = {
  __typename?: 'Mutation';
  insertarChequeo?: {
    __typename?: 'RespuestaChequeo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type AprobarChequeoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type AprobarChequeoMutation = {
  __typename?: 'Mutation';
  aprobarChequeo?: {
    __typename?: 'RespuestaChequeo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerClientesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerClientesQuery = {
  __typename?: 'Query';
  obtenerClientes?: Array<{
    __typename?: 'Cliente';
    id?: string | null;
    tipo?: string | null;
    nombre?: string | null;
    nombreFacturacion?: string | null;
    codigo?: string | null;
    pais?: string | null;
    ciudad?: string | null;
    city?: string | null;
    calle?: string | null;
    cp?: string | null;
    direccion?: string | null;
    estado?: Estado | null;
    credito?: Credito | null;
    telefonos?: Array<{
      __typename?: 'Telefono';
      telefono?: string | null;
      ext?: string | null;
      descripcion?: string | null;
    } | null> | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    redes?: Array<{
      __typename?: 'RedSocial';
      red?: string | null;
      enlace?: string | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerClienteQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerClienteQuery = {
  __typename?: 'Query';
  obtenerCliente?: {
    __typename?: 'Cliente';
    id?: string | null;
    tipo?: string | null;
    nombre?: string | null;
    nombreFacturacion?: string | null;
    codigo?: string | null;
    pais?: string | null;
    ciudad?: string | null;
    city?: string | null;
    calle?: string | null;
    cp?: string | null;
    direccion?: string | null;
    estado?: Estado | null;
    credito?: Credito | null;
    telefonos?: Array<{
      __typename?: 'Telefono';
      telefono?: string | null;
      ext?: string | null;
      descripcion?: string | null;
    } | null> | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    redes?: Array<{
      __typename?: 'RedSocial';
      red?: string | null;
      enlace?: string | null;
    } | null> | null;
  } | null;
};

export type InsertarClienteMutationVariables = Exact<{
  input?: InputMaybe<ClienteInput>;
}>;

export type InsertarClienteMutation = {
  __typename?: 'Mutation';
  insertarCliente?: {
    __typename?: 'RespuestaCliente';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarClienteMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ClienteInput>;
}>;

export type ActualizarClienteMutation = {
  __typename?: 'Mutation';
  actualizarCliente?: {
    __typename?: 'RespuestaCliente';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarClienteMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarClienteMutation = {
  __typename?: 'Mutation';
  desactivarCliente?: {
    __typename?: 'RespuestaCliente';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerComandasFullQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerComandasFullQuery = {
  __typename?: 'Query';
  obtenerComandas?: Array<{
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    fechaGenerada?: any | null;
    fechaFinalizada?: any | null;
    preFactura?: boolean | null;
    estado?: EstadoComanda | null;
    mesa?: { __typename?: 'Mesa'; id?: string | null } | null;
    subcuentas?: Array<{
      __typename?: 'Subcuenta';
      id?: string | null;
      numero?: any | null;
      fecha?: any | null;
      fechaGenerada?: any | null;
      fechaFinalizada?: any | null;
      descuento?: any | null;
      total?: any | null;
      moneda?: string | null;
      estado?: SubcuentaEstado | null;
      cliente?: {
        __typename?: 'Cliente';
        id?: string | null;
        nombre?: string | null;
        correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
        telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
      } | null;
      platillos?: Array<{
        __typename?: 'Platillos';
        id?: string | null;
        nombre?: string | null;
        precio?: any | null;
        descuento?: any | null;
        anulacionPendiente?: boolean | null;
      } | null> | null;
      formaPago?: Array<{
        __typename?: 'FormaPago';
        monto?: any | null;
        moneda?: string | null;
        tipo?: { __typename?: 'TipoMetodoPago'; id?: string | null; nombre?: string | null } | null;
      } | null> | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerComandasPartialQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerComandasPartialQuery = {
  __typename?: 'Query';
  obtenerComandas?: Array<{
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    fechaGenerada?: any | null;
    fechaFinalizada?: any | null;
    mesa?: {
      __typename?: 'Mesa';
      id?: string | null;
      numero?: number | null;
      tipo?: ETipoMesa | null;
      piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
    } | null;
    subcuentas?: Array<{
      __typename?: 'Subcuenta';
      id?: string | null;
      fecha?: any | null;
      fechaGenerada?: any | null;
      fechaFinalizada?: any | null;
      platillos?: Array<{
        __typename?: 'Platillos';
        _id?: string | null;
        id?: string | null;
        nombre?: string | null;
        estado?: PlatilloEstado | null;
        anulacionPendiente?: boolean | null;
        observaciones?: string | null;
        puesto?: string | null;
      } | null> | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerComandasPendientesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerComandasPendientesQuery = {
  __typename?: 'Query';
  obtenerComandasPendientes?: Array<{
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    fechaGenerada?: any | null;
    fechaFinalizada?: any | null;
    mesa?: {
      __typename?: 'Mesa';
      id?: string | null;
      numero?: number | null;
      tipo?: ETipoMesa | null;
      piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
    } | null;
    subcuentas?: Array<{
      __typename?: 'Subcuenta';
      id?: string | null;
      fecha?: any | null;
      fechaGenerada?: any | null;
      fechaFinalizada?: any | null;
      platillos?: Array<{
        __typename?: 'Platillos';
        _id?: string | null;
        id?: string | null;
        nombre?: string | null;
        estado?: PlatilloEstado | null;
        anulacionPendiente?: boolean | null;
        observaciones?: string | null;
        puesto?: string | null;
      } | null> | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerComandasPendientesParaCocinaQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerComandasPendientesParaCocinaQuery = {
  __typename?: 'Query';
  obtenerComandasPendientesParaCocina?: Array<{
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    fechaGenerada?: any | null;
    fechaFinalizada?: any | null;
    fechaEnPreparacion?: any | null;
    fechaEntregada?: any | null;
    mesa?: {
      __typename?: 'Mesa';
      id?: string | null;
      numero?: number | null;
      tipo?: ETipoMesa | null;
      piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
    } | null;
    subcuentas?: Array<{
      __typename?: 'Subcuenta';
      id?: string | null;
      fecha?: any | null;
      fechaGenerada?: any | null;
      fechaFinalizada?: any | null;
      platillos?: Array<{
        __typename?: 'Platillos';
        _id?: string | null;
        id?: string | null;
        nombre?: string | null;
        estado?: PlatilloEstado | null;
        anulacionPendiente?: boolean | null;
        observaciones?: string | null;
        puesto?: string | null;
        esParaCocina?: boolean | null;
      } | null> | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerComandaByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerComandaByIdQuery = {
  __typename?: 'Query';
  obtenerComandaById?: {
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    fechaGenerada?: any | null;
    fechaFinalizada?: any | null;
    preFactura?: boolean | null;
    estado?: EstadoComanda | null;
    mesa?: { __typename?: 'Mesa'; id?: string | null } | null;
    subcuentas?: Array<{
      __typename?: 'Subcuenta';
      id?: string | null;
      numero?: any | null;
      fecha?: any | null;
      fechaGenerada?: any | null;
      fechaFinalizada?: any | null;
      descuento?: any | null;
      total?: any | null;
      moneda?: string | null;
      estado?: SubcuentaEstado | null;
      cliente?: {
        __typename?: 'Cliente';
        id?: string | null;
        nombre?: string | null;
        correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
        telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
      } | null;
      platillos?: Array<{
        __typename?: 'Platillos';
        _id?: string | null;
        id?: string | null;
        nombre?: string | null;
        precio?: any | null;
        descuento?: any | null;
        estado?: PlatilloEstado | null;
        anulacionPendiente?: boolean | null;
        observaciones?: string | null;
        puesto?: string | null;
      } | null> | null;
      formaPago?: Array<{
        __typename?: 'FormaPago';
        monto?: any | null;
        moneda?: string | null;
        tipo?: { __typename?: 'TipoMetodoPago'; id?: string | null; nombre?: string | null } | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type ObtenerComandaPorMesaFullQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerComandaPorMesaFullQuery = {
  __typename?: 'Query';
  obtenerComandaPorMesa?: {
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    fechaGenerada?: any | null;
    fechaFinalizada?: any | null;
    preFactura?: boolean | null;
    estado?: EstadoComanda | null;
    mesa?: { __typename?: 'Mesa'; id?: string | null } | null;
    subcuentas?: Array<{
      __typename?: 'Subcuenta';
      id?: string | null;
      numero?: any | null;
      fecha?: any | null;
      fechaGenerada?: any | null;
      fechaFinalizada?: any | null;
      descuento?: any | null;
      total?: any | null;
      moneda?: string | null;
      estado?: SubcuentaEstado | null;
      cliente?: {
        __typename?: 'Cliente';
        id?: string | null;
        nombre?: string | null;
        correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
        telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
      } | null;
      platillos?: Array<{
        __typename?: 'Platillos';
        _id?: string | null;
        id?: string | null;
        nombre?: string | null;
        precio?: any | null;
        descuento?: any | null;
        estado?: PlatilloEstado | null;
        anulacionPendiente?: boolean | null;
        observaciones?: string | null;
        puesto?: string | null;
      } | null> | null;
      formaPago?: Array<{
        __typename?: 'FormaPago';
        monto?: any | null;
        moneda?: string | null;
        tipo?: { __typename?: 'TipoMetodoPago'; id?: string | null; nombre?: string | null } | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type InsertarComandaMutationVariables = Exact<{
  input?: InputMaybe<ComandaInput>;
}>;

export type InsertarComandaMutation = {
  __typename?: 'Mutation';
  insertarComanda?: {
    __typename?: 'RespuestaComanda';
    estado?: boolean | null;
    message?: any | null;
    data?: { __typename?: 'Comanda'; id?: string | null } | null;
  } | null;
};

export type CambiarEstadoComandaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  estado: Scalars['String']['input'];
}>;

export type CambiarEstadoComandaMutation = {
  __typename?: 'Mutation';
  cambiarEstadoComanda?: {
    __typename?: 'CambiarEstadoComandaRespuesta';
    id?: string | null;
    estado?: string | null;
    message?: string | null;
    exitoso?: boolean | null;
  } | null;
};

export type CambiarEstadoPlatillosMutationVariables = Exact<{
  subcuentaId: Scalars['ID']['input'];
  platilloIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  estado?: InputMaybe<Scalars['String']['input']>;
}>;

export type CambiarEstadoPlatillosMutation = {
  __typename?: 'Mutation';
  cambiarEstadoPlatillos?: {
    __typename?: 'CambiarEstadoComandaRespuesta';
    id?: string | null;
    estado?: string | null;
    message?: string | null;
    exitoso?: boolean | null;
  } | null;
};

export type ActualizarComandaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ComandaInput>;
}>;

export type ActualizarComandaMutation = {
  __typename?: 'Mutation';
  actualizarComanda?: {
    __typename?: 'RespuestaComanda';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type FinalizarComandaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type FinalizarComandaMutation = {
  __typename?: 'Mutation';
  finalizarComanda?: {
    __typename?: 'RespuestaComanda';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarComandaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarComandaMutation = {
  __typename?: 'Mutation';
  desactivarComanda?: {
    __typename?: 'RespuestaComanda';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerComodidadesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerComodidadesQuery = {
  __typename?: 'Query';
  obtenerComodidades?: Array<{
    __typename?: 'Comodidades';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: string | null;
  } | null> | null;
};

export type ObtenerComodidadByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerComodidadByIdQuery = {
  __typename?: 'Query';
  obtenerComodidadById?: {
    __typename?: 'Comodidades';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: string | null;
  } | null;
};

export type InsertarComodidadMutationVariables = Exact<{
  input?: InputMaybe<ComodidadesInput>;
}>;

export type InsertarComodidadMutation = {
  __typename?: 'Mutation';
  insertarComodidad?: {
    __typename?: 'RespuestaComodidades';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarComodidadMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ComodidadesInput>;
}>;

export type ActualizarComodidadMutation = {
  __typename?: 'Mutation';
  actualizarComodidad?: {
    __typename?: 'RespuestaComodidades';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarComodidadMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarComodidadMutation = {
  __typename?: 'Mutation';
  desactivarComodidad?: {
    __typename?: 'RespuestaComodidades';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerFacturasEmitidasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerFacturasEmitidasQuery = {
  __typename?: 'Query';
  obtenerFacturasEmitidas?: Array<{
    __typename?: 'FacturaEmitida';
    id?: string | null;
    result?: boolean | null;
    items?: any | null;
    response?: {
      __typename?: 'FacturaEmitidaResponse';
      Id?: string | null;
      Cliente?: number | null;
      NumeroConsecutivo?: string | null;
      Clave?: string | null;
      CodigoRespuesta?: number | null;
      Mensaje?: string | null;
      Fecha?: any | null;
    } | null;
    data?: {
      __typename?: 'Data';
      CodigoCliente?: string | null;
      DocElectronicos?: Array<{
        __typename?: 'DocElectronicos';
        InformacionReferencia?: any | null;
        Encabezado?: {
          __typename?: 'Encabezado';
          TipoDocumento?: string | null;
          SecuenciaControlada?: number | null;
          NumeroConsecutivo?: string | null;
          Clave?: string | null;
          SecuenciaDocumento?: number | null;
          Sucursal?: number | null;
          Terminal?: number | null;
          SituacionEnvio?: number | null;
          CodigoActividad?: string | null;
          CantDeci?: number | null;
          FechaEmision?: string | null;
          CondicionVenta?: string | null;
          PlazoCredito?: number | null;
          MedioPago?: Array<string | null> | null;
          TipoCambio?: number | null;
          CodigoMoneda?: string | null;
          Receptor?: {
            __typename?: 'Receptor';
            Nombre?: string | null;
            IdentificacionTipo?: string | null;
            IdentificacionNumero?: string | null;
            NombreComercial?: string | null;
            CorreoElectronico?: string | null;
            CorreoElectronicoCC?: string | null;
            FaxArea?: number | null;
            FaxNumero?: number | null;
          } | null;
        } | null;
        LineasDetalle?: Array<{
          __typename?: 'LineasDetalle';
          EsServicio?: number | null;
          CodigoCabys?: number | null;
          CodigoTipo?: Array<number | null> | null;
          Codigo?: Array<string | null> | null;
          PartidaArancelaria?: string | null;
          Cantidad?: number | null;
          UnidadMedida?: number | null;
          UnidadMedidaComercial?: string | null;
          Detalle?: string | null;
          PrecioUnitario?: number | null;
          DescripcionExtra?: string | null;
          Descuento?: number | null;
          DetalleDescuento?: string | null;
          Descuentos?: string | null;
          BaseImponible?: number | null;
          Impuestos?: Array<{
            __typename?: 'Impuestos';
            Codigo?: number | null;
            CodigoTarifa?: string | null;
            Tarifa?: number | null;
            FactorIVA?: number | null;
            MontoExportacion?: number | null;
            Exoneracion?: string | null;
          } | null> | null;
        } | null> | null;
      } | null> | null;
    } | null;
  } | null> | null;
};

export type ObtenerFacturasParametrosByTypeQueryVariables = Exact<{
  type?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerFacturasParametrosByTypeQuery = {
  __typename?: 'Query';
  obtenerFacturasParametrosByType?: Array<{
    __typename?: 'FacturasParametro';
    id?: string | null;
    value?: string | null;
    type?: string | null;
  } | null> | null;
};

export type ObtenerFacturasParametrosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerFacturasParametrosQuery = {
  __typename?: 'Query';
  obtenerFacturasParametros?: Array<{
    __typename?: 'FacturasParametro';
    id?: string | null;
    value?: string | null;
    type?: string | null;
  } | null> | null;
};

export type UpsertFacturasParametroMutationVariables = Exact<{
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
}>;

export type UpsertFacturasParametroMutation = {
  __typename?: 'Mutation';
  upsertFacturasParametro?: {
    __typename?: 'FacturasParametro';
    id?: string | null;
    type?: string | null;
    value?: string | null;
  } | null;
};

export type ObtenerGestionesCajaQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerGestionesCajaQuery = {
  __typename?: 'Query';
  obtenerGestionesCaja?: Array<{
    __typename?: 'GestionCaja';
    id?: string | null;
    caja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora_apertura?: string | null;
    hora_cierre?: string | null;
    datos_inicio_usuario?: any | null;
    datos_cierre_usuario?: any | null;
    datos_cierre_sistema?: any | null;
    observaciones?: string | null;
    usuario?: { __typename?: 'UsuarioCaja'; nombre?: string | null; cedula?: string | null } | null;
    administrador?: {
      __typename?: 'UsuarioCaja';
      nombre?: string | null;
      cedula?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerGestionesPorCajaQueryVariables = Exact<{
  caja: Scalars['ID']['input'];
}>;

export type ObtenerGestionesPorCajaQuery = {
  __typename?: 'Query';
  obtenerGestionesPorCaja?: Array<{
    __typename?: 'GestionCaja';
    id?: string | null;
    caja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora_apertura?: string | null;
    hora_cierre?: string | null;
    datos_inicio_usuario?: any | null;
    datos_cierre_usuario?: any | null;
    datos_cierre_sistema?: any | null;
    observaciones?: string | null;
    usuario?: { __typename?: 'UsuarioCaja'; nombre?: string | null; cedula?: string | null } | null;
    administrador?: {
      __typename?: 'UsuarioCaja';
      nombre?: string | null;
      cedula?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerGestionCajaByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type ObtenerGestionCajaByIdQuery = {
  __typename?: 'Query';
  obtenerGestionCajaById?: {
    __typename?: 'GestionCaja';
    id?: string | null;
    caja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora_apertura?: string | null;
    hora_cierre?: string | null;
    datos_inicio_usuario?: any | null;
    datos_cierre_usuario?: any | null;
    datos_cierre_sistema?: any | null;
    observaciones?: string | null;
    usuario?: { __typename?: 'UsuarioCaja'; nombre?: string | null; cedula?: string | null } | null;
    administrador?: {
      __typename?: 'UsuarioCaja';
      nombre?: string | null;
      cedula?: string | null;
    } | null;
  } | null;
};

export type ObtenerGestionActualQueryVariables = Exact<{
  caja: Scalars['ID']['input'];
}>;

export type ObtenerGestionActualQuery = {
  __typename?: 'Query';
  obtenerGestionActual?: {
    __typename?: 'GestionCaja';
    id?: string | null;
    caja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora_apertura?: string | null;
    hora_cierre?: string | null;
    datos_inicio_usuario?: any | null;
    datos_cierre_usuario?: any | null;
    datos_cierre_sistema?: any | null;
    observaciones?: string | null;
    usuario?: { __typename?: 'UsuarioCaja'; nombre?: string | null; cedula?: string | null } | null;
    administrador?: {
      __typename?: 'UsuarioCaja';
      nombre?: string | null;
      cedula?: string | null;
    } | null;
  } | null;
};

export type ObtenerGestionesPorRangoFechaQueryVariables = Exact<{
  caja?: InputMaybe<Scalars['ID']['input']>;
  fechaInicio?: InputMaybe<Scalars['String']['input']>;
  fechaFin?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerGestionesPorRangoFechaQuery = {
  __typename?: 'Query';
  obtenerGestionesPorRangoFecha?: Array<{
    __typename?: 'GestionCaja';
    id?: string | null;
    caja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora_apertura?: string | null;
    hora_cierre?: string | null;
    datos_inicio_usuario?: any | null;
    datos_cierre_usuario?: any | null;
    datos_cierre_sistema?: any | null;
    observaciones?: string | null;
    usuario?: { __typename?: 'UsuarioCaja'; nombre?: string | null; cedula?: string | null } | null;
    administrador?: {
      __typename?: 'UsuarioCaja';
      nombre?: string | null;
      cedula?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerMovimientosGestionesPorRangoFechaQueryVariables = Exact<{
  caja?: InputMaybe<Scalars['ID']['input']>;
  fechaInicio?: InputMaybe<Scalars['String']['input']>;
  fechaFin?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerMovimientosGestionesPorRangoFechaQuery = {
  __typename?: 'Query';
  obtenerMovimientosGestionesPorRangoFecha?: Array<{
    __typename?: 'GestionCajaConMovimientos';
    gestion?: {
      __typename?: 'GestionCaja';
      id?: string | null;
      fecha?: string | null;
      usuario?: { __typename?: 'UsuarioCaja'; nombre?: string | null } | null;
    } | null;
    movimientos?: Array<{
      __typename?: 'MovimientoCaja';
      id: string;
      tipo?: string | null;
      monto?: number | null;
      fecha?: string | null;
      medioPago?: string | null;
      codigoMoneda?: string | null;
      observaciones?: string | null;
    } | null> | null;
  } | null> | null;
};

export type AperturaCajaMutationVariables = Exact<{
  input?: InputMaybe<GestionCajaInput>;
}>;

export type AperturaCajaMutation = {
  __typename?: 'Mutation';
  aperturaCaja?: {
    __typename?: 'RespuestaGestionCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CierreParcialCajaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input: GestionCajaInput;
}>;

export type CierreParcialCajaMutation = {
  __typename?: 'Mutation';
  cierreParcialCaja?: {
    __typename?: 'RespuestaGestionCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CierreCajaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input: GestionCajaCierreInput;
}>;

export type CierreCajaMutation = {
  __typename?: 'Mutation';
  cierreCaja?: {
    __typename?: 'RespuestaGestionCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerHabitacionesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerHabitacionesQuery = {
  __typename?: 'Query';
  obtenerHabitaciones?: Array<{
    __typename?: 'Habitaciones';
    id?: string | null;
    numeroHabitacion?: string | null;
    precioPorNoche?: any | null;
    descripcion?: string | null;
    capacidad?: any | null;
    tipoCama?: string | null;
    petFriendly?: boolean | null;
    petQuantity?: any | null;
    estado?: string | null;
    tipoHabitacion?: {
      __typename?: 'TipoHabitacion';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      precioBase?: any | null;
    } | null;
    comodidades?: Array<{
      __typename?: 'Comodidades';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerHabitacionByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerHabitacionByIdQuery = {
  __typename?: 'Query';
  obtenerHabitacionById?: {
    __typename?: 'Habitaciones';
    id?: string | null;
    numeroHabitacion?: string | null;
    precioPorNoche?: any | null;
    descripcion?: string | null;
    capacidad?: any | null;
    tipoCama?: string | null;
    petFriendly?: boolean | null;
    petQuantity?: any | null;
    estado?: string | null;
    tipoHabitacion?: {
      __typename?: 'TipoHabitacion';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      precioBase?: any | null;
    } | null;
    comodidades?: Array<{
      __typename?: 'Comodidades';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
    } | null> | null;
  } | null;
};

export type ObtenerHabitacionesDisponiblesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerHabitacionesDisponiblesQuery = {
  __typename?: 'Query';
  obtenerHabitacionesDisponibles?: Array<{
    __typename?: 'Habitaciones';
    id?: string | null;
    numeroHabitacion?: string | null;
    precioPorNoche?: any | null;
    descripcion?: string | null;
    capacidad?: any | null;
    tipoCama?: string | null;
    petFriendly?: boolean | null;
    petQuantity?: any | null;
    estado?: string | null;
    tipoHabitacion?: {
      __typename?: 'TipoHabitacion';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      precioBase?: any | null;
    } | null;
    comodidades?: Array<{
      __typename?: 'Comodidades';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
    } | null> | null;
  } | null> | null;
};

export type InsertarHabitacionMutationVariables = Exact<{
  input?: InputMaybe<HabitacionesInput>;
}>;

export type InsertarHabitacionMutation = {
  __typename?: 'Mutation';
  insertarHabitacion?: {
    __typename?: 'RespuestaHabitaciones';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarHabitacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<HabitacionesInput>;
}>;

export type ActualizarHabitacionMutation = {
  __typename?: 'Mutation';
  actualizarHabitacion?: {
    __typename?: 'RespuestaHabitaciones';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarHabitacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarHabitacionMutation = {
  __typename?: 'Mutation';
  desactivarHabitacion?: {
    __typename?: 'RespuestaHabitaciones';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerImpuestosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerImpuestosQuery = {
  __typename?: 'Query';
  obtenerImpuestos?: Array<{
    __typename?: 'Impuesto';
    id?: string | null;
    nombre?: string | null;
    valor?: any | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerImpuestoByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerImpuestoByIdQuery = {
  __typename?: 'Query';
  obtenerImpuestoById?: {
    __typename?: 'Impuesto';
    id?: string | null;
    nombre?: string | null;
    valor?: any | null;
    estado?: Estado | null;
  } | null;
};

export type ObtenerImpuestoByNombreQueryVariables = Exact<{
  nombre?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerImpuestoByNombreQuery = {
  __typename?: 'Query';
  obtenerImpuestoByNombre?: {
    __typename?: 'Impuesto';
    id?: string | null;
    nombre?: string | null;
    valor?: any | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarImpuestoMutationVariables = Exact<{
  input?: InputMaybe<ImpuestoInput>;
}>;

export type InsertarImpuestoMutation = {
  __typename?: 'Mutation';
  insertarImpuesto?: {
    __typename?: 'RespuestaImpuesto';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarImpuestoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ImpuestoInput>;
}>;

export type ActualizarImpuestoMutation = {
  __typename?: 'Mutation';
  actualizarImpuesto?: {
    __typename?: 'RespuestaImpuesto';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarImpuestoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarImpuestoMutation = {
  __typename?: 'Mutation';
  desactivarImpuesto?: {
    __typename?: 'RespuestaImpuesto';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerItemsQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerItemsQuery = {
  __typename?: 'Query';
  obtenerItems?: Array<{
    __typename?: 'Data_Items';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
  } | null> | null;
};

export type ObtenerItemQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerItemQuery = {
  __typename?: 'Query';
  obtenerItem?: {
    __typename?: 'Data_Items';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
  } | null;
};

export type InsertarItemMutationVariables = Exact<{
  input?: InputMaybe<ItemsInput>;
}>;

export type InsertarItemMutation = {
  __typename?: 'Mutation';
  insertarItem?: {
    __typename?: 'RespuestaItems';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarItemMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ItemsInput>;
}>;

export type ActualizarItemMutation = {
  __typename?: 'Mutation';
  actualizarItem?: {
    __typename?: 'RespuestaItems';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarItemMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarItemMutation = {
  __typename?: 'Mutation';
  desactivarItem?: {
    __typename?: 'RespuestaItems';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarLineaOrdenCompraMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<LineaOrdenCompraInput>;
}>;

export type ActualizarLineaOrdenCompraMutation = {
  __typename?: 'Mutation';
  actualizarLineaOrdenCompra?: {
    __typename?: 'RespuestaLineaOrdenCompra';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarLineaOrdenCompraMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  idOrden?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarLineaOrdenCompraMutation = {
  __typename?: 'Mutation';
  desactivarLineaOrdenCompra?: {
    __typename?: 'RespuestaLineaOrdenCompra';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerLineasRecepcionPedidoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineasRecepcionPedidoQuery = {
  __typename?: 'Query';
  obtenerLineasRecepcionPedido?: Array<{
    __typename?: 'LineasRecepcionPedido';
    id?: string | null;
    estado?: Estado | null;
    precioUnitario?: any | null;
    cantidadSolicitada?: any | null;
    cantidadRecibida?: any | null;
    porcentajeDescuento?: any | null;
    descuento?: any | null;
    montoImpuestos?: any | null;
    subtotalSinImpuesto?: any | null;
    subtotalConImpuesto?: any | null;
    producto?: { __typename?: 'MateriaPrima'; id?: string | null; nombre?: string | null } | null;
    recepcion?: { __typename?: 'RecepcionProductos'; id?: string | null } | null;
    impuesto?: {
      __typename?: 'Impuesto';
      id?: string | null;
      nombre?: string | null;
      valor?: any | null;
    } | null;
    almacen?: {
      __typename?: 'Almacen';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: Estado | null;
    } | null;
  } | null> | null;
};

export type ObtenerLineaRecepcionPedidoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineaRecepcionPedidoQuery = {
  __typename?: 'Query';
  obtenerLineaRecepcionPedido?: {
    __typename?: 'LineasRecepcionPedido';
    id?: string | null;
    estado?: Estado | null;
    precioUnitario?: any | null;
    cantidadSolicitada?: any | null;
    cantidadRecibida?: any | null;
    porcentajeDescuento?: any | null;
    descuento?: any | null;
    montoImpuestos?: any | null;
    subtotalSinImpuesto?: any | null;
    subtotalConImpuesto?: any | null;
    producto?: { __typename?: 'MateriaPrima'; id?: string | null; nombre?: string | null } | null;
    recepcion?: { __typename?: 'RecepcionProductos'; id?: string | null } | null;
    impuesto?: {
      __typename?: 'Impuesto';
      id?: string | null;
      nombre?: string | null;
      valor?: any | null;
    } | null;
    almacen?: {
      __typename?: 'Almacen';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: Estado | null;
    } | null;
  } | null;
};

export type ActualizarCantidadRecibidaLineaRecepcionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Number']['input']>;
  almacen?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ActualizarCantidadRecibidaLineaRecepcionMutation = {
  __typename?: 'Mutation';
  actualizarCantidadRecibidaLineaRecepcion?: {
    __typename?: 'RespuestaLineasRecepcionPedido';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerMateriasPrimasQueryVariables = Exact<{
  tipo?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerMateriasPrimasQuery = {
  __typename?: 'Query';
  obtenerMateriasPrimas?: Array<{
    __typename?: 'MateriaPrima';
    id?: string | null;
    nombre?: string | null;
    pais?: string | null;
    unidad?: Unidad | null;
    existencias?: any | null;
    estado?: Estado | null;
    tipo?: TipoMateriaPrima | null;
    precioCompra?: any | null;
  } | null> | null;
};

export type ObtenerTodasMateriasPrimasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTodasMateriasPrimasQuery = {
  __typename?: 'Query';
  obtenerTodasMateriasPrimas?: Array<{
    __typename?: 'MateriaPrima';
    id?: string | null;
    nombre?: string | null;
    pais?: string | null;
    unidad?: Unidad | null;
    existencias?: any | null;
    estado?: Estado | null;
    tipo?: TipoMateriaPrima | null;
    referenciaInterna?: string | null;
    codigoBarras?: string | null;
    codigoCabys?: string | null;
    descripcion?: string | null;
    precioCompra?: any | null;
    precioCostoPromedio?: any | null;
    margen?: any | null;
    impuestos?: Array<{
      __typename?: 'LineaImpuestos';
      impuesto?: string | null;
      aplicaVentas?: boolean | null;
      aplicaCompras?: boolean | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerMateriasPrimasConMovimientosQueryVariables = Exact<{
  tipo?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerMateriasPrimasConMovimientosQuery = {
  __typename?: 'Query';
  obtenerMateriasPrimasConMovimientos?: Array<{
    __typename?: 'MateriaPrimaMovimientos';
    materia_prima?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      pais?: string | null;
      unidad?: Unidad | null;
      existencias?: any | null;
      estado?: Estado | null;
      tipo?: TipoMateriaPrima | null;
    } | null;
    movimientos?: Array<{
      __typename?: 'MovimientosType';
      id?: string | null;
      tipo?: Tipo | null;
      lote?: string | null;
      fecha?: any | null;
      cantidad?: any | null;
      existencia?: any | null;
      precio?: any | null;
      precio_unidad?: any | null;
      proveedor?: {
        __typename?: 'Proveedor';
        id?: string | null;
        empresa?: string | null;
        cedula?: string | null;
      } | null;
      usuario?: {
        __typename?: 'Usuario';
        id?: string | null;
        nombre?: string | null;
        cedula?: string | null;
      } | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerMateriaPrimaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerMateriaPrimaQuery = {
  __typename?: 'Query';
  obtenerMateriaPrima?: {
    __typename?: 'MateriaPrimaConMovimientos';
    id?: string | null;
    nombre?: string | null;
    pais?: string | null;
    unidad?: Unidad | null;
    existencias?: any | null;
    estado?: Estado | null;
    tipo?: TipoMateriaPrima | null;
    referenciaInterna?: string | null;
    codigoBarras?: string | null;
    codigoCabys?: string | null;
    descripcion?: string | null;
    precioCompra?: any | null;
    precioCostoPromedio?: any | null;
    margen?: any | null;
    impuestos?: Array<{
      __typename?: 'LineaImpuestos';
      impuesto?: string | null;
      aplicaVentas?: boolean | null;
      aplicaCompras?: boolean | null;
    } | null> | null;
    movimientos?: Array<{
      __typename?: 'MovimientosType';
      id?: string | null;
      tipo?: Tipo | null;
      lote?: string | null;
      fecha?: any | null;
      cantidad?: any | null;
      existencia?: any | null;
      precio?: any | null;
      precio_unidad?: any | null;
      proveedor?: {
        __typename?: 'Proveedor';
        id?: string | null;
        empresa?: string | null;
        cedula?: string | null;
      } | null;
      usuario?: {
        __typename?: 'Usuario';
        id?: string | null;
        nombre?: string | null;
        cedula?: string | null;
      } | null;
    } | null> | null;
  } | null;
};

export type ObtenerMateriasPrimasReporteQueryVariables = Exact<{
  unidad?: InputMaybe<Scalars['String']['input']>;
  minimo?: InputMaybe<Scalars['Number']['input']>;
  maximo?: InputMaybe<Scalars['Number']['input']>;
}>;

export type ObtenerMateriasPrimasReporteQuery = {
  __typename?: 'Query';
  obtenerMateriasPrimasReporte?: Array<{
    __typename?: 'MateriaPrimaReporte';
    nombre?: string | null;
    pais?: string | null;
    unidad?: Unidad | null;
    existencias?: any | null;
  } | null> | null;
};

export type ObtenerMateriasPrimasDeOrdenesQueryVariables = Exact<{
  proveedorId?: InputMaybe<Scalars['ID']['input']>;
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
  unidad?: InputMaybe<Scalars['String']['input']>;
  minimo?: InputMaybe<Scalars['Number']['input']>;
  maximo?: InputMaybe<Scalars['Number']['input']>;
}>;

export type ObtenerMateriasPrimasDeOrdenesQuery = {
  __typename?: 'Query';
  obtenerMateriasPrimasDeOrdenes?: Array<{
    __typename?: 'MateriaPrimaReporte';
    nombre?: string | null;
    pais?: string | null;
    unidad?: Unidad | null;
    existencias?: any | null;
  } | null> | null;
};

export type InsertarMateriaPrimaMutationVariables = Exact<{
  input?: InputMaybe<MateriaPrimaInput>;
}>;

export type InsertarMateriaPrimaMutation = {
  __typename?: 'Mutation';
  insertarMateriaPrima?: {
    __typename?: 'RespuestaMateriaPrima';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarMateriaPrimaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MateriaPrimaInput>;
}>;

export type ActualizarMateriaPrimaMutation = {
  __typename?: 'Mutation';
  actualizarMateriaPrima?: {
    __typename?: 'RespuestaMateriaPrima';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarExistenciasMateriaPrimaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Number']['input']>;
}>;

export type ActualizarExistenciasMateriaPrimaMutation = {
  __typename?: 'Mutation';
  actualizarExistenciasMateriaPrima?: {
    __typename?: 'RespuestaMateriaPrima';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarMateriaPrimaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarMateriaPrimaMutation = {
  __typename?: 'Mutation';
  desactivarMateriaPrima?: {
    __typename?: 'RespuestaMateriaPrima';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerLineasMenuQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineasMenuQuery = {
  __typename?: 'Query';
  obtenerLineasMenu?: Array<{
    __typename?: 'MenuLinea';
    id?: string | null;
    cantidad?: any | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      pais?: string | null;
      unidad?: Unidad | null;
      existencias?: any | null;
      estado?: Estado | null;
      tipo?: TipoMateriaPrima | null;
      precioCompra?: any | null;
      precioCostoPromedio?: any | null;
    } | null;
    menu?: {
      __typename?: 'Menu';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: string | null;
      precioCosto?: any | null;
      porcentajeGanancia?: any | null;
      tipoPlatillo?: {
        __typename?: 'TipoPlatillo';
        id?: string | null;
        nombre?: string | null;
      } | null;
      tipoMenu?: Array<{
        __typename?: 'TipoMenu';
        id?: string | null;
        nombre?: string | null;
      } | null> | null;
    } | null;
  } | null> | null;
};

export type ObtenerLineaMenuQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineaMenuQuery = {
  __typename?: 'Query';
  obtenerLineaMenu?: {
    __typename?: 'MenuLinea';
    id?: string | null;
    cantidad?: any | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      unidad?: Unidad | null;
      precioCostoPromedio?: any | null;
    } | null;
    menu?: {
      __typename?: 'Menu';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: string | null;
      precioCosto?: any | null;
      tipoPlatillo?: {
        __typename?: 'TipoPlatillo';
        id?: string | null;
        nombre?: string | null;
      } | null;
      tipoMenu?: Array<{
        __typename?: 'TipoMenu';
        id?: string | null;
        nombre?: string | null;
      } | null> | null;
    } | null;
  } | null;
};

export type InsertarLineaMenuMutationVariables = Exact<{
  input?: InputMaybe<MenuLineaInput>;
}>;

export type InsertarLineaMenuMutation = {
  __typename?: 'Mutation';
  insertarLineaMenu?: {
    __typename?: 'RespuestaMenuLinea';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarLineaMenuMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MenuLineaInput>;
}>;

export type ActualizarLineaMenuMutation = {
  __typename?: 'Mutation';
  actualizarLineaMenu?: {
    __typename?: 'RespuestaMenuLinea';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarLineaMenuMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarLineaMenuMutation = {
  __typename?: 'Mutation';
  desactivarLineaMenu?: {
    __typename?: 'RespuestaMenuLinea';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerMenusQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerMenusQuery = {
  __typename?: 'Query';
  obtenerMenus?: Array<{
    __typename?: 'Menu';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: string | null;
    precioCosto?: any | null;
    porcentajeGanancia?: any | null;
    tipoPlatillo?: {
      __typename?: 'TipoPlatillo';
      id?: string | null;
      nombre?: string | null;
    } | null;
    tipoMenu?: Array<{
      __typename?: 'TipoMenu';
      id?: string | null;
      nombre?: string | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerMenuQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerMenuQuery = {
  __typename?: 'Query';
  obtenerMenu?: {
    __typename?: 'Menu';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    estado?: string | null;
    precioCosto?: any | null;
    porcentajeGanancia?: any | null;
    tipoPlatillo?: {
      __typename?: 'TipoPlatillo';
      id?: string | null;
      nombre?: string | null;
    } | null;
    tipoMenu?: Array<{
      __typename?: 'TipoMenu';
      id?: string | null;
      nombre?: string | null;
    } | null> | null;
  } | null;
};

export type InsertarMenuMutationVariables = Exact<{
  input?: InputMaybe<MenuInput>;
  lineasInput?: InputMaybe<Array<InputMaybe<MenuLineaInput2>> | InputMaybe<MenuLineaInput2>>;
}>;

export type InsertarMenuMutation = {
  __typename?: 'Mutation';
  insertarMenu?: {
    __typename?: 'RespuestaMenu';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarMenuMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MenuInput>;
}>;

export type ActualizarMenuMutation = {
  __typename?: 'Mutation';
  actualizarMenu?: {
    __typename?: 'RespuestaMenu';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarMenuMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarMenuMutation = {
  __typename?: 'Mutation';
  desactivarMenu?: {
    __typename?: 'RespuestaMenu';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerMesasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerMesasQuery = {
  __typename?: 'Query';
  obtenerMesas?: Array<{
    __typename?: 'Mesa';
    id?: string | null;
    numero?: number | null;
    tipo?: ETipoMesa | null;
    estado?: Estado | null;
    temporizador?: number | null;
    piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
    ubicacion?: { __typename?: 'Ubicacion'; x?: number | null; y?: number | null } | null;
  } | null> | null;
};

export type ObtenerMesaByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerMesaByIdQuery = {
  __typename?: 'Query';
  obtenerMesaById?: {
    __typename?: 'Mesa';
    id?: string | null;
    numero?: number | null;
    tipo?: ETipoMesa | null;
    estado?: Estado | null;
    temporizador?: number | null;
    piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
    ubicacion?: { __typename?: 'Ubicacion'; x?: number | null; y?: number | null } | null;
  } | null;
};

export type ObtenerComandaPorMesaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerComandaPorMesaQuery = {
  __typename?: 'Query';
  obtenerComandaPorMesa?: {
    __typename?: 'Comanda';
    id?: string | null;
    fecha?: any | null;
    preFactura?: boolean | null;
    estado?: EstadoComanda | null;
    mesa?: { __typename?: 'Mesa'; id?: string | null } | null;
    subcuentas?: Array<{ __typename?: 'Subcuenta'; id?: string | null } | null> | null;
  } | null;
};

export type InsertarMesaMutationVariables = Exact<{
  input?: InputMaybe<MesaInput>;
}>;

export type InsertarMesaMutation = {
  __typename?: 'Mutation';
  insertarMesa?: {
    __typename?: 'RespuestaMesa';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarMesaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MesaInput>;
}>;

export type ActualizarMesaMutation = {
  __typename?: 'Mutation';
  actualizarMesa?: {
    __typename?: 'RespuestaMesa';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarMesaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarMesaMutation = {
  __typename?: 'Mutation';
  desactivarMesa?: {
    __typename?: 'RespuestaMesa';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerMovimientosActivosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerMovimientosActivosQuery = {
  __typename?: 'Query';
  obtenerMovimientosActivos?: Array<{
    __typename?: 'MovimientosActivoType';
    id?: string | null;
    tipo?: Tipo | null;
    beneficiario?: string | null;
    fecha?: any | null;
    activos?: Array<{
      __typename?: 'Activo';
      id?: string | null;
      nombre?: string | null;
      referenciaInterna?: string | null;
    } | null> | null;
    consecutivo?: {
      __typename?: 'HistorialConsecutivo';
      id?: string | null;
      consecutivo?: string | null;
    } | null;
  } | null> | null;
};

export type InsertarMovimientosActivoMutationVariables = Exact<{
  input?: InputMaybe<MovimientosActivoInput>;
}>;

export type InsertarMovimientosActivoMutation = {
  __typename?: 'Mutation';
  insertarMovimientosActivo?: {
    __typename?: 'RespuestaMovimientosActivo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerMovimientosCajasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerMovimientosCajasQuery = {
  __typename?: 'Query';
  obtenerMovimientosCajas?: Array<{
    __typename?: 'MovimientoCaja';
    id: string;
    gestionCaja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora?: string | null;
    tipo?: string | null;
    estado?: string | null;
    monto?: number | null;
    medioPago?: string | null;
    codigoMoneda?: string | null;
    modulo?: ModuloCaja | null;
  } | null> | null;
};

export type ObtenerMovimientoByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type ObtenerMovimientoByIdQuery = {
  __typename?: 'Query';
  obtenerMovimientoById?: {
    __typename?: 'MovimientoCaja';
    id: string;
    gestionCaja?: string | null;
    consecutivo?: string | null;
    fecha?: string | null;
    hora?: string | null;
    tipo?: string | null;
    estado?: string | null;
    monto?: number | null;
    medioPago?: string | null;
    codigoMoneda?: string | null;
    modulo?: ModuloCaja | null;
  } | null;
};

export type ObtenerMovimientosDeGestionQueryVariables = Exact<{
  gestionCajaId: Scalars['ID']['input'];
}>;

export type ObtenerMovimientosDeGestionQuery = {
  __typename?: 'Query';
  obtenerMovimientosDeGestion?: Array<{
    __typename?: 'MovimientoCaja';
    id: string;
    gestionCaja?: string | null;
    consecutivo?: string | null;
    observaciones?: string | null;
    fecha?: string | null;
    hora?: string | null;
    tipo?: string | null;
    estado?: string | null;
    monto?: number | null;
    medioPago?: string | null;
    codigoMoneda?: string | null;
    modulo?: ModuloCaja | null;
  } | null> | null;
};

export type RegistrarMovimientoMutationVariables = Exact<{
  gestionCaja?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<MovimientoCajaInput>;
}>;

export type RegistrarMovimientoMutation = {
  __typename?: 'Mutation';
  registrarMovimiento?: {
    __typename?: 'RespuestaMovimientoCaja';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerMovimientosRestauranteQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerMovimientosRestauranteQuery = {
  __typename?: 'Query';
  obtenerMovimientosRestaurante?: Array<{
    __typename?: 'MovimientoRestaurante';
    _id?: string | null;
    fecha: any;
    cliente?: string | null;
    nombreFacturacion: string;
    condicionVenta?: string | null;
    medioPago?: string | null;
    tipoCambio?: any | null;
    codigoMoneda?: string | null;
    numeroHabitacion?: string | null;
    reserva?: string | null;
    subtotal?: any | null;
    descuento?: any | null;
    IVA?: any | null;
    impuestoServicio?: any | null;
    total?: any | null;
    comanda: {
      __typename?: 'Comanda';
      id?: string | null;
      mesa?: { __typename?: 'Mesa'; numero?: number | null } | null;
    };
    platillos?: Array<{
      __typename?: 'Platillos';
      id?: string | null;
      nombre?: string | null;
      precio?: any | null;
      observaciones?: string | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerMovimientosPorFechaQueryVariables = Exact<{
  fechaInicio: Scalars['Date']['input'];
  fechaFin: Scalars['Date']['input'];
}>;

export type ObtenerMovimientosPorFechaQuery = {
  __typename?: 'Query';
  obtenerMovimientosPorFecha?: Array<{
    __typename?: 'MovimientoRestaurante';
    _id?: string | null;
    fecha: any;
    cliente?: string | null;
    nombreFacturacion: string;
    condicionVenta?: string | null;
    medioPago?: string | null;
    tipoCambio?: any | null;
    codigoMoneda?: string | null;
    numeroHabitacion?: string | null;
    reserva?: string | null;
    subtotal?: any | null;
    descuento?: any | null;
    IVA?: any | null;
    impuestoServicio?: any | null;
    total?: any | null;
    comanda: {
      __typename?: 'Comanda';
      id?: string | null;
      mesa?: { __typename?: 'Mesa'; numero?: number | null } | null;
    };
    platillos?: Array<{
      __typename?: 'Platillos';
      id?: string | null;
      nombre?: string | null;
      precio?: any | null;
      observaciones?: string | null;
    } | null> | null;
  } | null> | null;
};

export type InsertarMovimientoRestauranteMutationVariables = Exact<{
  input?: InputMaybe<MovimientoRestauranteInput>;
}>;

export type InsertarMovimientoRestauranteMutation = {
  __typename?: 'Mutation';
  insertarMovimientoRestaurante?: {
    __typename?: 'RespuestaMovimientoRestaurante';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerReporteComandaQueryVariables = Exact<{
  fechaInicio: Scalars['Date']['input'];
  fechaFin: Scalars['Date']['input'];
}>;

export type ObtenerReporteComandaQuery = {
  __typename?: 'Query';
  obtenerReporteComanda?: Array<{
    __typename?: 'ComandaReport';
    _id?: string | null;
    fecha?: any | null;
    fechaFinalizada?: any | null;
    mesa?: { __typename?: 'Mesa'; numero?: number | null } | null;
  } | null> | null;
};

export type ObtenerReporteGastosGerenciaQueryVariables = Exact<{
  fechaInicio: Scalars['Date']['input'];
  fechaFin: Scalars['Date']['input'];
}>;

export type ObtenerReporteGastosGerenciaQuery = {
  __typename?: 'Query';
  obtenerReporteGastosGerencia?: Array<{
    __typename?: 'MovimientoRestaurante';
    _id?: string | null;
    fecha: any;
    nombreFacturacion: string;
    total?: any | null;
    descuento?: any | null;
    comanda: {
      __typename?: 'Comanda';
      mesa?: { __typename?: 'Mesa'; numero?: number | null } | null;
    };
  } | null> | null;
};

export type ObtenerReporteMovimientosConDescuentoQueryVariables = Exact<{
  fechaInicio: Scalars['Date']['input'];
  fechaFin: Scalars['Date']['input'];
}>;

export type ObtenerReporteMovimientosConDescuentoQuery = {
  __typename?: 'Query';
  obtenerReporteMovimientosConDescuento?: Array<{
    __typename?: 'MovimientoRestaurante';
    _id?: string | null;
    fecha: any;
    nombreFacturacion: string;
    total?: any | null;
    descuento?: any | null;
    comanda: {
      __typename?: 'Comanda';
      mesa?: { __typename?: 'Mesa'; numero?: number | null } | null;
    };
  } | null> | null;
};

export type ObtenerReporteVentasQueryVariables = Exact<{
  fechaInicio: Scalars['Date']['input'];
  fechaFin: Scalars['Date']['input'];
}>;

export type ObtenerReporteVentasQuery = {
  __typename?: 'Query';
  obtenerReporteVentas?: Array<{
    __typename?: 'MovimientoRestaurante';
    _id?: string | null;
    fecha: any;
    total?: any | null;
    descuento?: any | null;
  } | null> | null;
};

export type ObtenerReporteAnulacionesConDecisionQueryVariables = Exact<{
  fechaInicio: Scalars['Date']['input'];
  fechaFin: Scalars['Date']['input'];
}>;

export type ObtenerReporteAnulacionesConDecisionQuery = {
  __typename?: 'Query';
  obtenerReporteAnulacionesConDecision?: Array<{
    __typename?: 'ReporteAnulacionConDecision';
    _id?: string | null;
    fecha?: any | null;
    platillo?: string | null;
    motivo?: string | null;
    usuarioAnulo?: string | null;
    monto?: any | null;
    accion?: string | null;
    estado?: string | null;
    usuarioAprobador?: string | null;
    fechaAprobacion?: any | null;
    motivoAprobacion?: string | null;
    accionAprobacion?: string | null;
    deducciones?: Array<{
      __typename?: 'DeduccionInventario';
      nombre?: string | null;
      unidad?: string | null;
      cantidad?: number | null;
    } | null> | null;
  } | null> | null;
};

export type AnularComandaMutationVariables = Exact<{
  input: AnulacionComandaInput;
}>;

export type AnularComandaMutation = {
  __typename?: 'Mutation';
  anularComanda?: {
    __typename?: 'RespuestaAnulacionComanda';
    estado?: boolean | null;
    message?: string | null;
    data?: { __typename?: 'AnulacionComanda'; _id?: string | null; fecha?: any | null } | null;
  } | null;
};

export type ObtenerActividadesEconomicasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerActividadesEconomicasQuery = {
  __typename?: 'Query';
  obtenerActividadesEconomicas?: Array<{
    __typename?: 'ActividadEconomica';
    _id?: string | null;
    codigo?: string | null;
    descripcion?: string | null;
    codigoSubclaseTribu?: string | null;
    descripcionSubclaseTribu?: string | null;
  } | null> | null;
};

export type InsertarActividadEconomicaMutationVariables = Exact<{
  input: ActividadEconomicaInput;
}>;

export type InsertarActividadEconomicaMutation = {
  __typename?: 'Mutation';
  insertarActividadEconomica?: {
    __typename?: 'RespuestaActividadEconomica';
    estado?: boolean | null;
    message?: string | null;
    data?: {
      __typename?: 'ActividadEconomica';
      _id?: string | null;
      codigo?: string | null;
      descripcion?: string | null;
    } | null;
  } | null;
};

export type ActualizarActividadEconomicaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ActividadEconomicaInput;
}>;

export type ActualizarActividadEconomicaMutation = {
  __typename?: 'Mutation';
  actualizarActividadEconomica?: {
    __typename?: 'RespuestaActividadEconomica';
    estado?: boolean | null;
    message?: string | null;
    data?: {
      __typename?: 'ActividadEconomica';
      _id?: string | null;
      codigo?: string | null;
      descripcion?: string | null;
    } | null;
  } | null;
};

export type EliminarActividadEconomicaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type EliminarActividadEconomicaMutation = {
  __typename?: 'Mutation';
  eliminarActividadEconomica?: {
    __typename?: 'RespuestaActividadEconomica';
    estado?: boolean | null;
    message?: string | null;
    data?: {
      __typename?: 'ActividadEconomica';
      _id?: string | null;
      codigo?: string | null;
      descripcion?: string | null;
    } | null;
  } | null;
};

export type ObtenerAnulacionesPendientesQueryVariables = Exact<{
  fechaInicio?: InputMaybe<Scalars['Date']['input']>;
  fechaFin?: InputMaybe<Scalars['Date']['input']>;
}>;

export type ObtenerAnulacionesPendientesQuery = {
  __typename?: 'Query';
  obtenerAnulacionesPendientes?: Array<{
    __typename?: 'AnulacionPendienteComanda';
    _id?: string | null;
    fecha?: any | null;
    platillo?: string | null;
    motivo?: string | null;
    usuarioAnulo?: string | null;
    monto?: any | null;
    accion?: string | null;
    usuarioOrden?: string | null;
    esConCobro?: boolean | null;
    deducciones?: Array<{
      __typename?: 'DeduccionInventario';
      producto?: string | null;
      nombre?: string | null;
      unidad?: string | null;
      cantidad?: number | null;
    } | null> | null;
  } | null> | null;
};

export type AprobarAnulacionMutationVariables = Exact<{
  input: AprobarAnulacionInput;
}>;

export type AprobarAnulacionMutation = {
  __typename?: 'Mutation';
  aprobarAnulacion?: {
    __typename?: 'RespuestaAnulacionComanda';
    estado?: boolean | null;
    message?: string | null;
    data?: { __typename?: 'AnulacionComanda'; _id?: string | null; estado?: string | null } | null;
  } | null;
};

export type RechazarAnulacionMutationVariables = Exact<{
  input: RechazarAnulacionInput;
}>;

export type RechazarAnulacionMutation = {
  __typename?: 'Mutation';
  rechazarAnulacion?: {
    __typename?: 'RespuestaAnulacionComanda';
    estado?: boolean | null;
    message?: string | null;
    data?: { __typename?: 'AnulacionComanda'; _id?: string | null; estado?: string | null } | null;
  } | null;
};

export type ObtenerMovimientosQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerMovimientosQuery = {
  __typename?: 'Query';
  obtenerMovimientos?: Array<{
    __typename?: 'MovimientosType';
    id?: string | null;
    tipo?: Tipo | null;
    lote?: string | null;
    cedido?: boolean | null;
    fecha?: any | null;
    cantidad?: any | null;
    existencia?: any | null;
    precio?: any | null;
    precio_unidad?: any | null;
    moneda?: string | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      nombre?: string | null;
      codigo?: string | null;
    } | null;
    proveedor?: {
      __typename?: 'Proveedor';
      id?: string | null;
      empresa?: string | null;
      cedula?: string | null;
    } | null;
    usuario?: {
      __typename?: 'Usuario';
      id?: string | null;
      nombre?: string | null;
      cedula?: string | null;
    } | null;
    materia_prima?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
    } | null;
    almacen?: { __typename?: 'Almacen'; id?: string | null; nombre?: string | null } | null;
  } | null> | null;
};

export type ObtenerMovimientos2QueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerMovimientos2Query = {
  __typename?: 'Query';
  obtenerMovimientos2?: Array<{
    __typename?: 'MovimientosType';
    id?: string | null;
    tipo?: Tipo | null;
    lote?: string | null;
    cedido?: boolean | null;
    fecha?: any | null;
    cantidad?: any | null;
    existencia?: any | null;
    precio?: any | null;
    precio_unidad?: any | null;
    moneda?: string | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      nombre?: string | null;
      codigo?: string | null;
    } | null;
    proveedor?: {
      __typename?: 'Proveedor';
      id?: string | null;
      empresa?: string | null;
      cedula?: string | null;
    } | null;
    usuario?: {
      __typename?: 'Usuario';
      id?: string | null;
      nombre?: string | null;
      cedula?: string | null;
    } | null;
    materia_prima?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
    } | null;
    almacen?: { __typename?: 'Almacen'; id?: string | null; nombre?: string | null } | null;
  } | null> | null;
};

export type InsertarMovimientoMutationVariables = Exact<{
  input?: InputMaybe<MovimientosInput>;
  almacen?: InputMaybe<Scalars['ID']['input']>;
}>;

export type InsertarMovimientoMutation = {
  __typename?: 'Mutation';
  insertarMovimiento?: {
    __typename?: 'RespuestaMovimientos';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type InsertarSalidaMutationVariables = Exact<{
  input?: InputMaybe<Salida_Inventario>;
  almacen?: InputMaybe<Scalars['ID']['input']>;
}>;

export type InsertarSalidaMutation = {
  __typename?: 'Mutation';
  insertarSalida?: {
    __typename?: 'RespuestaMovimientos';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type VerificarExistenciasMutationVariables = Exact<{
  input?: InputMaybe<Items>;
}>;

export type VerificarExistenciasMutation = {
  __typename?: 'Mutation';
  verificarExistencias?: {
    __typename?: 'RespuestaVerificar';
    estado?: any | null;
    message?: string | null;
  } | null;
};

export type ObtenerNotasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerNotasQuery = {
  __typename?: 'Query';
  obtenerNotas?: Array<{
    __typename?: 'Notas';
    id?: string | null;
    nota?: string | null;
    fecha?: string | null;
    estado?: string | null;
    area?: { __typename?: 'Areas'; id?: string | null; nombre?: string | null } | null;
  } | null> | null;
};

export type ObtenerNotaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type ObtenerNotaQuery = {
  __typename?: 'Query';
  obtenerNota?: {
    __typename?: 'Notas';
    id?: string | null;
    nota?: string | null;
    fecha?: string | null;
    estado?: string | null;
    area?: { __typename?: 'Areas'; id?: string | null; nombre?: string | null } | null;
  } | null;
};

export type ObtenerNotasPorFechaQueryVariables = Exact<{
  fecha: Scalars['String']['input'];
}>;

export type ObtenerNotasPorFechaQuery = {
  __typename?: 'Query';
  obtenerNotasPorFecha?: Array<{
    __typename?: 'Notas';
    id?: string | null;
    nota?: string | null;
    fecha?: string | null;
    estado?: string | null;
    area?: { __typename?: 'Areas'; id?: string | null; nombre?: string | null } | null;
  } | null> | null;
};

export type InsertarNotaMutationVariables = Exact<{
  input: NotasInput;
}>;

export type InsertarNotaMutation = {
  __typename?: 'Mutation';
  insertarNota?: {
    __typename?: 'RespuestaNotas';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarNotaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: NotasInput;
}>;

export type ActualizarNotaMutation = {
  __typename?: 'Mutation';
  actualizarNota?: {
    __typename?: 'RespuestaNotas';
    estado?: boolean | null;
    message?: string | null;
    data?: {
      __typename?: 'Notas';
      id?: string | null;
      nota?: string | null;
      fecha?: string | null;
      estado?: string | null;
      area?: { __typename?: 'Areas'; id?: string | null; nombre?: string | null } | null;
    } | null;
  } | null;
};

export type DesactivarNotaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DesactivarNotaMutation = {
  __typename?: 'Mutation';
  desactivarNota?: {
    __typename?: 'RespuestaNotas';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerOrdenesCompraQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerOrdenesCompraQuery = {
  __typename?: 'Query';
  obtenerOrdenesCompra?: Array<{
    __typename?: 'OrdenCompra';
    id?: string | null;
    estado?: Estado | null;
    fechaPedido?: any | null;
    estadoPedido?: EstadoPedido | null;
    numeroComprobante?: string | null;
    subtotal?: any | null;
    impuestosMonto?: any | null;
    total?: any | null;
    proveedor?: {
      __typename?: 'Proveedor';
      id?: string | null;
      empresa?: string | null;
      cedula?: string | null;
    } | null;
    consecutivo?: {
      __typename?: 'HistorialConsecutivo';
      id?: string | null;
      consecutivo?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerOrdenCompraQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerOrdenCompraQuery = {
  __typename?: 'Query';
  obtenerOrdenCompra?: {
    __typename?: 'OrdenCompra';
    id?: string | null;
    estado?: Estado | null;
    fechaPedido?: any | null;
    estadoPedido?: EstadoPedido | null;
    numeroComprobante?: string | null;
    subtotal?: any | null;
    impuestosMonto?: any | null;
    total?: any | null;
    proveedor?: { __typename?: 'Proveedor'; id?: string | null; empresa?: string | null } | null;
    lineasPedido?: Array<{
      __typename?: 'LineaOrdenCompra';
      id?: string | null;
      estado?: Estado | null;
      precioUnitario?: any | null;
      cantidad?: any | null;
      cantidadRecibida?: any | null;
      porcentajeDescuento?: any | null;
      descuento?: any | null;
      montoImpuestos?: any | null;
      subtotalSinImpuesto?: any | null;
      subtotalConImpuesto?: any | null;
      producto?: {
        __typename?: 'MateriaPrima';
        id?: string | null;
        nombre?: string | null;
        pais?: string | null;
        unidad?: Unidad | null;
        existencias?: any | null;
        estado?: Estado | null;
        tipo?: TipoMateriaPrima | null;
        referenciaInterna?: string | null;
        codigoBarras?: string | null;
        codigoCabys?: string | null;
        descripcion?: string | null;
        precioCompra?: any | null;
        precioCostoPromedio?: any | null;
        margen?: any | null;
        impuestos?: Array<{
          __typename?: 'LineaImpuestos';
          impuesto?: string | null;
          aplicaVentas?: boolean | null;
          aplicaCompras?: boolean | null;
        } | null> | null;
      } | null;
      impuesto?: {
        __typename?: 'Impuesto';
        id?: string | null;
        nombre?: string | null;
        valor?: any | null;
        estado?: Estado | null;
      } | null;
    } | null> | null;
  } | null;
};

export type InsertarOrdenCompraMutationVariables = Exact<{
  input?: InputMaybe<OrdenCompraInput>;
  inputLineas?: InputMaybe<
    Array<InputMaybe<LineaOrdenCompraInput>> | InputMaybe<LineaOrdenCompraInput>
  >;
}>;

export type InsertarOrdenCompraMutation = {
  __typename?: 'Mutation';
  insertarOrdenCompra?: {
    __typename?: 'RespuestaOrdenCompra';
    estado?: boolean | null;
    message?: any | null;
    data?: { __typename?: 'OrdenCompra'; id?: string | null } | null;
  } | null;
};

export type ActualizarOrdenCompraMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<OrdenCompraInput>;
  inputLineasEditar?: InputMaybe<
    Array<InputMaybe<LineasEditarInput>> | InputMaybe<LineasEditarInput>
  >;
}>;

export type ActualizarOrdenCompraMutation = {
  __typename?: 'Mutation';
  actualizarOrdenCompra?: {
    __typename?: 'RespuestaOrdenCompra';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarEstadoOrdenCompraMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  estado?: InputMaybe<EstadoPedido>;
}>;

export type ActualizarEstadoOrdenCompraMutation = {
  __typename?: 'Mutation';
  actualizarEstadoOrdenCompra?: {
    __typename?: 'RespuestaOrdenCompra';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarOrdenCompraMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarOrdenCompraMutation = {
  __typename?: 'Mutation';
  desactivarOrdenCompra?: {
    __typename?: 'RespuestaOrdenCompra';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerPaquetesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerPaquetesQuery = {
  __typename?: 'Query';
  obtenerPaquetes?: Array<{
    __typename?: 'Paquete';
    id?: string | null;
    tipo?: string | null;
    nombre?: string | null;
    servicios?: any | null;
    tours?: any | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
    temporadas?: {
      __typename?: 'Temporada';
      fechaInicio?: string | null;
      fechaFin?: string | null;
      nombre?: string | null;
      tipo?: string | null;
      precio?: any | null;
    } | null;
  } | null> | null;
};

export type ObtenerPaqueteQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerPaqueteQuery = {
  __typename?: 'Query';
  obtenerPaquete?: {
    __typename?: 'Paquete';
    id?: string | null;
    tipo?: string | null;
    nombre?: string | null;
    servicios?: any | null;
    tours?: any | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
    temporadas?: {
      __typename?: 'Temporada';
      id?: string | null;
      fechaInicio?: string | null;
      fechaFin?: string | null;
      nombre?: string | null;
      tipo?: string | null;
      precio?: any | null;
    } | null;
  } | null;
};

export type InsertarPaqueteMutationVariables = Exact<{
  input?: InputMaybe<PaqueteInput>;
}>;

export type InsertarPaqueteMutation = {
  __typename?: 'Mutation';
  insertarPaquete?: {
    __typename?: 'RespuestaPaquete';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarPaqueteMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PaqueteInput>;
}>;

export type ActualizarPaqueteMutation = {
  __typename?: 'Mutation';
  actualizarPaquete?: {
    __typename?: 'RespuestaPaquete';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarPaqueteMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarPaqueteMutation = {
  __typename?: 'Mutation';
  desactivarPaquete?: {
    __typename?: 'RespuestaPaquete';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerPisosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerPisosQuery = {
  __typename?: 'Query';
  obtenerPisos?: Array<{
    __typename?: 'Piso';
    id?: string | null;
    nombre?: string | null;
    estado?: EstadoPiso | null;
  } | null> | null;
};

export type ObtenerPisoByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerPisoByIdQuery = {
  __typename?: 'Query';
  obtenerPisoById?: {
    __typename?: 'Piso';
    id?: string | null;
    nombre?: string | null;
    estado?: EstadoPiso | null;
  } | null;
};

export type ObtenerMesasPorPisoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerMesasPorPisoQuery = {
  __typename?: 'Query';
  obtenerMesasPorPiso?: Array<{
    __typename?: 'Mesa';
    id?: string | null;
    numero?: number | null;
    tipo?: ETipoMesa | null;
    disponibilidad?: Disponibilidad | null;
    temporizador?: number | null;
    estado?: Estado | null;
    piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
  } | null> | null;
};

export type ObtenerComandasPorPisoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerComandasPorPisoQuery = {
  __typename?: 'Query';
  obtenerComandasPorPiso?: {
    __typename?: 'ComandasPorPiso';
    piso?: { __typename?: 'Piso'; id?: string | null; nombre?: string | null } | null;
    mesas?: Array<{
      __typename?: 'MesaConComandas';
      mesa?: { __typename?: 'Mesa'; id?: string | null; numero?: number | null } | null;
      comandas?: Array<{
        __typename?: 'ComandaConSubcuentas';
        comanda?: { __typename?: 'Comanda'; id?: string | null } | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type InsertarPisoMutationVariables = Exact<{
  input?: InputMaybe<PisoInput>;
}>;

export type InsertarPisoMutation = {
  __typename?: 'Mutation';
  insertarPiso?: {
    __typename?: 'RespuestaPiso';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarPisoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PisoInput>;
}>;

export type ActualizarPisoMutation = {
  __typename?: 'Mutation';
  actualizarPiso?: {
    __typename?: 'RespuestaPiso';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarPisoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarPisoMutation = {
  __typename?: 'Mutation';
  desactivarPiso?: {
    __typename?: 'RespuestaPiso';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerProveedoresQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerProveedoresQuery = {
  __typename?: 'Query';
  obtenerProveedores?: Array<{
    __typename?: 'Proveedor';
    id?: string | null;
    empresa?: string | null;
    cedula?: string | null;
    pais?: string | null;
    ciudad?: string | null;
    city?: string | null;
    calle?: string | null;
    cp?: string | null;
    direccion?: string | null;
    vencimientoPago?: any | null;
    vencimientoPagoTipo?: string | null;
    alertaDiasAntes?: any | null;
    telefonos?: Array<{
      __typename?: 'Telefono';
      telefono?: string | null;
      ext?: string | null;
      descripcion?: string | null;
    } | null> | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    redes?: Array<{
      __typename?: 'RedSocial';
      red?: string | null;
      enlace?: string | null;
    } | null> | null;
    provedurias?: Array<{
      __typename?: 'TipoProveduria';
      id?: string | null;
      tipo?: string | null;
      estado?: Estado | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerProveedores2QueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerProveedores2Query = {
  __typename?: 'Query';
  obtenerProveedores?: Array<{
    __typename?: 'Proveedor';
    id?: string | null;
    empresa?: string | null;
  } | null> | null;
};

export type ObtenerProveedorQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerProveedorQuery = {
  __typename?: 'Query';
  obtenerProveedor?: {
    __typename?: 'Proveedor';
    id?: string | null;
    empresa?: string | null;
    cedula?: string | null;
    pais?: string | null;
    ciudad?: string | null;
    city?: string | null;
    calle?: string | null;
    cp?: string | null;
    direccion?: string | null;
    vencimientoPago?: any | null;
    vencimientoPagoTipo?: string | null;
    alertaDiasAntes?: any | null;
    telefonos?: Array<{
      __typename?: 'Telefono';
      telefono?: string | null;
      ext?: string | null;
      descripcion?: string | null;
    } | null> | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    redes?: Array<{
      __typename?: 'RedSocial';
      red?: string | null;
      enlace?: string | null;
    } | null> | null;
    provedurias?: Array<{
      __typename?: 'TipoProveduria';
      id?: string | null;
      tipo?: string | null;
      estado?: Estado | null;
    } | null> | null;
  } | null;
};

export type InsertarProveedorMutationVariables = Exact<{
  input?: InputMaybe<ProveedorInput>;
}>;

export type InsertarProveedorMutation = {
  __typename?: 'Mutation';
  insertarProveedor?: {
    __typename?: 'RespuestaProveedor';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarProveedorMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ProveedorInput>;
}>;

export type ActualizarProveedorMutation = {
  __typename?: 'Mutation';
  actualizarProveedor?: {
    __typename?: 'RespuestaProveedor';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarProveedorMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarProveedorMutation = {
  __typename?: 'Mutation';
  desactivarProveedor?: {
    __typename?: 'RespuestaProveedor';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerPuestoLimpiezasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerPuestoLimpiezasQuery = {
  __typename?: 'Query';
  obtenerPuestoLimpiezas?: Array<{
    __typename?: 'PuestoLimpieza';
    id?: string | null;
    nombre?: string | null;
    codigo?: string | null;
    estado?: Estado | null;
    ubicacion?: { __typename?: 'Ubicacion'; nombre?: string | null } | null;
    areas?: Array<{ __typename?: 'Area'; nombre?: string | null } | null> | null;
  } | null> | null;
};

export type ObtenerPuestoLimpiezaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerPuestoLimpiezaQuery = {
  __typename?: 'Query';
  obtenerPuestoLimpieza?: {
    __typename?: 'PuestoLimpieza';
    id?: string | null;
    nombre?: string | null;
    codigo?: string | null;
    estado?: Estado | null;
    ubicacion?: { __typename?: 'Ubicacion'; id?: string | null; nombre?: string | null } | null;
    areas?: Array<{ __typename?: 'Area'; nombre?: string | null } | null> | null;
  } | null;
};

export type InsertarPuestoLimpiezaMutationVariables = Exact<{
  input?: InputMaybe<PuestoLimpiezaInput>;
}>;

export type InsertarPuestoLimpiezaMutation = {
  __typename?: 'Mutation';
  insertarPuestoLimpieza?: {
    __typename?: 'RespuestaPuestoLimpieza';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarPuestoLimpiezaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<PuestoLimpiezaInput>;
}>;

export type ActualizarPuestoLimpiezaMutation = {
  __typename?: 'Mutation';
  actualizarPuestoLimpieza?: {
    __typename?: 'RespuestaPuestoLimpieza';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarPuestoLimpiezaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarPuestoLimpiezaMutation = {
  __typename?: 'Mutation';
  desactivarPuestoLimpieza?: {
    __typename?: 'RespuestaPuestoLimpieza';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerRecepcionPedidosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerRecepcionPedidosQuery = {
  __typename?: 'Query';
  obtenerRecepcionPedidos?: Array<{
    __typename?: 'RecepcionProductos';
    id?: string | null;
    estado?: Estado | null;
    fechaPedido?: any | null;
    fechaEntrega?: any | null;
    estadoRecepcion?: EstadoRecepcion | null;
    subtotal?: any | null;
    impuestosMonto?: any | null;
    total?: any | null;
    proveedor?: {
      __typename?: 'Proveedor';
      id?: string | null;
      empresa?: string | null;
      cedula?: string | null;
    } | null;
    pedido?: {
      __typename?: 'OrdenCompra';
      id?: string | null;
      estadoPedido?: EstadoPedido | null;
      consecutivo?: {
        __typename?: 'HistorialConsecutivo';
        id?: string | null;
        consecutivo?: string | null;
      } | null;
    } | null;
  } | null> | null;
};

export type ObtenerRecepcionPedidoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerRecepcionPedidoQuery = {
  __typename?: 'Query';
  obtenerRecepcionPedido?: {
    __typename?: 'RecepcionProductos';
    id?: string | null;
    estado?: Estado | null;
    fechaPedido?: any | null;
    fechaEntrega?: any | null;
    estadoRecepcion?: EstadoRecepcion | null;
    subtotal?: any | null;
    impuestosMonto?: any | null;
    total?: any | null;
    proveedor?: {
      __typename?: 'Proveedor';
      id?: string | null;
      empresa?: string | null;
      cedula?: string | null;
    } | null;
    pedido?: {
      __typename?: 'OrdenCompra';
      id?: string | null;
      estadoPedido?: EstadoPedido | null;
    } | null;
  } | null;
};

export type ActualizarEstadoRecepcionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  estado?: InputMaybe<EstadoRecepcion>;
}>;

export type ActualizarEstadoRecepcionMutation = {
  __typename?: 'Mutation';
  actualizarEstadoRecepcion?: {
    __typename?: 'RespuestaRecepcionProductos';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerRegistrosContablesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerRegistrosContablesQuery = {
  __typename?: 'Query';
  obtenerRegistrosContables?: Array<{
    __typename?: 'RegistroContable';
    id?: string | null;
    fechaRegistro?: any | null;
    fechaPago?: any | null;
    tipoPago?: TipoPago | null;
    tipoRegistroContable?: TipoRegistroContable | null;
    estado?: Estado | null;
    estadoRegistroContable?: EstadoCuenta | null;
    referenciaID?: string | null;
    referenciaModelo?: string | null;
    referenciaNombre?: string | null;
    comprobantePago?: string | null;
    monto?: number | null;
    cliente?: { __typename?: 'Cliente'; id?: string | null; nombre?: string | null } | null;
    proveedor?: { __typename?: 'Proveedor'; id?: string | null; empresa?: string | null } | null;
    usuario?: { __typename?: 'Usuario'; id?: string | null; nombre?: string | null } | null;
    consecutivo?: {
      __typename?: 'HistorialConsecutivo';
      id?: string | null;
      consecutivo?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerRegistrosContablesTipoQueryVariables = Exact<{
  tipo?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerRegistrosContablesTipoQuery = {
  __typename?: 'Query';
  obtenerRegistrosContablesTipo?: Array<{
    __typename?: 'RegistroContable';
    id?: string | null;
    fechaRegistro?: any | null;
    fechaPago?: any | null;
    tipoPago?: TipoPago | null;
    tipoRegistroContable?: TipoRegistroContable | null;
    estado?: Estado | null;
    estadoRegistroContable?: EstadoCuenta | null;
    referenciaID?: string | null;
    referenciaModelo?: string | null;
    referenciaNombre?: string | null;
    comprobantePago?: string | null;
    monto?: number | null;
    cliente?: { __typename?: 'Cliente'; id?: string | null; nombre?: string | null } | null;
    proveedor?: { __typename?: 'Proveedor'; id?: string | null; empresa?: string | null } | null;
    usuario?: { __typename?: 'Usuario'; id?: string | null; nombre?: string | null } | null;
    consecutivo?: {
      __typename?: 'HistorialConsecutivo';
      id?: string | null;
      consecutivo?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerRegistroContableQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerRegistroContableQuery = {
  __typename?: 'Query';
  obtenerRegistroContable?: {
    __typename?: 'RegistroContable';
    id?: string | null;
    fechaRegistro?: any | null;
    fechaPago?: any | null;
    tipoPago?: TipoPago | null;
    tipoRegistroContable?: TipoRegistroContable | null;
    estado?: Estado | null;
    estadoRegistroContable?: EstadoCuenta | null;
    referenciaID?: string | null;
    referenciaModelo?: string | null;
    referenciaNombre?: string | null;
    comprobantePago?: string | null;
    monto?: number | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      tipo?: string | null;
      nombre?: string | null;
      codigo?: string | null;
      pais?: string | null;
      ciudad?: string | null;
      city?: string | null;
      calle?: string | null;
      cp?: string | null;
      direccion?: string | null;
      estado?: Estado | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      redes?: Array<{
        __typename?: 'RedSocial';
        red?: string | null;
        enlace?: string | null;
      } | null> | null;
    } | null;
    proveedor?: {
      __typename?: 'Proveedor';
      id?: string | null;
      empresa?: string | null;
      cedula?: string | null;
      pais?: string | null;
      ciudad?: string | null;
      city?: string | null;
      calle?: string | null;
      cp?: string | null;
      direccion?: string | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      redes?: Array<{
        __typename?: 'RedSocial';
        red?: string | null;
        enlace?: string | null;
      } | null> | null;
    } | null;
    usuario?: {
      __typename?: 'Usuario';
      id?: string | null;
      nombre?: string | null;
      cedula?: string | null;
      estado?: Estado | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    } | null;
    consecutivo?: {
      __typename?: 'HistorialConsecutivo';
      id?: string | null;
      consecutivo?: string | null;
    } | null;
  } | null;
};

export type InsertarRegistroContableMutationVariables = Exact<{
  input?: InputMaybe<RegistroContableInput>;
}>;

export type InsertarRegistroContableMutation = {
  __typename?: 'Mutation';
  insertarRegistroContable?: {
    __typename?: 'RespuestaRegistroContable';
    estado?: boolean | null;
    message?: string | null;
    data?: { __typename?: 'RegistroContable'; id?: string | null } | null;
  } | null;
};

export type ActualizarRegistroContableMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<RegistroContableInput>;
}>;

export type ActualizarRegistroContableMutation = {
  __typename?: 'Mutation';
  actualizarRegistroContable?: {
    __typename?: 'RespuestaRegistroContable';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarRegistroContableMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarRegistroContableMutation = {
  __typename?: 'Mutation';
  desactivarRegistroContable?: {
    __typename?: 'RespuestaRegistroContable';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerReservaHabitacionesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerReservaHabitacionesQuery = {
  __typename?: 'Query';
  obtenerReservaHabitaciones?: Array<{
    __typename?: 'ReservaHabitacion';
    id?: string | null;
    fechaEntrada?: string | null;
    fechaSalida?: string | null;
    habitacion?: {
      __typename?: 'Habitaciones';
      id?: string | null;
      numeroHabitacion?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerReservaHabitacionQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerReservaHabitacionQuery = {
  __typename?: 'Query';
  obtenerReservaHabitacion?: Array<{
    __typename?: 'ReservaHabitacion';
    id?: string | null;
    serviciosExtra?: any | null;
    toursExtra?: any | null;
    cargosHabitacion?: Array<any | null> | null;
    serviciosExternos?: any | null;
    items?: Array<any | null> | null;
    fechaEntrada?: string | null;
    fechaSalida?: string | null;
    estado?: string | null;
    huespedes?: Array<{
      __typename?: 'Huesped';
      nombre?: string | null;
      identificacion?: string | null;
    } | null> | null;
    habitacion?: {
      __typename?: 'Habitaciones';
      id?: string | null;
      numeroHabitacion?: string | null;
      precioPorNoche?: any | null;
      descripcion?: string | null;
      estado?: string | null;
      tipoHabitacion?: {
        __typename?: 'TipoHabitacion';
        id?: string | null;
        nombre?: string | null;
        descripcion?: string | null;
        precioBase?: any | null;
      } | null;
      comodidades?: Array<{
        __typename?: 'Comodidades';
        id?: string | null;
        nombre?: string | null;
        descripcion?: string | null;
      } | null> | null;
    } | null;
  } | null> | null;
};

export type ObtenerReservaHabitacionesFullQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerReservaHabitacionesFullQuery = {
  __typename?: 'Query';
  obtenerReservaHabitaciones?: Array<{
    __typename?: 'ReservaHabitacion';
    id?: string | null;
    serviciosExtra?: any | null;
    serviciosExternos?: any | null;
    toursExtra?: any | null;
    cargosHabitacion?: Array<any | null> | null;
    estado?: string | null;
    fechaEntrada?: string | null;
    fechaSalida?: string | null;
    horaCheckIn?: string | null;
    horaCheckOut?: string | null;
    habitacion?: {
      __typename?: 'Habitaciones';
      id?: string | null;
      numeroHabitacion?: string | null;
      tipoHabitacion?: {
        __typename?: 'TipoHabitacion';
        nombre?: string | null;
        precioBase?: any | null;
      } | null;
    } | null;
    reserva?: {
      __typename?: 'Reserva';
      id?: string | null;
      serviciosGrupal?: any | null;
      fechaReserva?: string | null;
      tours?: any | null;
      numeroPersonas?: {
        __typename?: 'NumeroPersonas';
        adulto?: any | null;
        ninos?: any | null;
      } | null;
      cliente?: {
        __typename?: 'Cliente';
        id?: string | null;
        nombreFacturacion?: string | null;
        nombre?: string | null;
      } | null;
    } | null;
    cliente?: Array<{
      __typename?: 'clientes';
      nombre?: string | null;
      nombreFacturacion?: string | null;
      codigo?: string | null;
      pais?: string | null;
      telefono?: string | null;
      correo?: string | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerReservaPorHabitacionQueryVariables = Exact<{
  numeroHabitacion?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerReservaPorHabitacionQuery = {
  __typename?: 'Query';
  obtenerReservaPorHabitacion?: {
    __typename?: 'ReservaHabitacion';
    id?: string | null;
    serviciosExtra?: any | null;
    fechaEntrada?: string | null;
    fechaSalida?: string | null;
    estado?: string | null;
    reserva?: {
      __typename?: 'Reserva';
      id?: string | null;
      serviciosGrupal?: any | null;
      fechaReserva?: string | null;
      tours?: any | null;
      numeroPersonas?: {
        __typename?: 'NumeroPersonas';
        adulto?: any | null;
        ninos?: any | null;
      } | null;
      cliente?: {
        __typename?: 'Cliente';
        id?: string | null;
        nombreFacturacion?: string | null;
      } | null;
    } | null;
  } | null;
};

export type ObtenerReservaHabitacionesPorFechaQueryVariables = Exact<{
  fecha: Scalars['String']['input'];
}>;

export type ObtenerReservaHabitacionesPorFechaQuery = {
  __typename?: 'Query';
  obtenerReservaHabitacionesPorFecha?: Array<{
    __typename?: 'ReservaHabitacion';
    id?: string | null;
    serviciosExtra?: any | null;
    toursExtra?: any | null;
    cargosHabitacion?: Array<any | null> | null;
    serviciosExternos?: any | null;
    items?: Array<any | null> | null;
    fechaEntrada?: string | null;
    fechaSalida?: string | null;
    estado?: string | null;
    habitacion?: {
      __typename?: 'Habitaciones';
      id?: string | null;
      numeroHabitacion?: string | null;
      precioPorNoche?: any | null;
      descripcion?: string | null;
      estado?: string | null;
      tipoHabitacion?: {
        __typename?: 'TipoHabitacion';
        id?: string | null;
        nombre?: string | null;
        descripcion?: string | null;
        precioBase?: any | null;
      } | null;
      comodidades?: Array<{
        __typename?: 'Comodidades';
        id?: string | null;
        nombre?: string | null;
        descripcion?: string | null;
      } | null> | null;
    } | null;
    reserva?: {
      __typename?: 'Reserva';
      id?: string | null;
      serviciosGrupal?: any | null;
      fechaReserva?: string | null;
      tours?: any | null;
      paquetes?: any | null;
      total?: number | null;
      metodoPago?: string | null;
      politicas?: string | null;
      estado?: string | null;
      numeroPersonas?: {
        __typename?: 'NumeroPersonas';
        adulto?: any | null;
        ninos?: any | null;
      } | null;
      cliente?: {
        __typename?: 'Cliente';
        id?: string | null;
        tipo?: string | null;
        nombre?: string | null;
        nombreFacturacion?: string | null;
        codigo?: string | null;
        pais?: string | null;
        ciudad?: string | null;
        city?: string | null;
        calle?: string | null;
        cp?: string | null;
        direccion?: string | null;
        telefonos?: Array<{
          __typename?: 'Telefono';
          telefono?: string | null;
          ext?: string | null;
          descripcion?: string | null;
        } | null> | null;
        correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      } | null;
      usuario?: { __typename?: 'Usuario'; nombre?: string | null; cedula?: string | null } | null;
    } | null;
  } | null> | null;
};

export type ActualizarServiciosExtrasMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  serviciosExtras?: InputMaybe<
    Array<InputMaybe<Scalars['JSON']['input']>> | InputMaybe<Scalars['JSON']['input']>
  >;
}>;

export type ActualizarServiciosExtrasMutation = {
  __typename?: 'Mutation';
  actualizarServiciosExtras?: {
    __typename?: 'RespuestaReservaHabitacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarReservaHabitacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ReservaHabitacionInput>;
}>;

export type ActualizarReservaHabitacionMutation = {
  __typename?: 'Mutation';
  actualizarReservaHabitacion?: {
    __typename?: 'RespuestaReservaHabitacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerReservasInhouseHoyQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerReservasInhouseHoyQuery = {
  __typename?: 'Query';
  obtenerReservaHabitaciones?: Array<{
    __typename?: 'ReservaHabitacion';
    id?: string | null;
    fechaEntrada?: string | null;
    fechaSalida?: string | null;
    horaCheckIn?: string | null;
    estado?: string | null;
    cliente?: Array<{
      __typename?: 'clientes';
      nombre?: string | null;
      nombreFacturacion?: string | null;
    } | null> | null;
    habitacion?: {
      __typename?: 'Habitaciones';
      id?: string | null;
      numeroHabitacion?: string | null;
    } | null;
    reserva?: {
      __typename?: 'Reserva';
      id?: string | null;
      tipo?: string | null;
      cliente?: { __typename?: 'Cliente'; id?: string | null; nombre?: string | null } | null;
    } | null;
  } | null> | null;
};

export type ObtenerReservasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerReservasQuery = {
  __typename?: 'Query';
  obtenerReservas?: Array<{
    __typename?: 'Reserva';
    id?: string | null;
    serviciosGrupal?: any | null;
    tipo?: string | null;
    tours?: any | null;
    paquetes?: any | null;
    fechaReserva?: string | null;
    total?: number | null;
    metodoPago?: string | null;
    politicas?: string | null;
    petFriendly?: boolean | null;
    petQuantity?: any | null;
    estado?: string | null;
    numeroPersonas?: {
      __typename?: 'NumeroPersonas';
      adulto?: any | null;
      ninos?: any | null;
    } | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      tipo?: string | null;
      nombre?: string | null;
      nombreFacturacion?: string | null;
      codigo?: string | null;
      pais?: string | null;
      ciudad?: string | null;
      city?: string | null;
      calle?: string | null;
      cp?: string | null;
      direccion?: string | null;
      telefonos?: Array<{
        __typename?: 'Telefono';
        telefono?: string | null;
        ext?: string | null;
        descripcion?: string | null;
      } | null> | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    } | null;
    usuario?: { __typename?: 'Usuario'; nombre?: string | null; cedula?: string | null } | null;
  } | null> | null;
};

export type ObtenerReservasServiciosExternosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerReservasServiciosExternosQuery = {
  __typename?: 'Query';
  obtenerReservasServiciosExternos?: Array<{
    __typename?: 'ReservaServicioExterno';
    id?: string | null;
    tipo?: string | null;
    clienteServicioExterno?: any | null;
    serviciosExternos?: Array<any | null> | null;
  } | null> | null;
};

export type ObtenerReservaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerReservaQuery = {
  __typename?: 'Query';
  obtenerReserva?: {
    __typename?: 'Reserva';
    id?: string | null;
    serviciosGrupal?: any | null;
    tipo?: string | null;
    tours?: any | null;
    paquetes?: any | null;
    notas?: any | null;
    fechaReserva?: string | null;
    total?: number | null;
    metodoPago?: string | null;
    politicas?: string | null;
    petFriendly?: boolean | null;
    petQuantity?: any | null;
    estado?: string | null;
    numeroPersonas?: {
      __typename?: 'NumeroPersonas';
      adulto?: any | null;
      ninos?: any | null;
    } | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      tipo?: string | null;
      nombre?: string | null;
      nombreFacturacion?: string | null;
      codigo?: string | null;
      pais?: string | null;
      ciudad?: string | null;
      city?: string | null;
      calle?: string | null;
      cp?: string | null;
      direccion?: string | null;
      telefonos?: Array<{
        __typename?: 'Telefono';
        telefono?: string | null;
        ext?: string | null;
        descripcion?: string | null;
      } | null> | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    } | null;
    usuario?: { __typename?: 'Usuario'; nombre?: string | null; cedula?: string | null } | null;
  } | null;
};

export type ObtenerReservaPorClienteQueryVariables = Exact<{
  nombreCliente?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerReservaPorClienteQuery = {
  __typename?: 'Query';
  obtenerReservaPorCliente?: {
    __typename?: 'Reserva';
    id?: string | null;
    serviciosGrupal?: any | null;
    tipo?: string | null;
    tours?: any | null;
    paquetes?: any | null;
    notas?: any | null;
    fechaReserva?: string | null;
    total?: number | null;
    metodoPago?: string | null;
    politicas?: string | null;
    petFriendly?: boolean | null;
    petQuantity?: any | null;
    estado?: string | null;
    numeroPersonas?: {
      __typename?: 'NumeroPersonas';
      adulto?: any | null;
      ninos?: any | null;
    } | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      tipo?: string | null;
      nombre?: string | null;
      nombreFacturacion?: string | null;
      codigo?: string | null;
      pais?: string | null;
      ciudad?: string | null;
      city?: string | null;
      calle?: string | null;
      cp?: string | null;
      direccion?: string | null;
      telefonos?: Array<{
        __typename?: 'Telefono';
        telefono?: string | null;
        ext?: string | null;
        descripcion?: string | null;
      } | null> | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    } | null;
    usuario?: { __typename?: 'Usuario'; nombre?: string | null; cedula?: string | null } | null;
  } | null;
};

export type InsertarReservaMutationVariables = Exact<{
  input?: InputMaybe<ReservaInput>;
  bookingRoom?: InputMaybe<ReservaHabitacionInput>;
}>;

export type InsertarReservaMutation = {
  __typename?: 'Mutation';
  insertarReserva?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarServiciosGrupalesMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  serviciosGrupales?: InputMaybe<
    Array<InputMaybe<Scalars['JSON']['input']>> | InputMaybe<Scalars['JSON']['input']>
  >;
}>;

export type ActualizarServiciosGrupalesMutation = {
  __typename?: 'Mutation';
  actualizarServiciosGrupales?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type InsertarReservaServicioExternoMutationVariables = Exact<{
  input?: InputMaybe<ReservaServicioExternoInput>;
}>;

export type InsertarReservaServicioExternoMutation = {
  __typename?: 'Mutation';
  insertarReservaServicioExterno?: {
    __typename?: 'RespuestaReservaServicioExterno';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarReservaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ReservaInput>;
  bookingRoom?: InputMaybe<ReservaHabitacionInput>;
}>;

export type ActualizarReservaMutation = {
  __typename?: 'Mutation';
  actualizarReserva?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarReservaInfoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ReservaInput>;
}>;

export type ActualizarReservaInfoMutation = {
  __typename?: 'Mutation';
  actualizarReservaInfo?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarReservaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarReservaMutation = {
  __typename?: 'Mutation';
  desactivarReserva?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CheckInMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reserva: Scalars['ID']['input'];
  huespedes: Array<Scalars['JSON']['input']> | Scalars['JSON']['input'];
  items: Array<Scalars['JSON']['input']> | Scalars['JSON']['input'];
}>;

export type CheckInMutation = {
  __typename?: 'Mutation';
  checkIn?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CheckInInHouseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reserva: Scalars['ID']['input'];
}>;

export type CheckInInHouseMutation = {
  __typename?: 'Mutation';
  checkInInHouse?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type CheckOutMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reserva: Scalars['ID']['input'];
}>;

export type CheckOutMutation = {
  __typename?: 'Mutation';
  checkOut?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type UpdateStateMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type UpdateStateMutation = {
  __typename?: 'Mutation';
  updateState?: {
    __typename?: 'RespuestaReserva';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerRolesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerRolesQuery = {
  __typename?: 'Query';
  obtenerRoles?: Array<{
    __typename?: 'Rol';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
    permisos?: Array<{
      __typename?: 'Permisos';
      modulo?: string | null;
      agregar?: boolean | null;
      editar?: boolean | null;
      eliminar?: boolean | null;
      ver?: boolean | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerRolQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerRolQuery = {
  __typename?: 'Query';
  obtenerRol?: {
    __typename?: 'Rol';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
    permisos?: Array<{
      __typename?: 'Permisos';
      modulo?: string | null;
      agregar?: boolean | null;
      editar?: boolean | null;
      eliminar?: boolean | null;
      ver?: boolean | null;
    } | null> | null;
  } | null;
};

export type ActualizarRolMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<RolInput>;
}>;

export type ActualizarRolMutation = {
  __typename?: 'Mutation';
  actualizarRol?: {
    __typename?: 'RespuestaRol';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerPermisosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerPermisosQuery = {
  __typename?: 'Query';
  obtenerPermisos?: Array<{
    __typename?: 'Permiso';
    id?: string | null;
    descripcion?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type DesactivarRolMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarRolMutation = {
  __typename?: 'Mutation';
  desactivarRol?: {
    __typename?: 'RespuestaRol';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type InsertarRolMutationVariables = Exact<{
  input?: InputMaybe<RolInput>;
}>;

export type InsertarRolMutation = {
  __typename?: 'Mutation';
  insertarRol?: {
    __typename?: 'RespuestaRol';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerServiciosExternosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerServiciosExternosQuery = {
  __typename?: 'Query';
  obtenerServiciosExternos?: Array<{
    __typename?: 'ServiciosExternos';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
    tipo?: {
      __typename?: 'TipoServicio';
      id?: string | null;
      nombre?: string | null;
      cuantificable?: string | null;
      horadia?: string | null;
      icon?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerServicioExternoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerServicioExternoQuery = {
  __typename?: 'Query';
  obtenerServicioExterno?: {
    __typename?: 'ServiciosExternos';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
    tipo?: {
      __typename?: 'TipoServicio';
      id?: string | null;
      nombre?: string | null;
      cuantificable?: string | null;
      horadia?: string | null;
      icon?: string | null;
    } | null;
  } | null;
};

export type InsertarServicioExternoMutationVariables = Exact<{
  input?: InputMaybe<ServiciosInput>;
}>;

export type InsertarServicioExternoMutation = {
  __typename?: 'Mutation';
  insertarServicioExterno?: {
    __typename?: 'RespuestaServicios';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarServicioExternoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ServiciosInput>;
}>;

export type ActualizarServicioExternoMutation = {
  __typename?: 'Mutation';
  actualizarServicioExterno?: {
    __typename?: 'RespuestaServicios';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarServicioExternoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarServicioExternoMutation = {
  __typename?: 'Mutation';
  desactivarServicioExterno?: {
    __typename?: 'RespuestaServicios';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerServiciosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerServiciosQuery = {
  __typename?: 'Query';
  obtenerServicios?: Array<{
    __typename?: 'Servicios';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
    tipo?: {
      __typename?: 'TipoServicio';
      id?: string | null;
      nombre?: string | null;
      cuantificable?: string | null;
      horadia?: string | null;
      icon?: string | null;
    } | null;
  } | null> | null;
};

export type ObtenerServicioQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerServicioQuery = {
  __typename?: 'Query';
  obtenerServicio?: {
    __typename?: 'Servicios';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precio?: any | null;
    estado?: string | null;
    tipo?: {
      __typename?: 'TipoServicio';
      id?: string | null;
      nombre?: string | null;
      cuantificable?: string | null;
      horadia?: string | null;
      icon?: string | null;
    } | null;
  } | null;
};

export type InsertarServicioMutationVariables = Exact<{
  input?: InputMaybe<ServiciosInput>;
}>;

export type InsertarServicioMutation = {
  __typename?: 'Mutation';
  insertarServicio?: {
    __typename?: 'RespuestaServicios';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarServicioMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ServiciosInput>;
}>;

export type ActualizarServicioMutation = {
  __typename?: 'Mutation';
  actualizarServicio?: {
    __typename?: 'RespuestaServicios';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarServicioMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarServicioMutation = {
  __typename?: 'Mutation';
  desactivarServicio?: {
    __typename?: 'RespuestaServicios';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerSubcuentasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerSubcuentasQuery = {
  __typename?: 'Query';
  obtenerSubcuentas?: Array<{
    __typename?: 'Subcuenta';
    id?: string | null;
    numero?: any | null;
    fecha?: any | null;
    descuento?: any | null;
    total?: any | null;
    moneda?: string | null;
    estado?: SubcuentaEstado | null;
    comanda?: { __typename?: 'Comanda'; id?: string | null; estado?: EstadoComanda | null } | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      nombre?: string | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    } | null;
    platillos?: Array<{
      __typename?: 'Platillos';
      _id?: string | null;
      id?: string | null;
      nombre?: string | null;
      precio?: any | null;
      descuento?: any | null;
      estado?: PlatilloEstado | null;
      observaciones?: string | null;
    } | null> | null;
    formaPago?: Array<{
      __typename?: 'FormaPago';
      monto?: any | null;
      moneda?: string | null;
      tipo?: { __typename?: 'TipoMetodoPago'; id?: string | null; nombre?: string | null } | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerSubcuentaByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerSubcuentaByIdQuery = {
  __typename?: 'Query';
  obtenerSubcuentaById?: {
    __typename?: 'Subcuenta';
    id?: string | null;
    numero?: any | null;
    fecha?: any | null;
    descuento?: any | null;
    total?: any | null;
    moneda?: string | null;
    estado?: SubcuentaEstado | null;
    comanda?: { __typename?: 'Comanda'; id?: string | null; estado?: EstadoComanda | null } | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      nombre?: string | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    } | null;
    platillos?: Array<{
      __typename?: 'Platillos';
      _id?: string | null;
      id?: string | null;
      nombre?: string | null;
      precio?: any | null;
      descuento?: any | null;
      estado?: PlatilloEstado | null;
      observaciones?: string | null;
    } | null> | null;
    formaPago?: Array<{
      __typename?: 'FormaPago';
      monto?: any | null;
      moneda?: string | null;
      tipo?: { __typename?: 'TipoMetodoPago'; id?: string | null; nombre?: string | null } | null;
    } | null> | null;
  } | null;
};

export type ObtenerSubcuentasPorComandaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerSubcuentasPorComandaQuery = {
  __typename?: 'Query';
  obtenerSubcuentasPorComanda?: Array<{
    __typename?: 'Subcuenta';
    id?: string | null;
    numero?: any | null;
    fecha?: any | null;
    descuento?: any | null;
    total?: any | null;
    moneda?: string | null;
    estado?: SubcuentaEstado | null;
    comanda?: { __typename?: 'Comanda'; id?: string | null; estado?: EstadoComanda | null } | null;
    cliente?: {
      __typename?: 'Cliente';
      id?: string | null;
      nombre?: string | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    } | null;
    platillos?: Array<{
      __typename?: 'Platillos';
      _id?: string | null;
      id?: string | null;
      nombre?: string | null;
      precio?: any | null;
      descuento?: any | null;
      estado?: PlatilloEstado | null;
      observaciones?: string | null;
    } | null> | null;
    formaPago?: Array<{
      __typename?: 'FormaPago';
      monto?: any | null;
      moneda?: string | null;
      tipo?: { __typename?: 'TipoMetodoPago'; id?: string | null; nombre?: string | null } | null;
    } | null> | null;
  } | null> | null;
};

export type InsertarSubcuentaMutationVariables = Exact<{
  input?: InputMaybe<SubcuentaInput>;
}>;

export type InsertarSubcuentaMutation = {
  __typename?: 'Mutation';
  insertarSubcuenta?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarSubcuentaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<SubcuentaInput>;
}>;

export type ActualizarSubcuentaMutation = {
  __typename?: 'Mutation';
  actualizarSubcuenta?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarEntregadosMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<ActualizarEntregadosInput>;
}>;

export type ActualizarEntregadosMutation = {
  __typename?: 'Mutation';
  actualizarEntregados?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarPagadosMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<Array<InputMaybe<PlatillosInput>> | InputMaybe<PlatillosInput>>;
}>;

export type ActualizarPagadosMutation = {
  __typename?: 'Mutation';
  actualizarPagados?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarSubcuentaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarSubcuentaMutation = {
  __typename?: 'Mutation';
  desactivarSubcuenta?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type DesactivarPlatilloMutationVariables = Exact<{
  subcuentaId?: InputMaybe<Scalars['ID']['input']>;
  platilloId?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarPlatilloMutation = {
  __typename?: 'Mutation';
  desactivarPlatillo?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ActualizarObservacionesPlatilloMutationVariables = Exact<{
  subcuentaId?: InputMaybe<Scalars['ID']['input']>;
  platilloId?: InputMaybe<Scalars['ID']['input']>;
  observaciones?: InputMaybe<Scalars['String']['input']>;
}>;

export type ActualizarObservacionesPlatilloMutation = {
  __typename?: 'Mutation';
  actualizarObservacionesPlatillo?: {
    __typename?: 'RespuestaSubcuenta';
    estado?: boolean | null;
    message?: any | null;
  } | null;
};

export type ObtenerTemporadaQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTemporadaQuery = {
  __typename?: 'Query';
  obtenerTemporada?: Array<{
    __typename?: 'Temporada';
    id?: string | null;
    fechaInicio?: string | null;
    fechaFin?: string | null;
    nombre?: string | null;
    tipo?: string | null;
    precio?: any | null;
    descripcion?: string | null;
    tiposHabitacion?: any | null;
  } | null> | null;
};

export type ObtenerTemporadaByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTemporadaByIdQuery = {
  __typename?: 'Query';
  obtenerTemporadaById?: {
    __typename?: 'Temporada';
    id?: string | null;
    fechaInicio?: string | null;
    fechaFin?: string | null;
    nombre?: string | null;
    tipo?: string | null;
    precio?: any | null;
    tiposHabitacion?: any | null;
    descripcion?: string | null;
  } | null;
};

export type ActualizarTemporadaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TemporadaInput>;
}>;

export type ActualizarTemporadaMutation = {
  __typename?: 'Mutation';
  actualizarTemporada?: {
    __typename?: 'RespuestaTemporada';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type InsertarTemporadaMutationVariables = Exact<{
  input?: InputMaybe<TemporadaInput>;
}>;

export type InsertarTemporadaMutation = {
  __typename?: 'Mutation';
  insertarTemporada?: {
    __typename?: 'RespuestaTemporada';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerTiposHabitacionesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTiposHabitacionesQuery = {
  __typename?: 'Query';
  obtenerTiposHabitaciones?: Array<{
    __typename?: 'TipoHabitacion';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precioBase?: any | null;
    estado?: string | null;
  } | null> | null;
};

export type ObtenerTipoHabitacionByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTipoHabitacionByIdQuery = {
  __typename?: 'Query';
  obtenerTipoHabitacionById?: {
    __typename?: 'TipoHabitacion';
    id?: string | null;
    nombre?: string | null;
    descripcion?: string | null;
    precioBase?: any | null;
    estado?: string | null;
  } | null;
};

export type InsertarTipoHabitacionMutationVariables = Exact<{
  input?: InputMaybe<TipoHabitacionInput>;
}>;

export type InsertarTipoHabitacionMutation = {
  __typename?: 'Mutation';
  insertarTipoHabitacion?: {
    __typename?: 'RespuestaTipoHabitacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTipoHabitacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoHabitacionInput>;
}>;

export type ActualizarTipoHabitacionMutation = {
  __typename?: 'Mutation';
  actualizarTipoHabitacion?: {
    __typename?: 'RespuestaTipoHabitacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTipoHabitacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTipoHabitacionMutation = {
  __typename?: 'Mutation';
  desactivarTipoHabitacion?: {
    __typename?: 'RespuestaTipoHabitacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerTiposMenuQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTiposMenuQuery = {
  __typename?: 'Query';
  obtenerTiposMenu?: Array<{
    __typename?: 'TipoMenu';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerTipoMenuByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTipoMenuByIdQuery = {
  __typename?: 'Query';
  obtenerTipoMenuById?: {
    __typename?: 'TipoMenu';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarTipoMenuMutationVariables = Exact<{
  input?: InputMaybe<TipoMenuInput>;
}>;

export type InsertarTipoMenuMutation = {
  __typename?: 'Mutation';
  insertarTipoMenu?: {
    __typename?: 'RespuestaTipoMenu';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTipoMenuMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoMenuInput>;
}>;

export type ActualizarTipoMenuMutation = {
  __typename?: 'Mutation';
  actualizarTipoMenu?: {
    __typename?: 'RespuestaTipoMenu';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTipoMenuMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTipoMenuMutation = {
  __typename?: 'Mutation';
  desactivarTipoMenu?: {
    __typename?: 'RespuestaTipoMenu';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerTiposMetodoPagoQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTiposMetodoPagoQuery = {
  __typename?: 'Query';
  obtenerTiposMetodoPago?: Array<{
    __typename?: 'TipoMetodoPago';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerTipoMetodoPagoByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTipoMetodoPagoByIdQuery = {
  __typename?: 'Query';
  obtenerTipoMetodoPagoById?: {
    __typename?: 'TipoMetodoPago';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarTipoMetodoPagoMutationVariables = Exact<{
  input?: InputMaybe<TipoMetodoPagoInput>;
}>;

export type InsertarTipoMetodoPagoMutation = {
  __typename?: 'Mutation';
  insertarTipoMetodoPago?: {
    __typename?: 'RespuestaTipoMetodoPago';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTipoMetodoPagoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoMetodoPagoInput>;
}>;

export type ActualizarTipoMetodoPagoMutation = {
  __typename?: 'Mutation';
  actualizarTipoMetodoPago?: {
    __typename?: 'RespuestaTipoMetodoPago';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTipoMetodoPagoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTipoMetodoPagoMutation = {
  __typename?: 'Mutation';
  desactivarTipoMetodoPago?: {
    __typename?: 'RespuestaTipoMetodoPago';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerTiposPlatilloQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTiposPlatilloQuery = {
  __typename?: 'Query';
  obtenerTiposPlatillo?: Array<{
    __typename?: 'TipoPlatillo';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerTipoPlatilloByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTipoPlatilloByIdQuery = {
  __typename?: 'Query';
  obtenerTipoPlatilloById?: {
    __typename?: 'TipoPlatillo';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarTipoPlatilloMutationVariables = Exact<{
  input?: InputMaybe<TipoPlatilloInput>;
}>;

export type InsertarTipoPlatilloMutation = {
  __typename?: 'Mutation';
  insertarTipoPlatillo?: {
    __typename?: 'RespuestaTipoPlatillo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTipoPlatilloMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoPlatilloInput>;
}>;

export type ActualizarTipoPlatilloMutation = {
  __typename?: 'Mutation';
  actualizarTipoPlatillo?: {
    __typename?: 'RespuestaTipoPlatillo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTipoPlatilloMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTipoPlatilloMutation = {
  __typename?: 'Mutation';
  desactivarTipoPlatillo?: {
    __typename?: 'RespuestaTipoPlatillo';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerTipoProveduriaQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTipoProveduriaQuery = {
  __typename?: 'Query';
  obtenerTipoProveduria?: Array<{
    __typename?: 'TipoProveduria';
    id?: string | null;
    tipo?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerTipoProveduriaByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTipoProveduriaByIdQuery = {
  __typename?: 'Query';
  obtenerTipoProveduriaById?: {
    __typename?: 'TipoProveduria';
    id?: string | null;
    tipo?: string | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarTipoProveduriaMutationVariables = Exact<{
  input?: InputMaybe<TipoProveduriaInput>;
}>;

export type InsertarTipoProveduriaMutation = {
  __typename?: 'Mutation';
  insertarTipoProveduria?: {
    __typename?: 'RespuestaTipoProveduria';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTipoProveduriaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoProveduriaInput>;
}>;

export type ActualizarTipoProveduriaMutation = {
  __typename?: 'Mutation';
  actualizarTipoProveduria?: {
    __typename?: 'RespuestaTipoProveduria';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTipoProveduriaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTipoProveduriaMutation = {
  __typename?: 'Mutation';
  desactivarTipoProveduria?: {
    __typename?: 'RespuestaTipoProveduria';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerTipoServicioQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTipoServicioQuery = {
  __typename?: 'Query';
  obtenerTipoServicio?: Array<{
    __typename?: 'TipoServicio';
    id?: string | null;
    nombre?: string | null;
    cuantificable?: string | null;
    icon?: string | null;
    horadia?: string | null;
  } | null> | null;
};

export type ObtenerTipoServicioIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTipoServicioIdQuery = {
  __typename?: 'Query';
  obtenerTipoServicioId?: {
    __typename?: 'TipoServicio';
    id?: string | null;
    nombre?: string | null;
    cuantificable?: string | null;
    icon?: string | null;
    horadia?: string | null;
  } | null;
};

export type InsertarTipoServicioMutationVariables = Exact<{
  input?: InputMaybe<TipoServicioInput>;
}>;

export type InsertarTipoServicioMutation = {
  __typename?: 'Mutation';
  insertarTipoServicio?: {
    __typename?: 'RespuestaTipoServicio';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTipoServicioMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TipoServicioInput>;
}>;

export type ActualizarTipoServicioMutation = {
  __typename?: 'Mutation';
  actualizarTipoServicio?: {
    __typename?: 'RespuestaTipoServicio';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTipoServicioMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTipoServicioMutation = {
  __typename?: 'Mutation';
  desactivarTipoServicio?: {
    __typename?: 'RespuestaTipoServicio';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerToursQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerToursQuery = {
  __typename?: 'Query';
  obtenerTours?: Array<{
    __typename?: 'Tour';
    id?: string | null;
    tipo?: string | null;
    nombre?: string | null;
    precio?: any | null;
    estado?: string | null;
    descripcion?: string | null;
  } | null> | null;
};

export type ObtenerTourQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTourQuery = {
  __typename?: 'Query';
  obtenerTour?: {
    __typename?: 'Tour';
    id?: string | null;
    tipo?: string | null;
    nombre?: string | null;
    precio?: any | null;
    estado?: string | null;
    descripcion?: string | null;
  } | null;
};

export type InsertarTourMutationVariables = Exact<{
  input?: InputMaybe<TourInput>;
}>;

export type InsertarTourMutation = {
  __typename?: 'Mutation';
  insertarTour?: {
    __typename?: 'RespuestaTour';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTourMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TourInput>;
}>;

export type ActualizarTourMutation = {
  __typename?: 'Mutation';
  actualizarTour?: {
    __typename?: 'RespuestaTour';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarTourMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarTourMutation = {
  __typename?: 'Mutation';
  desactivarTour?: {
    __typename?: 'RespuestaTour';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerLineasTransferenciaInternaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineasTransferenciaInternaQuery = {
  __typename?: 'Query';
  obtenerLineasTransferenciaInterna?: Array<{
    __typename?: 'TransferenciaInternaLinea';
    id?: string | null;
    cantidad?: any | null;
    transferenciaInterna?: { __typename?: 'TransferenciaInterna'; id?: string | null } | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      unidad?: Unidad | null;
    } | null;
  } | null> | null;
};

export type ObtenerLineaTransferenciaInternaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerLineaTransferenciaInternaQuery = {
  __typename?: 'Query';
  obtenerLineaTransferenciaInterna?: {
    __typename?: 'TransferenciaInternaLinea';
    id?: string | null;
    cantidad?: any | null;
    transferenciaInterna?: { __typename?: 'TransferenciaInterna'; id?: string | null } | null;
    producto?: {
      __typename?: 'MateriaPrima';
      id?: string | null;
      nombre?: string | null;
      unidad?: Unidad | null;
    } | null;
  } | null;
};

export type InsertarLineaTransferenciaInternaMutationVariables = Exact<{
  input?: InputMaybe<TransferenciaInternaLineaInput>;
}>;

export type InsertarLineaTransferenciaInternaMutation = {
  __typename?: 'Mutation';
  insertarLineaTransferenciaInterna?: {
    __typename?: 'RespuestaTransferenciaInternaLinea';
    estado?: boolean | null;
    message?: string | null;
    data?: {
      __typename?: 'TransferenciaInternaLinea';
      id?: string | null;
      cantidad?: any | null;
      transferenciaInterna?: { __typename?: 'TransferenciaInterna'; id?: string | null } | null;
      producto?: {
        __typename?: 'MateriaPrima';
        id?: string | null;
        nombre?: string | null;
        unidad?: Unidad | null;
      } | null;
    } | null;
  } | null;
};

export type ObtenerTransferenciasInternasQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerTransferenciasInternasQuery = {
  __typename?: 'Query';
  obtenerTransferenciasInternas?: Array<{
    __typename?: 'TransferenciaInterna';
    id?: string | null;
    fecha?: any | null;
    nota?: string | null;
    usuario?: {
      __typename?: 'Usuario';
      id?: string | null;
      nombre?: string | null;
      cedula?: string | null;
    } | null;
    almacenDesde?: {
      __typename?: 'Almacen';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: Estado | null;
    } | null;
    almacenHasta?: {
      __typename?: 'Almacen';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: Estado | null;
    } | null;
  } | null> | null;
};

export type ObtenerTransferenciaInternaQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerTransferenciaInternaQuery = {
  __typename?: 'Query';
  obtenerTransferenciaInterna?: {
    __typename?: 'TransferenciaInterna';
    id?: string | null;
    fecha?: any | null;
    nota?: string | null;
    usuario?: {
      __typename?: 'Usuario';
      id?: string | null;
      nombre?: string | null;
      cedula?: string | null;
    } | null;
    almacenDesde?: {
      __typename?: 'Almacen';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: Estado | null;
    } | null;
    almacenHasta?: {
      __typename?: 'Almacen';
      id?: string | null;
      nombre?: string | null;
      descripcion?: string | null;
      estado?: Estado | null;
    } | null;
  } | null;
};

export type InsertarTransferenciaInternaMutationVariables = Exact<{
  input?: InputMaybe<TransferenciaInternaInput>;
  lineas?: InputMaybe<
    Array<InputMaybe<TransferenciaInternaLineaInput2>> | InputMaybe<TransferenciaInternaLineaInput2>
  >;
}>;

export type InsertarTransferenciaInternaMutation = {
  __typename?: 'Mutation';
  insertarTransferenciaInterna?: {
    __typename?: 'RespuestaTransferenciaInterna';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarTransferenciaInternaMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<TransferenciaInternaInput>;
}>;

export type ActualizarTransferenciaInternaMutation = {
  __typename?: 'Mutation';
  actualizarTransferenciaInterna?: {
    __typename?: 'RespuestaTransferenciaInterna';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerUbicacionesQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerUbicacionesQuery = {
  __typename?: 'Query';
  obtenerUbicaciones?: Array<{
    __typename?: 'Ubicacion';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null> | null;
};

export type ObtenerUbicacionByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerUbicacionByIdQuery = {
  __typename?: 'Query';
  obtenerUbicacionById?: {
    __typename?: 'Ubicacion';
    id?: string | null;
    nombre?: string | null;
    estado?: Estado | null;
  } | null;
};

export type InsertarUbicacionMutationVariables = Exact<{
  input?: InputMaybe<UbicacionInput>;
}>;

export type InsertarUbicacionMutation = {
  __typename?: 'Mutation';
  insertarUbicacion?: {
    __typename?: 'RespuestaUbicacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarUbicacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<UbicacionInput>;
}>;

export type ActualizarUbicacionMutation = {
  __typename?: 'Mutation';
  actualizarUbicacion?: {
    __typename?: 'RespuestaUbicacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarUbicacionMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarUbicacionMutation = {
  __typename?: 'Mutation';
  desactivarUbicacion?: {
    __typename?: 'RespuestaUbicacion';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ObtenerUsuariosActivosQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerUsuariosActivosQuery = {
  __typename?: 'Query';
  obtenerUsuariosActivos?: Array<{
    __typename?: 'Usuario';
    id?: string | null;
    nombre?: string | null;
    cedula?: string | null;
    estado?: Estado | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    roles?: Array<{
      __typename?: 'Rol';
      id?: string | null;
      nombre?: string | null;
      estado?: Estado | null;
      permisos?: Array<{
        __typename?: 'Permisos';
        modulo?: string | null;
        agregar?: boolean | null;
        editar?: boolean | null;
        eliminar?: boolean | null;
        ver?: boolean | null;
      } | null> | null;
    } | null> | null;
  } | null> | null;
};

export type ObtenerUsuarioAutenticadoQueryVariables = Exact<{ [key: string]: never }>;

export type ObtenerUsuarioAutenticadoQuery = {
  __typename?: 'Query';
  obtenerUsuarioAutenticado?: {
    __typename?: 'RespuestaUsuario';
    estado?: boolean | null;
    data?: {
      __typename?: 'Usuario';
      id?: string | null;
      nombre?: string | null;
      cedula?: string | null;
      estado?: Estado | null;
      correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
      telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
      roles?: Array<{
        __typename?: 'Rol';
        id?: string | null;
        nombre?: string | null;
        estado?: Estado | null;
        permisos?: Array<{
          __typename?: 'Permisos';
          modulo?: string | null;
          agregar?: boolean | null;
          editar?: boolean | null;
          eliminar?: boolean | null;
          ver?: boolean | null;
        } | null> | null;
      } | null> | null;
    } | null;
  } | null;
};

export type ObtenerUsuarioQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ObtenerUsuarioQuery = {
  __typename?: 'Query';
  obtenerUsuario?: {
    __typename?: 'Usuario';
    id?: string | null;
    nombre?: string | null;
    cedula?: string | null;
    estado?: Estado | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    roles?: Array<{
      __typename?: 'Rol';
      id?: string | null;
      nombre?: string | null;
      estado?: Estado | null;
      permisos?: Array<{
        __typename?: 'Permisos';
        modulo?: string | null;
        agregar?: boolean | null;
        editar?: boolean | null;
        eliminar?: boolean | null;
        ver?: boolean | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type ObtenerUsuarioByCodigoQueryVariables = Exact<{
  codigo?: InputMaybe<Scalars['String']['input']>;
}>;

export type ObtenerUsuarioByCodigoQuery = {
  __typename?: 'Query';
  obtenerUsuarioByCodigo?: {
    __typename?: 'Usuario';
    id?: string | null;
    nombre?: string | null;
    cedula?: string | null;
    estado?: Estado | null;
    correos?: Array<{ __typename?: 'Email'; email?: string | null } | null> | null;
    telefonos?: Array<{ __typename?: 'Telefono'; telefono?: string | null } | null> | null;
    roles?: Array<{
      __typename?: 'Rol';
      nombre?: string | null;
      permisos?: Array<{
        __typename?: 'Permisos';
        modulo?: string | null;
        agregar?: boolean | null;
        editar?: boolean | null;
        eliminar?: boolean | null;
        ver?: boolean | null;
      } | null> | null;
    } | null> | null;
  } | null;
};

export type EnviarCodigoVerificacionMutationVariables = Exact<{
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
}>;

export type EnviarCodigoVerificacionMutation = {
  __typename?: 'Mutation';
  enviarCodigoVerificacion?: {
    __typename?: 'RespuestaVerificacion';
    estado?: boolean | null;
    codigo?: string | null;
    message?: string | null;
  } | null;
};

export type AutenticarUsuarioMutationVariables = Exact<{
  cedula: Scalars['String']['input'];
  clave: Scalars['String']['input'];
}>;

export type AutenticarUsuarioMutation = {
  __typename?: 'Mutation';
  autenticarUsuario?: {
    __typename?: 'RespuestaAutenticar';
    token?: string | null;
    cedula?: string | null;
    nombre?: string | null;
    roles?: Array<string | null> | null;
  } | null;
};

export type InsertarUsuarioMutationVariables = Exact<{
  input?: InputMaybe<UsuarioInput>;
}>;

export type InsertarUsuarioMutation = {
  __typename?: 'Mutation';
  insertarUsuario?: {
    __typename?: 'RespuestaUsuario';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type ActualizarUsuarioMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<UsuarioInput>;
}>;

export type ActualizarUsuarioMutation = {
  __typename?: 'Mutation';
  actualizarUsuario?: {
    __typename?: 'RespuestaUsuario';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type DesactivarUsuarioMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type DesactivarUsuarioMutation = {
  __typename?: 'Mutation';
  desactivarUsuario?: {
    __typename?: 'RespuestaUsuario';
    estado?: boolean | null;
    message?: string | null;
  } | null;
};

export type RecuperarClaveMutationVariables = Exact<{
  codigo?: InputMaybe<Scalars['String']['input']>;
  nueva?: InputMaybe<Scalars['String']['input']>;
}>;

export type RecuperarClaveMutation = {
  __typename?: 'Mutation';
  recuperarClave?: {
    __typename?: 'confirmacion';
    success?: boolean | null;
    message?: string | null;
  } | null;
};

export type CambiarClaveMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  actual?: InputMaybe<Scalars['String']['input']>;
  nueva?: InputMaybe<Scalars['String']['input']>;
}>;

export type CambiarClaveMutation = {
  __typename?: 'Mutation';
  cambiarClave?: {
    __typename?: 'confirmacion';
    success?: boolean | null;
    message?: string | null;
  } | null;
};

export type ComprobarUsuarioMutationVariables = Exact<{
  cedula: Scalars['String']['input'];
  clave: Scalars['String']['input'];
}>;

export type ComprobarUsuarioMutation = {
  __typename?: 'Mutation';
  comprobarUsuario?: {
    __typename?: 'RespuestaComprobar';
    roles?: Array<any | null> | null;
    cedula?: string | null;
    nombre?: string | null;
  } | null;
};
