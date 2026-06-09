export const useDateUtils = () => {
  const getTimeInCostaRica = (hour12: boolean) => {
    const horaCR = new Date().toLocaleTimeString('es-CR', {
      timeZone: 'America/Costa_Rica',
      hour12: hour12,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return horaCR;
  };

  const getTimeDateInCostaRica = (hour12: boolean) => {
    const fechaCR = new Date().toLocaleString('es-CR', {
      timeZone: 'America/Costa_Rica',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return fechaCR;
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getTodayDateString();
  const weekAgoDate = new Date();
  const monthAgoDate = new Date();

  weekAgoDate.setDate(weekAgoDate.getDate() - 7);
  monthAgoDate.setDate(monthAgoDate.getDate() - 30);

  const buildDateStr = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  /**
   * Return a verbose Spanish description of the given date.
   * E.g. "miércoles, 9 de octubre del 2025" or
   * "día miércoles, mes octubre, del 2025" which can be
   * adjusted as needed by the caller.
   */
  const verboseDate = (date: Date | string | null | undefined) => {
    if (date == null) return '';

    let d: Date;
    if (typeof date === 'string') {
      d = new Date(date);
    } else {
      d = date;
    }

    // invalid date guard
    if (!isFinite(d.getTime())) {
      return '';
    }

    const formatter = new Intl.DateTimeFormat('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    // formatter produces e.g. "miércoles, 9 de octubre de 2025"
    return formatter.format(d);
  };

  const weekAgoStr = buildDateStr(weekAgoDate);
  const monthAgoDateStr = buildDateStr(monthAgoDate);

  return {
    today,
    weekAgoDate,
    weekAgoStr,
    monthAgoDate,
    monthAgoDateStr,
    verboseDate,
    getTimeInCostaRica,
    getTimeDateInCostaRica
  };
};
