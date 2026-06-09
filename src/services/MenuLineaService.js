import { gql } from '@apollo/client';

export const OBTENER_LINEAS_MENU = gql`
  query obtenerLineasMenu($id: ID) {
    obtenerLineasMenu(id: $id) {
      id
      producto {
        id
        nombre
        pais
        unidad
        existencias
        estado
        tipo
        precioCompra
        precioCostoPromedio
      }
      menu {
        id
        nombre
        descripcion
        estado
        precioCosto
        porcentajeGanancia
        tipoPlatillo {
          id
          nombre
        }
        tipoMenu {
          id
          nombre
        }
      }
      cantidad
    }
  }
`;

export const OBTENER_LINEA_MENU = gql`
  query obtenerLineaMenu($id: ID) {
    obtenerLineaMenu(id: $id) {
      id
      producto {
        id
        nombre
        unidad
        precioCostoPromedio
      }
      menu {
        id
        nombre
        descripcion
        estado
        precioCosto
        tipoPlatillo {
          id
          nombre
        }
        tipoMenu {
          id
          nombre
        }
      }
      cantidad
    }
  }
`;

export const INSERTAR_LINEA_MENU = gql`
  mutation insertarLineaMenu($input: MenuLineaInput) {
    insertarLineaMenu(input: $input) {
      estado
      message
    }
  }
`;

export const ACTUALIZAR_LINEA_MENU = gql`
  mutation actualizarLineaMenu($id: ID, $input: MenuLineaInput) {
    actualizarLineaMenu(id: $id, input: $input) {
      estado
      message
    }
  }
`;

export const ELIMINAR_LINEA_MENU = gql`
  mutation desactivarLineaMenu($id: ID) {
    desactivarLineaMenu(id: $id) {
      estado
      message
    }
  }
`;
