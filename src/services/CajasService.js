import { gql } from '@apollo/client';

export const OBTENER_CAJAS = gql`
  query obtenerCajas {
    obtenerCajas {
      id
      codigo
      nombre
      numero
      estado
      modulo
      montos_apertura
    }
  }
`;

export const OBTENER_CAJA_BY_ID = gql`
  query obtenerCajaById($id: ID) {
    obtenerCajaById(id: $id) {
      id
      codigo
      nombre
      numero
      estado
      modulo
      montos_apertura
    }
  }
`;
export const OBTENER_CAJA_BY_MODULO = gql`
  query obtenerCajaByModulo($modulo: String) {
    obtenerCajaByModulo(modulo: $modulo) {
      id
      codigo
      nombre
      numero
      estado
      modulo
      montos_apertura
    }
  }
`;
export const SAVE_CAJA = gql`
  mutation insertarCaja($input: CajaInput) {
    insertarCaja(input: $input) {
      estado
      message
    }
  }
`;

export const UPDATE_CAJA = gql`
  mutation actualizarCaja($id: ID, $input: CajaInput) {
    actualizarCaja(id: $id, input: $input) {
      estado
      message
    }
  }
`;
export const CERRAR_CAJA = gql`
  mutation cerrarCaja($id: ID) {
    cerrarCaja(id: $id) {
      estado
      message
    }
  }
`;
export const ABRIR_CAJA = gql`
  mutation abrirCaja($id: ID) {
    abrirCaja(id: $id) {
      estado
      message
    }
  }
`;
export const CERRAR_PARCIALMENTE_CAJA = gql`
  mutation cierreParcial($id: ID) {
    cierreParcial(id: $id) {
      estado
      message
    }
  }
`;

export const DESACTIVAR_CAJA = gql`
  mutation desactivarCaja($id: ID) {
    cierreParcial(id: $id) {
      estado
      message
    }
  }
`;
