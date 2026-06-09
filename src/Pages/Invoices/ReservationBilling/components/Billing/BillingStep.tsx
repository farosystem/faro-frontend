import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { useForm } from 'react-hook-form';

import { BillingStepProps } from './types';
import { useInvoiceItems } from '../../hooks/useInvoiceItems';
import { useInvoiceTotals } from '../../hooks/useInvoiceTotals';
import { useEmitInvoice } from '../../hooks/useEmitInvoice';

import InvoiceOptions from '@/Pages/Invoices/components/InvoiceOptions';
import SummaryRow from './SummaryRow';
import './BillingStep.css';
import Swal from 'sweetalert2';
import { CondicionesFacturacion } from '@/lib/seiko-hacienda/core/interfaces/condiciones-facturacion';
import { showInfoAlert } from '@/helpers/alert';
import { showError } from '@/Pages/Restaurant/Orders/Invoice/utils/restaurant-order-invoice-swal-utils';
import { useInvoiceOptions } from '@/lib/hooks/useInvoiceOptions';
import { findOptionByValue } from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';

const BillingStep = ({
  data,
  cliente,
  reserva,
  onElectronicInvoiceSuccess,
  registerSubmit
}: BillingStepProps) => {
  const { handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      TipoDocumento: '',
      CondicionVenta: '',
      TipoMedioPago: '',
      CodigoMoneda: '',
      MedioPagoOtros: '',
      PlazoCredito: '0'
    }
  });

  const { saleConditionOptions, documentTypeOptions, currencyOptions, paymentMethodOptions } =
    useInvoiceOptions();

  // Track selected values locally
  const [selectedCondicionVenta, setSelectedCondicionVenta] = useState<any>(null);
  const [selectedTipoFactura, setSelectedTipoFactura] = useState<any>(null);
  const [selectedTipoMoneda, setSelectedTipoMoneda] = useState<any>(null);
  const [selectedMetodoPago, setSelectedMetodoPago] = useState<any>(null);
  const [selectedPlazoCredito, setSelectedPlazoCredito] = useState<string | number>('0');

  const sourceData = data?.articulosLista
    ? {
        lines: data.articulosLista,
        items: data.articulosLista,
        articulosLista: data.articulosLista
      }
    : data;
  const { items } = useInvoiceItems(sourceData || {});

  const { subtotal, taxes, total } = useInvoiceTotals(items);
  const { isSubmitting, emit } = useEmitInvoice(onElectronicInvoiceSuccess);

  const onEmit = useCallback(
    async (formData: any) => {
      // Build formData from selected options
      const invoiceFormData = {
        TipoDocumento: selectedTipoFactura?.value || '',
        CondicionVenta: selectedCondicionVenta?.rawValue || selectedCondicionVenta?.value || '',
        TipoMedioPago: selectedMetodoPago?.rawValue || selectedMetodoPago?.value || '',
        CodigoMoneda: selectedTipoMoneda?.value || '',
        MedioPagoOtros: '',
        PlazoCredito: selectedPlazoCredito || '0'
      };

      const result = await emit({
        cliente,
        items,
        formData: invoiceFormData,
        reservaId: reserva?.id
      });

      if (result && result.result) {
        showInfoAlert({
          title: 'Factura emitida',
          text: 'La factura se emitió correctamente.',
          icon: 'success'
        });
        onElectronicInvoiceSuccess?.(result);
        return;
      }

      console.debug(result);

      const errorMessage = result?.response?.Mensaje || 'Revise los datos e intente de nuevo.';
      Swal.fire({
        title: 'Error al emitir',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#0BB197'
      });

      if (result?.response?.Mensaje) {
        console.error(result.response.Mensaje);
      }
    },
    [
      emit,
      cliente,
      items,
      onElectronicInvoiceSuccess,
      reserva?.id,
      selectedTipoFactura,
      selectedCondicionVenta,
      selectedMetodoPago,
      selectedTipoMoneda,
      selectedPlazoCredito
    ]
  );

  useEffect(() => {
    if (!registerSubmit) return;

    registerSubmit({
      submit: () => handleSubmit(onEmit)(),
      isSubmitting: () => isSubmitting
    });

    return () => registerSubmit(undefined);
  }, [registerSubmit, handleSubmit, isSubmitting, onEmit]);

  return (
    <div className="invoice-embedded">
      <Container fluid>
        <form id="invoice-embedded-form" onSubmit={handleSubmit(onEmit)}>
          <InvoiceOptions
            values={{
              CondicionVenta:
                selectedCondicionVenta?.rawValue || selectedCondicionVenta?.value || '',
              TipoDocumento: selectedTipoFactura?.value || '',
              CodigoMoneda: selectedTipoMoneda?.value || '',
              TipoMedioPago: selectedMetodoPago?.rawValue || selectedMetodoPago?.value || '',
              PlazoCredito: selectedPlazoCredito
            }}
            onChange={(field, value) => {
              switch (field) {
                case 'CondicionVenta':
                  const saleOpt = findOptionByValue(saleConditionOptions, value);
                  if (saleOpt) setSelectedCondicionVenta(saleOpt);
                  break;
                case 'TipoDocumento':
                  const docOpt = documentTypeOptions.find((o) => o.value === value);
                  if (docOpt) setSelectedTipoFactura(docOpt);
                  break;
                case 'CodigoMoneda':
                  const currOpt = currencyOptions.find((o) => o.value === value);
                  if (currOpt) setSelectedTipoMoneda(currOpt);
                  break;
                case 'TipoMedioPago':
                  const payOpt = paymentMethodOptions.find(
                    (o) => o.value === value || o.rawValue === value
                  );
                  if (payOpt) setSelectedMetodoPago(payOpt);
                  break;
                case 'PlazoCredito':
                  setSelectedPlazoCredito(value);
                  break;
              }
            }}
          />

          <Row className="items-table mb-3">
            <Col md={12}>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((it, idx) => {
                      const precio = Number(
                        it.precioCompra || it.PrecioUnitario || it.precioCompra || 0
                      );
                      const cantidad = Number(it.cantidadArticulo || it.Cantidad || 1);
                      const totalLinea = precio * cantidad;

                      return (
                        <tr key={idx}>
                          <td>{it.descripcion || it.Detalle}</td>
                          <td>{precio.toFixed(2)}</td>
                          <td className="text-center">{cantidad}</td>
                          <td className="text-end">{totalLinea.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted p-3">
                        No hay artículos agregados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Col>
          </Row>

          <Row className="justify-content-end totals-row">
            <Col md={5} lg={4}>
              <SummaryRow label="Subtotal" value={subtotal} />
              <SummaryRow label="Impuestos" value={taxes} />
              <hr className="my-2" />
              <SummaryRow label="Total" value={total} isBold />
            </Col>
          </Row>

          <div className="footer-actions mt-3 sticky-footer">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Cliente: <strong>{cliente?.nombre || '—'}</strong>
              </small>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Facturando...' : 'Facturar'}
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default BillingStep;
