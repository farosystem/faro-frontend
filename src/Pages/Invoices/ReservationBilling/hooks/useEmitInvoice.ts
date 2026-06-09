import { useState } from 'react';
import { ApiError } from '@/lib/HttpClient';
import { EmitirFacturaRespuesta, FfeClient } from '@/lib/ffeClient';
import { Cliente } from '@/gql/graphql';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';
import { CondicionesFacturacion } from '@/lib/seiko-hacienda/core/interfaces/condiciones-facturacion';
import {
  getOptionLabel,
  buildFacturaElectronica,
  extractCondicionesFromSelection
} from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';
import { showError } from '@/Pages/Restaurant/Orders/Invoice/utils/restaurant-order-invoice-swal-utils';
import { useMutation } from '@apollo/client';
import { UPDATE_RESERVA_INFO } from '@/services/ReservaService';

type EmitRequest = {
  cliente?: Cliente;
  items: LineaDetalleReservaUI[];
  formData: CondicionesFacturacion;
  reservaId?: string;
};

type EmitResponse = {
  ok: boolean;
  message?: string;
};

interface EmitInvoiceResponse {
  isSubmitting: boolean;
  emit: (facturaElectronica: EmitRequest) => Promise<any>;
}

export function useEmitInvoice(onSuccess?: () => void): EmitInvoiceResponse {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [updateReservaInfo] = useMutation(UPDATE_RESERVA_INFO);

  const emit = async ({
    cliente,
    items,
    formData,
    reservaId
  }: {
    cliente?: Cliente;
    items: LineaDetalleReservaUI[];
    formData: CondicionesFacturacion;
    reservaId?: string;
  }): Promise<any> => {
    if (
      !formData ||
      !formData.TipoDocumento ||
      !formData.CondicionVenta ||
      !formData.TipoMedioPago ||
      !formData.CodigoMoneda
    ) {
      return {
        result: false,
        response: null
      };
    }

    // medio pago "99" requires a description and must respect length notes 6/7
    if (formData.TipoMedioPago === '99') {
      const desc = (formData.MedioPagoOtros || '').trim();
      if (!desc) {
        showError('Debe indicar el medio de pago cuando se selecciona "Otros"');
        return { result: false, response: null };
      }
      if (desc.length < 3 || desc.length > 100) {
        showError('El detalle de medio de pago debe tener entre 3 y 100 caracteres');
        return { result: false, response: null };
      }
    }

    setIsSubmitting(true);

    try {
      const condiciones = {
        TipoDocumento: formData.TipoDocumento,
        CondicionVenta: formData.CondicionVenta,
        TipoMedioPago: formData.TipoMedioPago,
        CodigoMoneda: formData.CodigoMoneda,
        MedioPagoOtros: formData.MedioPagoOtros || ''
      };
      const facturaElectronica = await buildFacturaElectronica('reserva', {
        cliente,
        items,
        condicionesFacturacion: condiciones,
        referencia: null
      });

      if (facturaElectronica) {
        const ffeClient = new FfeClient();

        console.log('Factura electrónica a enviar:', facturaElectronica);
        const res = await ffeClient.sendDocument(facturaElectronica);
        console.log('Respuesta del FE:', res);

        if (res.result) {
          // Marcar la reserva como pagada después de emitir la factura
          if (reservaId) {
            try {
              await updateReservaInfo({
                variables: {
                  id: reservaId,
                  input: { estado: 'Pagada' }
                },
                errorPolicy: 'all'
              });
            } catch (error) {
              console.error('Error actualizando estado de reserva a Pagada:', error);
            }
          }
          onSuccess?.();
          return res;
        } else {
          showError(res.response || 'Error desconocido al emitir factura');
          return {
            result: false,
            response: res.response || { Mensaje: 'Error desconocido al emitir factura' }
          };
        }
      } else {
        console.error('Error: facturaElectronica es null');
        return {
          result: false,
          response: { Mensaje: 'No se pudo construir la factura electrónica' }
        };
      }
    } catch (error: unknown) {
      console.error('emit invoice error', error);

      // si buildEmitirFacturaRequest lanzó Error => mostrar su mensaje
      if (error instanceof Error && !(error instanceof ApiError)) {
        return {
          result: false,
          response: { Mensaje: error.message || 'Error desconocido al construir factura' }
        };
      }

      // manejo existente para ApiError / timeouts...
      let message = 'Ha ocurrido un error inesperado.';
      if (error instanceof ApiError) {
        if (error.status === 422) {
          const details = (error as any).details;
          const detailMsg =
            details && details.errors
              ? Object.values(details.errors).flat().join('; ')
              : error.message;
          message = `Datos inválidos: ${detailMsg}`;
        } else if (error.status === 500) {
          message = 'Error interno del servidor de facturación.';
        } else {
          message = error.message || message;
        }
      } else {
        const errMsg = (error as any)?.message;
        if (errMsg === 'Tiempo de espera agotado' || errMsg === 'Wait time done') {
          message =
            'La conexión con Hacienda tardó demasiado. Revisa si la factura se emitió en el historial.';
        } else if (errMsg) {
          message = errMsg;
        }
      }
      // despues de calcular message buscamos si tiene la famosa advertencia de emisor
      if (message.includes('domicilio ubicado en Costa Rica')) {
        message =
          'Hacienda rechazó la factura: el domicilio del emisor no coincide con un registro válido. ' +
          'Revisa la configuración de tu emisor en el servidor (provincia, cantón, distrito).';
      }
      return {
        result: false,
        response: null
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, emit };
}
