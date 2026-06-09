import { consultarCambioDolar, consultarCambioEuro } from '@/lib/haciendaClient';
import { CODIGO_MONEDA } from '../core/enums';

interface CacheTipoCambio {
  valor: number;
  fechaLocal: string;
}

export async function consultarTipoCambio(codigoMoneda: string): Promise<number> {
  if (codigoMoneda === CODIGO_MONEDA.CRC) return 1;

  const CACHE_KEY = `faro_tc_${codigoMoneda}`;
  const fechaHoy = new Date().toISOString().split('T')[0];

  try {
    const cacheString = localStorage.getItem(CACHE_KEY);
    if (cacheString) {
      const cacheData: CacheTipoCambio = JSON.parse(cacheString);
      if (cacheData.fechaLocal === fechaHoy) {
        return cacheData.valor;
      }
    }
  } catch (e) {
    console.warn('Error leyendo caché, consultando API...', e);
  }

  let valorVenta = 500;

  try {
    if (codigoMoneda === CODIGO_MONEDA.USD) {
      const response = await consultarCambioDolar();
      valorVenta = response.venta.valor;
    } else if (codigoMoneda === CODIGO_MONEDA.EUR) {
      const response = await consultarCambioEuro();
      valorVenta = response.colones;
    } else {
      return 1;
    }

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        valor: valorVenta,
        fechaLocal: fechaHoy
      })
    );
  } catch (error) {
    console.error(`Error consultando API de Hacienda para ${codigoMoneda}:`, error);
  }

  return valorVenta;
}
