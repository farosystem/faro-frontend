import { gql } from '@apollo/client';
export const OBTENER_MOVIMIENTOS_RESTAURANTE = gql`
  query obtenerMovimientosRestaurante {
    obtenerMovimientosRestaurante {
      _id
      fecha
      cliente
      nombreFacturacion
      comanda {
        id
        mesa {
          numero
        }
      }
      condicionVenta
      medioPago
      tipoCambio
      codigoMoneda
      platillos {
        id
        nombre
        precio
        observaciones
      }
      numeroHabitacion
      reserva
      subtotal
      descuento
      IVA
      impuestoServicio
      total
    }
  }
`;

export const OBTENER_MOVIMIENTOS_POR_FECHA = gql`
  query obtenerMovimientosPorFecha($fechaInicio: Date!, $fechaFin: Date!) {
    obtenerMovimientosPorFecha(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      cliente
      nombreFacturacion
      comanda {
        id
        mesa {
          numero
        }
      }
      condicionVenta
      medioPago
      tipoCambio
      codigoMoneda
      platillos {
        id
        nombre
        precio
        observaciones
      }
      numeroHabitacion
      reserva
      subtotal
      descuento
      IVA
      impuestoServicio
      total
    }
  }
`;

export const INSERTAR_MOVIMIENTO_RESTAURANTE = gql`
  mutation insertarMovimientoRestaurante($input: MovimientoRestauranteInput) {
    insertarMovimientoRestaurante(input: $input) {
      estado
      message
    }
  }
`;

export const OBTENER_REPORTE_COMANDA = gql`
  query obtenerReporteComanda($fechaInicio: Date!, $fechaFin: Date!) {
    obtenerReporteComanda(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      fechaFinalizada
      mesa {
        numero
      }
    }
  }
`;

export const OBTENER_REPORTE_GASTOS_GERENCIA = gql`
  query obtenerReporteGastosGerencia($fechaInicio: Date!, $fechaFin: Date!) {
    obtenerReporteGastosGerencia(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      nombreFacturacion
      total
      descuento
      comanda {
        mesa {
          numero
        }
      }
    }
  }
`;

export const OBTENER_REPORTE_MOVIMIENTOS_DESCUENTO = gql`
  query obtenerReporteMovimientosConDescuento($fechaInicio: Date!, $fechaFin: Date!) {
    obtenerReporteMovimientosConDescuento(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      nombreFacturacion
      total
      descuento
      comanda {
        mesa {
          numero
        }
      }
    }
  }
`;

export const OBTENER_REPORTE_VENTAS = gql`
  query obtenerReporteVentas($fechaInicio: Date!, $fechaFin: Date!) {
    obtenerReporteVentas(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      total
      descuento
    }
  }
`;

export const OBTENER_REPORTE_ANULACIONES = gql`
  query obtenerReporteAnulacionesConDecision($fechaInicio: Date!, $fechaFin: Date!) {
    obtenerReporteAnulacionesConDecision(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      platillo
      motivo
      usuarioAnulo
      monto
      accion
      estado
      deducciones {
        nombre
        unidad
        cantidad
      }
      usuarioAprobador
      fechaAprobacion
      motivoAprobacion
      accionAprobacion
    }
  }
`;

export const ANULAR_COMANDA = gql`
  mutation anularComanda($input: AnulacionComandaInput!) {
    anularComanda(input: $input) {
      estado
      message
      data {
        _id
        fecha
      }
    }
  }
`;

export const OBTENER_ACTIVIDADES_ECONOMICAS = gql`
  query obtenerActividadesEconomicas {
    obtenerActividadesEconomicas {
      _id
      codigo
      descripcion
      codigoSubclaseTribu
      descripcionSubclaseTribu
    }
  }
`;

export const INSERTAR_ACTIVIDAD_ECONOMICA = gql`
  mutation insertarActividadEconomica($input: ActividadEconomicaInput!) {
    insertarActividadEconomica(input: $input) {
      estado
      data {
        _id
        codigo
        descripcion
      }
      message
    }
  }
`;

export const ACTUALIZAR_ACTIVIDAD_ECONOMICA = gql`
  mutation actualizarActividadEconomica($id: ID!, $input: ActividadEconomicaInput!) {
    actualizarActividadEconomica(id: $id, input: $input) {
      estado
      data {
        _id
        codigo
        descripcion
      }
      message
    }
  }
`;

export const ELIMINAR_ACTIVIDAD_ECONOMICA = gql`
  mutation eliminarActividadEconomica($id: ID!) {
    eliminarActividadEconomica(id: $id) {
      estado
      data {
        _id
        codigo
        descripcion
      }
      message
    }
  }
`;
export const OBTENER_ANULACIONES_PENDIENTES = gql`
  query obtenerAnulacionesPendientes($fechaInicio: Date, $fechaFin: Date) {
    obtenerAnulacionesPendientes(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      _id
      fecha
      platillo
      motivo
      usuarioAnulo
      monto
      accion
      usuarioOrden
      deducciones {
        producto
        nombre
        unidad
        cantidad
      }
      esConCobro
    }
  }
`;

export const APROBAR_ANULACION = gql`
  mutation aprobarAnulacion($input: AprobarAnulacionInput!) {
    aprobarAnulacion(input: $input) {
      estado
      message
      data {
        _id
        estado
      }
    }
  }
`;

export const RECHAZAR_ANULACION = gql`
  mutation rechazarAnulacion($input: RechazarAnulacionInput!) {
    rechazarAnulacion(input: $input) {
      estado
      message
      data {
        _id
        estado
      }
    }
  }
`;
