import gql from 'graphql-tag';

export const OBTENER_RESERVAHABITACIONES = gql`
  query obtenerReservaHabitaciones {
    obtenerReservaHabitaciones {
      id
      habitacion {
        id
        numeroHabitacion
      }
      fechaEntrada
      fechaSalida
    }
  }
`;

export const OBTENER_RESERVAHABITACION = gql`
  query obtenerReservaHabitacion($id: ID) {
    obtenerReservaHabitacion(id: $id) {
      id
      serviciosExtra
      toursExtra
      cargosHabitacion
      serviciosExternos
      items
      huespedes {
        nombre
        identificacion
      }
      habitacion {
        id
        numeroHabitacion
        tipoHabitacion {
          id
          nombre
          descripcion
          precioBase
        }
        precioPorNoche
        descripcion
        comodidades {
          id
          nombre
          descripcion
        }
        estado
      }
      fechaEntrada
      fechaSalida
      estado
    }
  }
`;

export const OBTENER_FULL_RESERVAHABITACION = gql`
  query obtenerReservaHabitacionesFull {
    obtenerReservaHabitaciones {
      id
      habitacion {
        id
        numeroHabitacion
        tipoHabitacion {
          nombre
          precioBase
        }
      }
      serviciosExtra
      serviciosExternos
      toursExtra
      reserva {
        id
        numeroPersonas {
          adulto
          ninos
        }
        cliente {
          id
          nombreFacturacion
          nombre
        }
        serviciosGrupal
        fechaReserva
        tours
      }
      cargosHabitacion
      estado
      fechaEntrada
      fechaSalida
      horaCheckIn
      horaCheckOut
      cliente {
        nombre
        nombreFacturacion
        codigo
        pais
        telefono
        correo
      }
    }
  }
`;

export const OBTENER_RESERVA_HABITACION_BY_NUMERO = gql`
  query obtenerReservaPorHabitacion($numeroHabitacion: String) {
    obtenerReservaPorHabitacion(numeroHabitacion: $numeroHabitacion) {
      id
      serviciosExtra
      reserva {
        id
        numeroPersonas {
          adulto
          ninos
        }
        cliente {
          id
          nombreFacturacion
        }
        serviciosGrupal
        fechaReserva
        tours
      }
      fechaEntrada
      fechaSalida
      estado
    }
  }
`;

export const OBTENER_RESERVA_HABITACIONES_POR_FECHA = gql`
  query obtenerReservaHabitacionesPorFecha($fecha: String!) {
    obtenerReservaHabitacionesPorFecha(fecha: $fecha) {
      id
      serviciosExtra
      toursExtra
      cargosHabitacion
      serviciosExternos
      items
      habitacion {
        id
        numeroHabitacion
        tipoHabitacion {
          id
          nombre
          descripcion
          precioBase
        }
        precioPorNoche
        descripcion
        comodidades {
          id
          nombre
          descripcion
        }
        estado
      }
      reserva {
        id
        numeroPersonas {
          adulto
          ninos
        }
        cliente {
          id
          tipo
          nombre
          nombreFacturacion
          codigo
          pais
          ciudad
          city
          calle
          cp
          direccion
          telefonos {
            telefono
            ext
            descripcion
          }
          correos {
            email
          }
        }
        usuario {
          nombre
          cedula
        }
        serviciosGrupal
        fechaReserva
        tours
        paquetes
        total
        metodoPago
        politicas
        estado
      }
      fechaEntrada
      fechaSalida
      estado
    }
  }
`;
export const UPDATE_SERVICIOS_EXTRAS = gql`
  mutation actualizarServiciosExtras($id: ID, $serviciosExtras: [JSON]) {
    actualizarServiciosExtras(id: $id, serviciosExtras: $serviciosExtras) {
      estado
      message
    }
  }
`;
export const UPDATE_RESERVA_HABITACION = gql`
  mutation actualizarReservaHabitacion($id: ID, $input: ReservaHabitacionInput) {
    actualizarReservaHabitacion(id: $id, input: $input) {
      estado
      message
    }
  }
`;
