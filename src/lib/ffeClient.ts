import { HttpClient } from './HttpClient';

interface GetDocumentRequest {
  consecutivo: string;
  clave: string;
}

export type EmitirFacturaRespuesta = {
  result: boolean;
  response: {
    Id: number;
    Cliente: number;
    NumeroConsecutivo: string;
    Clave: string;
    CodigoRespuesta: number;
    Mensaje: string;
    Fecha: string;
  };
};

export class FfeClient extends HttpClient {
  constructor(timeout = 12000) {
    super(import.meta.env.VITE_API_INVOICE_SERVER, timeout);
  }

  public sendDocument = async (payload: object): Promise<EmitirFacturaRespuesta> => {
    const response = await this.post<EmitirFacturaRespuesta>('/send/document', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  };

  public getDocument = async (payload: GetDocumentRequest) => {
    const body = {};

    return await this.post('/get/document', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };
}
