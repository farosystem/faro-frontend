import { renderHook } from '@testing-library/react-hooks';
import useTicket, { TicketInput, TicketHeader, TicketTotals, roundTwo } from './useTicket';

// we only care that the hook invokes the external downloader with the
// exactly computed ReceiptData; the implementation of the PDF generator is
// covered elsewhere.
vi.mock('@/lib/thermalPrinter', () => ({
  downloadReceiptPDF: vi.fn()
}));

import { downloadReceiptPDF } from '@/lib/seiko-hacienda/shared/ticket/Ticket';

describe('useTicket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('computeTotals returns expected values', () => {
    const { result } = renderHook(() => useTicket<any>());
    const { computeTotals } = result.current;

    const totals: TicketTotals = {
      montoIVA: 15,
      montoServicio: 5,
      montoDescuento: 10,
      totalFinal: 110
    };

    const { impuestoTotal, descuento, subtotal } = computeTotals(totals);
    expect(impuestoTotal).toBe(20); // IVA + servicio
    expect(descuento).toBe(10);
    // subtotal = totalFinal - impuestoTotal + descuento
    expect(subtotal).toBe(100);
  });

  it('buildReceiptData includes electronic invoice info and header fields', () => {
    const { result } = renderHook(() => useTicket<any>());
    const { buildReceiptData } = result.current;

    const header: TicketHeader = {
      facturaId: 'F123',
      fecha: '2025-01-01T00:00:00',
      cajero: 'Test Cajero',
      cliente: 'Cliente X',
      metodoPago: 'Efectivo',
      montoRecibido: 200,
      mesa: 'A1'
    };

    const totals: TicketTotals = {
      montoIVA: 10,
      montoServicio: 0,
      montoDescuento: 5,
      totalFinal: 195
    };

    const items = [
      { id: '1', nombre: 'P1', precio: 100, cantidad: 1 },
      { id: '2', nombre: 'P2', precio: 90, cantidad: 1 }
    ];

    const electronic = {
      consecutivo: 'C-456',
      clave: 'K-789'
    };

    const receipt = buildReceiptData(header, totals, items, electronic);
    expect(receipt.facturaId).toBe('F123');
    expect(receipt.facturaElectronica).toBeDefined();
    expect(receipt.facturaElectronica?.clave).toBe('K-789');
    expect(receipt.facturaElectronica?.consecutivo).toBe('C-456');
    // ensure numbers are propagated correctly
    expect(receipt.total).toBe(195);
    expect(receipt.montoRecibido).toBe(200);
    expect(receipt.mesa).toBe('A1');
    // new IVA/servicio fields should be preserved
    expect(receipt.montoIVA).toBe(10);
    expect(receipt.montoServicio).toBe(0);
    // change should be rounded and stored
    expect(receipt.vuelto).toBe(roundTwo(header.montoRecibido - totals.totalFinal!));
  });

  it('downloadTicket maps body items and calls downloadReceiptPDF', async () => {
    const { result } = renderHook(() => useTicket<{ foo: string; precio: number }>());
    const { downloadTicket } = result.current;

    const input: TicketInput<{ foo: string; precio: number }> = {
      header: {
        fecha: 'now',
        cajero: 'c',
        cliente: 'x',
        metodoPago: 'm',
        montoRecibido: 0
      },
      totals: { totalFinal: 0 },
      body: [{ foo: 'bar', precio: 10 }],
      facturaElectronica: { consecutivo: '', clave: '' }
    };

    const mapper = (item: { foo: string; precio: number }) => ({
      id: item.foo,
      nombre: item.foo,
      precio: item.precio,
      cantidad: 1,
      ivaPercent: 5
    });
    const format = (n: number) => `$${n}`;

    await downloadTicket(input, format, mapper);
    expect(downloadReceiptPDF).toHaveBeenCalledTimes(1);
    const [calledData, calledFormat] = (downloadReceiptPDF as any).mock.calls[0];
    expect(calledFormat).toBe(format);
    expect(calledData.platillos[0].id).toBe('bar');
    // ivaPercent should be preserved through mapping
    expect(calledData.platillos[0].ivaPercent).toBe(5);
  });

  it('downloadTicket aggregates duplicate item ids into a single line', async () => {
    const { result } = renderHook(() => useTicket<{ foo: string; precio: number }>());
    const { downloadTicket } = result.current;

    const input: TicketInput<{ foo: string; precio: number }> = {
      header: {
        fecha: 'now',
        cajero: 'c',
        cliente: 'x',
        metodoPago: 'm',
        montoRecibido: 0
      },
      totals: { totalFinal: 0 },
      body: [
        { foo: 'dup', precio: 5 },
        { foo: 'dup', precio: 5 }
      ],
      facturaElectronica: { consecutivo: '', clave: '' }
    };

    const mapper = (item: { foo: string; precio: number }) => ({
      id: item.foo,
      nombre: item.foo,
      precio: item.precio,
      cantidad: 1,
      ivaPercent: 0
    });
    const format = (n: number) => n.toString();

    await downloadTicket(input, format, mapper);
    const [calledData] = (downloadReceiptPDF as any).mock.calls[0];
    expect(calledData.platillos.length).toBe(1);
    expect(calledData.platillos[0].cantidad).toBe(2);
  });
});
