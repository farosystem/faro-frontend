import { gql } from '@apollo/client';

export const OBTENER_GESTIONES_CAJA = gql`
  query obtenerGestionesCaja {
    obtenerGestionesCaja {
      id
      caja
      consecutivo
      fecha
      hora_apertura
      hora_cierre
      usuario {
        nombre
        cedula
      }
      administrador {
        nombre
        cedula
      }
      datos_inicio_usuario
      datos_cierre_usuario
      datos_cierre_sistema
      observaciones
    }
  }
`;

export const OBTENER_GESTIONES_POR_CAJA = gql`
  query obtenerGestionesPorCaja($caja: ID!) {
    obtenerGestionesPorCaja(caja: $caja) {
      id
      caja
      consecutivo
      fecha
      hora_apertura
      hora_cierre
      usuario {
        nombre
        cedula
      }
      administrador {
        nombre
        cedula
      }
      datos_inicio_usuario
      datos_cierre_usuario
      datos_cierre_sistema
      observaciones
    }
  }
`;

export const OBTENER_GESTION_CAJA_BY_ID = gql`
  query obtenerGestionCajaById($id: ID!) {
    obtenerGestionCajaById(id: $id) {
      id
      caja
      consecutivo
      fecha
      hora_apertura
      hora_cierre
      usuario {
        nombre
        cedula
      }
      administrador {
        nombre
        cedula
      }
      datos_inicio_usuario
      datos_cierre_usuario
      datos_cierre_sistema
      observaciones
    }
  }
`;

export const OBTENER_GESTION_ACTUAL = gql`
  query obtenerGestionActual($caja: ID!) {
    obtenerGestionActual(caja: $caja) {
      id
      caja
      consecutivo
      fecha
      hora_apertura
      hora_cierre
      usuario {
        nombre
        cedula
      }
      administrador {
        nombre
        cedula
      }
      datos_inicio_usuario
      datos_cierre_usuario
      datos_cierre_sistema
      observaciones
    }
  }
`;

export const OBTENER_GESTIONES_POR_RANGO = gql`
  query obtenerGestionesPorRangoFecha($caja: ID, $fechaInicio: String, $fechaFin: String) {
    obtenerGestionesPorRangoFecha(caja: $caja, fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      id
      caja
      consecutivo
      fecha
      hora_apertura
      hora_cierre
      usuario {
        nombre
        cedula
      }
      administrador {
        nombre
        cedula
      }
      datos_inicio_usuario
      datos_cierre_usuario
      datos_cierre_sistema
      observaciones
    }
  }
`;

export const OBTENER_MOVIMIENTOS_POR_RANGO = gql`
  query obtenerMovimientosGestionesPorRangoFecha(
    $caja: ID
    $fechaInicio: String
    $fechaFin: String
  ) {
    obtenerMovimientosGestionesPorRangoFecha(
      caja: $caja
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      gestion {
        id
        fecha
        usuario {
          nombre
        }
      }
      movimientos {
        id
        tipo
        monto
        fecha
        medioPago
        codigoMoneda
        observaciones
      }
    }
  }
`;

export const APERTURA_CAJA = gql`
  mutation aperturaCaja($input: GestionCajaInput) {
    aperturaCaja(input: $input) {
      estado
      message
    }
  }
`;

export const CIERRE_PARCIAL = gql`
  mutation cierreParcialCaja($id: ID, $input: GestionCajaInput!) {
    cierreParcialCaja(id: $id, input: $input) {
      estado
      message
    }
  }
`;

export const CIERRE_CAJA = gql`
  mutation cierreCaja($id: ID, $input: GestionCajaCierreInput!) {
    cierreCaja(id: $id, input: $input) {
      estado
      message
    }
  }
`;
