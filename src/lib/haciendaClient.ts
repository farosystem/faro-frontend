import { HttpClient } from './HttpClient';

type CambioDolarResponse = {
  venta: {
    fecha: string;
    valor: number;
  };
  compra: {
    fecha: string;
    valor: number;
  };
};

type CambioEuroResponse = {
  fecha: string;
  dolares: number;
  colones: number;
};

type ContribuyenteResponse = {
  nombre: string;
  tipoIdentification: string;
  regimen: {
    codigo: number;
    descripcion: string;
  };
  situacion: {
    moroso: string;
    omiso: string;
    estado: string;
    administracionTributaria: string;
  };
  actividades: ActividadEconomica[];
};

type ActividadEconomica = {
  estado: string;
  tipo: string;
  codigo: string;
  descripcion: string;
  ciiu3: CIIU3[];
};

type CIIU3 = {
  codigo: string;
  descripcion: string;
};

export const haciendaClient = new HttpClient(import.meta.env.VITE_API_HACIENDA);

/**
 * Permite obtener el nombre, el tipo de identificación, el régimen,
 * la situación tributaria y las actividades económicas asociadas a un contribuyente.
 */
export const consultarContribuyente = async (identification: string) => {
  return await haciendaClient.get<ContribuyenteResponse>(
    `/fe/ae?identificacion=${identification}`,
    {
      credentials: 'omit'
    }
  );
};

/**
 * Permite obtener el tipo de cambio del dólar (compra/venta). No requiere parámetros.
 */
export const consultarCambioDolar = async () => {
  return await haciendaClient.get<CambioDolarResponse>('/indicadores/tc/dolar', {
    credentials: 'omit'
  });
};

/**
 * Permite obtener el tipo de cambio del euro (compra/venta). No requiere parámetros.
 */
export const consultarCambioEuro = async () => {
  return await haciendaClient.get<CambioEuroResponse>('/indicadores/tc/euro', {
    credentials: 'omit'
  });
};
