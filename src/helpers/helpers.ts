import moment from 'moment-timezone';

export const calculateStockMovements = (datos) => {
  var cantidad = 0;
  if (!Array.isArray(datos)) {
    return 0;
  }
  datos.forEach((item) => {
    if (item.tipo === 'ENTRADA') {
      cantidad += item.cantidad;
    } else {
      cantidad -= item.cantidad;
    }
  });
  return cantidad;
};

export const getFechaTZ = (modo, fecha) => {
  // guard against undefined/null or non-string inputs
  if (!fecha || typeof fecha !== 'string' || !modo || typeof modo !== 'string') {
    return '';
  }

  const trimmed = fecha.trim();
  if (trimmed.length === 0 || modo.trim().length === 0) {
    return '';
  }

  // Try parsing with moment using the default ISO parsing first.
  // If the input is in a local format (e.g. "DD-MM-YYYY"), fall back to explicit formats.
  let m = moment.tz(trimmed, 'America/Costa_Rica');
  if (!m.isValid()) {
    m = moment.tz(
      trimmed,
      [
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DDTHH:mm:ss',
        'YYYY-MM-DD HH:mm:ss',
        'DD-MM-YYYY HH:mm:ss',
        'YYYY-MM-DD',
        'DD-MM-YYYY',
        'YYYY/MM/DD',
        'DD/MM/YYYY'
      ],
      true,
      'America/Costa_Rica'
    );
  }
  if (!m.isValid()) {
    // avoid RangeError in Intl formatting
    return '';
  }

  switch (modo) {
    case 'fecha':
      return m.format('DD-MM-YYYY');
    case 'hora':
      return m.format('hh:mm a');
    case 'fechaHora':
      return m.format('DD-MM-YYYY hh:mm a');
    case 'fechaHoraSegundos':
      return m.format('DD-MM-YYYY hh:mm:ss a');
    default:
      return m.format('DD-MM-YYYY');
  }
};

export const getFecha = (fecha) => {
  var date = new Date(fecha);
  var day = date.getDate() < 9 ? '0' + (date.getDate() + 1) : date.getDate() + 1;
  var mes = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  return date.getFullYear() + '/' + mes + '/' + day;
};

export const getFechaTable = (fechaString) => {
  if (fechaString !== null && fechaString.trim().length > 0) {
    const fecha = new Date(fechaString);

    return `${fecha.getDate() >= 10 ? fecha.getDate() : '0' + fecha.getDate()}-${fecha.getMonth() + 1 >= 10 ? fecha.getMonth() + 1 : '0' + (fecha.getMonth() + 1)}-${fecha.getFullYear()}`;
  }
  return '';
};

export const simbolosMoneda = {
  'US Dollar': '$',
  Colón: '₡',
  Yen: '¥',
  Euro: '€',
  Peso: '₱'
};
export const getSimboloMoneda = (nombre) => {
  const normalizado = nombre
    ?.trim()
    ?.toLowerCase()
    .replace(/s$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalizado.includes('dolar') || normalizado.includes('dollar'))
    return simbolosMoneda['US Dollar'];
  if (normalizado.includes('colon')) return simbolosMoneda['Colón'];
  if (normalizado.includes('yen')) return simbolosMoneda['Yen'];
  if (normalizado.includes('euro')) return simbolosMoneda['Euro'];
  if (normalizado.includes('peso')) return simbolosMoneda['Peso'];

  return nombre;
};
export const tienePermisoSidebar = (roles, modulo) => {
  roles.forEach((rol) => {
    rol.permisos.forEach((permiso) => {
      if (permiso.modulo === modulo) {
        if (permiso.agregar || permiso.editar || permiso.eliminar) {
          return true;
        }
      }
    });
  });
  return false;
};

export const tienePermisoAgregarModulo = (roles, modulo) => {
  roles.forEach((rol) => {
    rol.permisos.forEach((permiso) => {
      if (permiso.modulo === modulo) {
        if (permiso.agregar) {
          return true;
        }
      }
    });
  });
  return false;
};

export const tienePermisoEditarModulo = (roles, modulo) => {
  roles.forEach((rol) => {
    rol.permisos.forEach((permiso) => {
      if (permiso.modulo === modulo) {
        if (permiso.editar) {
          return true;
        }
      }
    });
  });
  return false;
};

export const tienePermisoEliminarModulo = (roles, modulo) => {
  roles.forEach((rol) => {
    rol.permisos.forEach((permiso) => {
      if (permiso.modulo === modulo) {
        if (permiso.eliminar) {
          return true;
        }
      }
    });
  });
  return false;
};

export const convertDate = (fechaStr) => {
  const currentYear = new Date().getFullYear();

  const formatter = new Intl.DateTimeFormat('es', { month: 'long' }); //'es' se cambia para manejar el idioma selecionado

  const regex = /(\d{1,2}) de (\w+)/;
  const match = fechaStr.match(regex);

  if (!match) {
    throw new Error('Formato de fecha inválido. Usa el formato "DD de MMMM".');
  }

  const [, day, monthName] = match;

  let monthIndex = -1;

  for (let i = 0; i < 12; i++) {
    const formattedMonth = formatter
      .formatToParts(new Date(currentYear, i))
      .find((part) => part.type === 'month').value;
    if (formattedMonth.toLowerCase() === monthName.toLowerCase()) {
      monthIndex = i;
      break;
    }
  }

  if (monthIndex === -1) {
    throw new Error('Nombre del mes inválido.');
  }
  const date = new Date(currentYear, monthIndex, day);

  if (isNaN(date.getTime())) {
    throw new Error('Fecha inválida.');
  }

  const monthFormatted = String(date.getMonth() + 1).padStart(2, '0');
  const dayFormatted = String(date.getDate()).padStart(2, '0');

  return `${currentYear}-${monthFormatted}-${dayFormatted}`;
};

export const timestampToDateLocal = (timestamp, format) => {
  const date = new Date(timestamp);

  const day = String(date.getUTCDate()).padStart(2, '0'); // Obtener el día y agregar ceros a la izquierda si es necesario
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes (de 0 a 11) y agregar 1
  const year = date.getUTCFullYear();

  if (format === 'label') {
    return `${day}/${month}/${year}`;
  }
  if (format === 'date') {
    return `${year}-${month}-${day}`;
  }
};
