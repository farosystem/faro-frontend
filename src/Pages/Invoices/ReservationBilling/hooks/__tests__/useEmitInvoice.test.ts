import { renderHook, act } from '@testing-library/react-hooks';
import { useEmitInvoice } from '../useEmitInvoice';
import { showError } from '@/Pages/Restaurant/Orders/Invoice/utils/restaurant-order-invoice-swal-utils';

vi.mock('@/Pages/Restaurant/Orders/Invoice/utils/restaurant-order-invoice-swal-utils', () => ({
  showError: vi.fn()
}));

// minimal stub for buildFacturaElectronica - avoid network
vi.mock('@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers', () => ({
  buildFacturaElectronica: vi.fn().mockResolvedValue({})
}));

import { buildFacturaElectronica } from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';

describe('useEmitInvoice hook', () => {
  it('shows error and refuses to emit when medio pago 99 without description', async () => {
    const { result } = renderHook(() => useEmitInvoice());
    await act(async () => {
      const res = await result.current.emit({
        cliente: null,
        items: [],
        formData: {
          TipoDocumento: '01',
          CondicionVenta: '01',
          TipoMedioPago: '99',
          CodigoMoneda: 'CRC',
          MedioPagoOtros: ''
        }
      });
      expect(res).toEqual({ result: false, response: null });
      expect(showError).toHaveBeenCalledWith(expect.stringContaining('Debe indicar'));
      expect(buildFacturaElectronica).not.toHaveBeenCalled();
    });
  });

  it('rejects descriptions shorter than 3 characters', async () => {
    const { result } = renderHook(() => useEmitInvoice());
    await act(async () => {
      const res = await result.current.emit({
        cliente: null,
        items: [],
        formData: {
          TipoDocumento: '01',
          CondicionVenta: '01',
          TipoMedioPago: '99',
          CodigoMoneda: 'CRC',
          MedioPagoOtros: 'ab'
        }
      });
      expect(res).toEqual({ result: false, response: null });
      expect(showError).toHaveBeenCalledWith(expect.stringContaining('entre 3 y 100'));
      expect(buildFacturaElectronica).not.toHaveBeenCalled();
    });
  });

  it('rejects descriptions longer than 100 characters', async () => {
    const { result } = renderHook(() => useEmitInvoice());
    await act(async () => {
      const longDesc = 'x'.repeat(101);
      const res = await result.current.emit({
        cliente: null,
        items: [],
        formData: {
          TipoDocumento: '01',
          CondicionVenta: '01',
          TipoMedioPago: '99',
          CodigoMoneda: 'CRC',
          MedioPagoOtros: longDesc
        }
      });
      expect(res).toEqual({ result: false, response: null });
      expect(showError).toHaveBeenCalledWith(expect.stringContaining('entre 3 y 100'));
      expect(buildFacturaElectronica).not.toHaveBeenCalled();
    });
  });
});
