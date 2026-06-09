import { gql } from '@apollo/client';

// GraphQL Queries
export const OBTENER_NOTAS = gql`
  query obtenerNotas {
    obtenerNotas {
      id
      nota
      fecha
      area {
        id
        nombre
      }
      estado
    }
  }
`;

export const OBTENER_NOTA = gql`
  query obtenerNota($id: ID!) {
    obtenerNota(id: $id) {
      id
      nota
      fecha
      area {
        id
        nombre
      }
      estado
    }
  }
`;

export const OBTENER_NOTAS_POR_FECHA = gql`
  query obtenerNotasPorFecha($fecha: String!) {
    obtenerNotasPorFecha(fecha: $fecha) {
      id
      nota
      fecha
      area {
        id
        nombre
      }
      estado
    }
  }
`;

// GraphQL Mutations
export const INSERTAR_NOTA = gql`
  mutation insertarNota($input: NotasInput!) {
    insertarNota(input: $input) {
      estado
      message
    }
  }
`;

export const ACTUALIZAR_NOTA = gql`
  mutation actualizarNota($id: ID!, $input: NotasInput!) {
    actualizarNota(id: $id, input: $input) {
      estado
      data {
        id
        nota
        fecha
        area {
          id
          nombre
        }
        estado
      }
      message
    }
  }
`;

export const DESACTIVAR_NOTA = gql`
  mutation desactivarNota($id: ID!) {
    desactivarNota(id: $id) {
      estado
      message
    }
  }
`;
