import gql from 'graphql-tag';

export const OBTENER_RESERVAS_INHOUSE_HOY = gql`
  query obtenerReservasInhouseHoy {
    obtenerReservaHabitaciones {
      id
      cliente {
        nombre
        nombreFacturacion
      }
      habitacion {
        id
        numeroHabitacion
      }
      reserva {
        id
        cliente {
          id
          nombre
        }
        tipo
      }
      fechaEntrada
      fechaSalida
      horaCheckIn
      estado
    }
  }
`;

export const OBTENER_RESERVAS = gql`
  query obtenerReservas {
    obtenerReservas {
      id
      numeroPersonas {
        adulto
        ninos
      }
      serviciosGrupal
      tipo
      tours
      paquetes
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
      fechaReserva
      total
      metodoPago
      politicas
      petFriendly
      petQuantity
      estado
    }
  }
`;

export const OBTENER_RESERVAS_SERVICIOS_EXTERNOS = gql`
  query obtenerReservasServiciosExternos {
    obtenerReservasServiciosExternos {
      id
      tipo
      clienteServicioExterno
      serviciosExternos
    }
  }
`;

export const OBTENER_RESERVA = gql`
  query obtenerReserva($id: ID) {
    obtenerReserva(id: $id) {
      id
      numeroPersonas {
        adulto
        ninos
      }
      serviciosGrupal
      tipo
      tours
      paquetes
      notas
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
      fechaReserva
      total
      metodoPago
      politicas
      petFriendly
      petQuantity
      estado
    }
  }
`;
export const OBTENER_RESERVA_CLIENTE = gql`
  query obtenerReservaPorCliente($nombreCliente: String) {
    obtenerReservaPorCliente(nombreCliente: $nombreCliente) {
      id
      numeroPersonas {
        adulto
        ninos
      }
      serviciosGrupal
      tipo
      tours
      paquetes
      notas
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
      fechaReserva
      total
      metodoPago
      politicas
      petFriendly
      petQuantity
      estado
    }
  }
`;

export const SAVE_RESERVA = gql`
  mutation insertarReserva($input: ReservaInput, $bookingRoom: ReservaHabitacionInput) {
    insertarReserva(input: $input, bookingRoom: $bookingRoom) {
      estado
      message
    }
  }
`;
export const UPDATE_SERVICIOS_GRUPALES = gql`
  mutation actualizarServiciosGrupales($id: ID, $serviciosGrupales: [JSON]) {
    actualizarServiciosGrupales(id: $id, serviciosGrupales: $serviciosGrupales) {
      estado
      message
    }
  }
`;

export const SAVE_RESERVA_SERVICIO_EXTERNO = gql`
  mutation insertarReservaServicioExterno($input: ReservaServicioExternoInput) {
    insertarReservaServicioExterno(input: $input) {
      estado
      message
    }
  }
`;

export const UPDATE_RESERVA = gql`
  mutation actualizarReserva($id: ID, $input: ReservaInput, $bookingRoom: ReservaHabitacionInput) {
    actualizarReserva(id: $id, input: $input, bookingRoom: $bookingRoom) {
      estado
      message
    }
  }
`;

export const UPDATE_RESERVA_INFO = gql`
  mutation actualizarReservaInfo($id: ID, $input: ReservaInput) {
    actualizarReservaInfo(id: $id, input: $input) {
      estado
      message
    }
  }
`;

export const DELETE_RESERVA = gql`
  mutation desactivarReserva($id: ID) {
    desactivarReserva(id: $id) {
      estado
      message
    }
  }
`;

export const CHECKIN_RESERVA = gql`
  mutation checkIn($id: ID!, $reserva: ID!, $huespedes: [JSON!]!, $items: [JSON!]!) {
    checkIn(id: $id, reserva: $reserva, huespedes: $huespedes, items: $items) {
      estado
      message
    }
  }
`;

export const CHECKIN_INHOUSE_RESERVA = gql`
  mutation checkInInHouse($id: ID!, $reserva: ID!) {
    checkInInHouse(id: $id, reserva: $reserva) {
      estado
      message
    }
  }
`;

export const CHECKOUT_RESERVA = gql`
  mutation checkOut($id: ID!, $reserva: ID!) {
    checkOut(id: $id, reserva: $reserva) {
      estado
      message
    }
  }
`;

export const UPDATE_ESTADO_RESERVA = gql`
  mutation updateState($id: ID!) {
    updateState(id: $id) {
      estado
      message
    }
  }
`;
