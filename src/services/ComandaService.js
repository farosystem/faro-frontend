import { gql } from '@apollo/client';

export const OBTENER_COMANDAS_FULL = gql`
  query obtenerComandasFull {
    obtenerComandas {
      id
      mesa {
        id
      }
      fecha
      fechaGenerada
      fechaFinalizada
      preFactura
      estado
      subcuentas {
        id
        numero
        cliente {
          id
          nombre
          correos {
            email
          }
          telefonos {
            telefono
          }
        }
        fecha
        fechaGenerada
        fechaFinalizada
        platillos {
          id
          nombre
          precio
          descuento
          anulacionPendiente
        }
        descuento
        total
        moneda
        formaPago {
          tipo {
            id
            nombre
          }
          monto
          moneda
        }
        estado
      }
    }
  }
`;

export const OBTENER_COMANDAS = gql`
  query obtenerComandasPartial {
    obtenerComandas {
      id
      fecha
      fechaGenerada
      fechaFinalizada
      mesa {
        id
        numero
        piso {
          id
          nombre
        }
        tipo
      }
      subcuentas {
        id
        cliente {
          id
          nombre
        }
        fecha
        fechaGenerada
        fechaFinalizada
        platillos {
          _id
          id
          nombre
          estado
          anulacionPendiente
          observaciones
          puesto
        }
      }
    }
  }
`;

export const OBTENER_COMANDAS_PENDIENTES = gql`
  query obtenerComandasPendientes {
    obtenerComandasPendientes {
      id
      fecha
      fechaGenerada
      fechaFinalizada
      mesa {
        id
        numero
        piso {
          id
          nombre
        }
        tipo
      }
      subcuentas {
        id
        fecha
        fechaGenerada
        fechaFinalizada
        platillos {
          _id
          id
          nombre
          estado
          anulacionPendiente
          observaciones
          puesto
        }
      }
    }
  }
`;

export const OBTENER_COMANDAS_PENDIENTES_PARA_COCINA = gql`
  query obtenerComandasPendientesParaCocina {
    obtenerComandasPendientesParaCocina {
      id
      fecha
      fechaGenerada
      fechaFinalizada
      fechaEnPreparacion
      fechaEntregada
      mesa {
        id
        numero
        piso {
          id
          nombre
        }
        tipo
      }
      subcuentas {
        id
        fecha
        fechaGenerada
        fechaFinalizada
        platillos {
          _id
          id
          nombre
          estado
          anulacionPendiente
          observaciones
          puesto
          esParaCocina
        }
      }
    }
  }
`;

export const OBTENER_COMANDA_BY_ID = gql`
  query obtenerComandaById($id: ID) {
    obtenerComandaById(id: $id) {
      id
      mesa {
        id
      }
      fecha
      fechaGenerada
      fechaFinalizada
      preFactura
      estado
      subcuentas {
        id
        numero
        cliente {
          id
          nombre
          correos {
            email
          }
          telefonos {
            telefono
          }
        }
        fecha
        fechaGenerada
        fechaFinalizada
        platillos {
          _id
          id
          nombre
          precio
          descuento
          estado
          anulacionPendiente
          observaciones
          puesto
        }
        descuento
        total
        moneda
        formaPago {
          tipo {
            id
            nombre
          }
          monto
          moneda
        }
        estado
      }
    }
  }
`;

export const OBTENER_COMANDA_POR_MESA_FULL = gql`
  query obtenerComandaPorMesaFull($id: ID) {
    obtenerComandaPorMesa(id: $id) {
      id
      mesa {
        id
      }
      fecha
      fechaGenerada
      fechaFinalizada
      preFactura
      estado
      subcuentas {
        id
        numero
        cliente {
          id
          nombre
          correos {
            email
          }
          telefonos {
            telefono
          }
        }
        fecha
        fechaGenerada
        fechaFinalizada
        platillos {
          _id
          id
          nombre
          precio
          descuento
          estado
          anulacionPendiente
          observaciones
          puesto
        }
        descuento
        total
        moneda
        formaPago {
          tipo {
            id
            nombre
          }
          monto
          moneda
        }
        estado
      }
    }
  }
`;

export const SAVE_COMANDA = gql`
  mutation insertarComanda($input: ComandaInput) {
    insertarComanda(input: $input) {
      estado
      data {
        id
      }
      message
    }
  }
`;

export const CAMBIAR_ESTADO_COMANDA = gql`
  mutation cambiarEstadoComanda($id: ID!, $estado: String!) {
    cambiarEstadoComanda(id: $id, estado: $estado) {
      id
      estado
      message
      exitoso
    }
  }
`;

export const CAMBIAR_ESTADO_PLATILLOS = gql`
  mutation cambiarEstadoPlatillos($subcuentaId: ID!, $platilloIds: [ID!]!, $estado: String) {
    cambiarEstadoPlatillos(subcuentaId: $subcuentaId, platilloIds: $platilloIds, estado: $estado) {
      id
      estado
      message
      exitoso
    }
  }
`;

export const UPDATE_COMANDA = gql`
  mutation actualizarComanda($id: ID, $input: ComandaInput) {
    actualizarComanda(id: $id, input: $input) {
      estado
      message
    }
  }
`;

export const FINISH_COMANDA = gql`
  mutation finalizarComanda($id: ID) {
    finalizarComanda(id: $id) {
      estado
      message
    }
  }
`;

export const DELETE_COMANDA = gql`
  mutation desactivarComanda($id: ID) {
    desactivarComanda(id: $id) {
      estado
      message
    }
  }
`;
