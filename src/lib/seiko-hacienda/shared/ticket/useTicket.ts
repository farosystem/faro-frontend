import { downloadReceiptPDF, ReceiptData } from '@/lib/seiko-hacienda/shared/ticket/Ticket';

// round to two decimal places utility (exported for tests)
export function roundTwo(v: number): number {
  return Math.round(v * 100) / 100;
}

// header information common to all tickets
export interface TicketHeader {
  facturaId?: string;
  fecha: string;
  cajero: string;
  cliente: string;
  metodoPago: string;
  montoRecibido: number;
  mesa?: string;
}

export interface TicketElectronicInvoice {
  consecutivo: string;
  clave: string;
}

export interface TicketTotals {
  montoIVA?: number;
  montoServicio?: number;
  montoDescuento?: number;
  totalFinal?: number;
}

// internal receipt item shape used by hook (not exported)
interface ReceiptItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  // IVA percentage for this line, if any
  ivaPercent?: number;
}

// input consumed by callers, generic body type T
export interface TicketInput<T> {
  header: TicketHeader;
  totals: TicketTotals;
  body: T[];
  facturaElectronica: TicketElectronicInvoice;
}

const useTicket = <T>() => {
  /**
   * map consumer-specific body items to the internal receipt item shape
   */
  const mapItems = (body: T[], mapper: (item: T) => ReceiptItem): ReceiptItem[] => body.map(mapper);

  const computeTotals = (totals: TicketTotals) => {
    // IVA percentage per item does not change how we compute aggregate
    const impuestoTotal = (totals.montoIVA || 0) + (totals.montoServicio || 0);
    const descuento = totals.montoDescuento || 0;
    const subtotal = (totals.totalFinal || 0) - impuestoTotal + descuento;
    return { impuestoTotal, descuento, subtotal };
  };

  const buildReceiptData = (
    header: TicketHeader,
    totals: TicketTotals,
    platillos: ReceiptItem[],
    electronic: TicketElectronicInvoice
  ): ReceiptData => {
    const { impuestoTotal, descuento, subtotal } = computeTotals(totals);
    return {
      platillos,
      subtotal,
      impuestos: impuestoTotal,
      montoIVA: totals.montoIVA,
      montoServicio: totals.montoServicio,
      descuento,
      total: totals.totalFinal || 0,
      facturaId: header.facturaId,
      fecha: header.fecha,
      cajero: header.cajero,
      cliente: header.cliente,
      metodoPago: header.metodoPago,
      montoRecibido: header.montoRecibido,
      // add rounded change here so consumer (PDF) doesn't need to recalc
      vuelto: roundTwo(header.montoRecibido - (totals.totalFinal || 0)),
      mesa: header.mesa,
      facturaElectronica: {
        consecutivo: electronic.consecutivo,
        clave: electronic.clave || ''
      }
    };
  };

  // combine items with the same id by summing their quantities. if the same
  // id appears with different ivaPercent, the first one wins (should not
  // happen in practice since all items use the global rate).  This ensures the
  // ticket prints a single row per product.
  const aggregateItems = (items: ReceiptItem[]): ReceiptItem[] => {
    const map: Record<string, ReceiptItem> = {};
    items.forEach((it) => {
      if (map[it.id]) {
        map[it.id].cantidad += it.cantidad;
      } else {
        map[it.id] = { ...it };
      }
    });
    return Object.values(map);
  };

  const downloadTicket = async (
    input: TicketInput<T>,
    format: (n: number) => string,
    // convert a consumer body element into the standard item shape
    mapper: (item: T) => ReceiptItem
  ) => {
    let items: ReceiptItem[] = mapItems(input.body, mapper);

    // collapse duplicates so the printed ticket shows quantities instead of
    // repeated lines for the same product.
    items = aggregateItems(items);

    const receiptData = buildReceiptData(
      input.header,
      input.totals,
      items,
      input.facturaElectronica
    );
    await downloadReceiptPDF(receiptData, format);
  };

  return {
    buildReceiptData,
    computeTotals,
    downloadTicket
  };
};

export default useTicket;
