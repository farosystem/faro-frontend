import axios from 'axios';

// URL base para la API de ORBE
const API_BASE_URL = 'http://localhost:4000/api/orbe';

/**
 * Servicio para manejar las operaciones con la API ORBE
 */
class OrbeService {
  /**
   * Actualiza la disponibilidad de una habitación en ORBE
   * @param {Object} params - Parámetros para la actualización
   * @param {string} params.roomType - Código del tipo de habitación
   * @param {string} params.dateMode - Modo de fecha: "single" o "range"
   * @param {string} params.date - Fecha específica en formato YYYY-MM-DD (para dateMode="single")
   * @param {string} params.startDate - Fecha de inicio en formato YYYY-MM-DD (para dateMode="range")
   * @param {string} params.endDate - Fecha de fin en formato YYYY-MM-DD (para dateMode="range")
   * @param {number} params.quantity - Cantidad de habitaciones disponibles
   * @param {string} params.status - Estado (Open/Closed)
   * @returns {Promise<Object>} - Respuesta de la API
   */
  static async updateAvailability({
    roomType,
    dateMode,
    date,
    startDate,
    endDate,
    quantity,
    status
  }) {
    try {
      let requestBody = {
        roomType,
        quantity: parseInt(quantity),
        status
      };

      // Agregar parámetros de fecha según el modo
      if (dateMode === 'single') {
        requestBody.date = date;
      } else if (dateMode === 'range') {
        requestBody.startDate = startDate;
        requestBody.endDate = endDate;
      }

      const response = await axios.post(`${API_BASE_URL}/availability`, requestBody);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating availability:', error);

      let errorMessage = 'Error al actualizar disponibilidad';

      if (error.response) {
        // Error del servidor
        switch (error.response.status) {
          case 400:
            errorMessage = 'Datos inválidos proporcionados';
            break;
          case 502:
            errorMessage = 'Error de comunicación con ORBE';
            break;
          case 504:
            errorMessage = 'Timeout en la conexión con ORBE';
            break;
          default:
            errorMessage = error.response.data?.error || errorMessage;
        }
      } else if (error.request) {
        // Error de red
        errorMessage = 'Error de conexión con el servidor';
      }

      return {
        success: false,
        error: errorMessage,
        details: error.response?.data
      };
    }
  }

  /**
   * Obtiene las reservas desde ORBE
   * @returns {Promise<Object>} - Lista de reservas
   */
  static async getReservations() {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations`);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching reservations:', error);

      return {
        success: false,
        error: 'Error al obtener reservas de ORBE',
        details: error.response?.data
      };
    }
  }

  /**
   * Envía notificación de reconocimiento de reserva a ORBE
   * @param {string} resCode - Código de la reserva
   * @param {string} status - Estado de reconocimiento (acknowledged/pending)
   * @returns {Promise<Object>} - Respuesta de la API
   */
  static async acknowledgeReservation(resCode, status = 'acknowledged') {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications`, {
        reservations: [{ Res_Code: resCode }]
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error acknowledging reservation:', error);

      return {
        success: false,
        error: 'Error al reconocer reserva en ORBE',
        details: error.response?.data
      };
    }
  }
}

export default OrbeService;
