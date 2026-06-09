import { gql } from '@apollo/client';

export const OBTENER_MOVIMIENTOS_CAJAS = gql`
  query obtenerMovimientosCajas {
    obtenerMovimientosCajas {
      id
      gestionCaja
      consecutivo
      fecha
      hora
      tipo
      estado
      monto
      medioPago
      codigoMoneda
      modulo
    }
  }
`;

export const OBTENER_MOVIMIENTO_BY_ID = gql`
  query obtenerMovimientoById($id: ID!) {
    obtenerMovimientoById(id: $id) {
      id
      gestionCaja
      consecutivo
      fecha
      hora
      tipo
      estado
      monto
      medioPago
      codigoMoneda
      modulo
    }
  }
`;

export const OBTENER_MOVIMIENTOS_DE_GESTION = gql`
  query obtenerMovimientosDeGestion($gestionCajaId: ID!) {
    obtenerMovimientosDeGestion(gestionCajaId: $gestionCajaId) {
      id
      gestionCaja
      consecutivo
      observaciones
      fecha
      hora
      tipo
      estado
      monto
      medioPago
      codigoMoneda
      modulo
    }
  }
`;

export const REGISTRAR_MOVIMIENTO_CAJA = gql`
  mutation registrarMovimiento($gestionCaja: ID, $input: MovimientoCajaInput) {
    registrarMovimiento(gestionCaja: $gestionCaja, input: $input) {
      estado
      message
    }
  }
`;
