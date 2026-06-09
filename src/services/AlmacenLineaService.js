import { gql } from '@apollo/client';

export const OBTENER_LINEAS_ALMACEN = gql`
  query obtenerLineasAlmacen($id: ID) {
    obtenerLineasAlmacen(id: $id) {
      id
      producto {
        id
        nombre
        unidad
      }
      almacen {
        id
        nombre
      }
      cantidad
    }
  }
`;

export const OBTENER_LINEA_ALMACEN = gql`
  query obtenerLineaAlmacen($id: ID) {
    obtenerLineaAlmacen(id: $id) {
      id
      producto {
        id
        nombre
        unidad
      }
      almacen {
        id
        nombre
      }
      cantidad
    }
  }
`;

export const OBTENER_ALMACEN_LINEA = gql`
  query obtenerAlmacenLinea($producto: ID, $cantidad: Float) {
    obtenerAlmacenLinea(producto: $producto, cantidad: $cantidad) {
      id
      producto {
        id
        nombre
        unidad
      }
      almacen {
        id
        nombre
      }
      cantidad
    }
  }
`;

export const INSERTAR_LINEA_ALMACEN = gql`
  mutation insertarLineaAlmacen($input: AlmacenLineaInput) {
    insertarLineaAlmacen(input: $input) {
      estado
      message
      data {
        id
        producto {
          id
          nombre
          unidad
        }
        almacen {
          id
          nombre
        }
        cantidad
      }
    }
  }
`;

export const DESCONTAR_STOCK = gql`
  mutation descontarStock($producto: ID, $cantidad: Float) {
    descontarStock(producto: $producto, cantidad: $cantidad) {
      estado
      almacenId
      message
    }
  }
`;
