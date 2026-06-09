import dayjs from 'dayjs';

export const NOTA_DEFAULT = {
  nota: '',
  fecha: dayjs().format('YYYY-MM-DD'),
  area: ''
};

export const validarNota = (nota) => {
  const errores = [];

  // Required field validations
  if (!nota.nota || nota.nota.trim() === '') {
    errores.push('El contenido de la nota es requerido');
  }

  if (!nota.fecha) {
    errores.push('La fecha es requerida');
  }
  if (!nota.area) {
    errores.push('El área es requerida');
  }

  // Content validations
  if (nota.nota && nota.nota.length > 1000) {
    errores.push('El contenido de la nota no puede exceder 1000 caracteres');
  }

  if (nota.nota && nota.nota.length < 5) {
    errores.push('El contenido de la nota debe tener al menos 5 caracteres');
  }

  // Date validations
  if (nota.fecha) {
    const fechaNota = dayjs(nota.fecha);
    const fechaActual = dayjs();

    if (!fechaNota.isValid()) {
      errores.push('La fecha no es válida');
    }

    // Allow future dates for planning purposes
    const maxFutureDate = fechaActual.add(1, 'year');
    if (fechaNota.isAfter(maxFutureDate)) {
      errores.push('La fecha no puede ser mayor a un año en el futuro');
    }

    // Reasonable past date limit
    const minPastDate = fechaActual.subtract(2, 'years');
    if (fechaNota.isBefore(minPastDate)) {
      errores.push('La fecha no puede ser anterior a 2 años');
    }
  }

  // Type validation
  if (nota.tipo && !Object.values(TIPOS_NOTA).includes(nota.tipo)) {
    errores.push('El tipo de nota no es válido');
  }

  return {
    esValida: errores.length === 0,
    errores
  };
};

export default {
  NOTA_DEFAULT,
  validarNota
};
