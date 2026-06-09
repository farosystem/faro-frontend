import { Ticket, ReceiptData } from '@/lib/seiko-hacienda/shared/ticket/Ticket';
import { PDFViewer } from '@react-pdf/renderer';
import { useDateUtils } from '@/lib/hooks/useDateUtils';

// simple number formatter used by Ticket
const defaultFormat = (n) => n.toFixed(2);

const { getTimeDateInCostaRica } = useDateUtils();

const subtotal = 10.0;
const iva13 = subtotal * 0.13;
const servicio10 = subtotal * 0.1;
const descuento = 2;
const total = subtotal - descuento + iva13 + servicio10;

const sampleData: ReceiptData = {
  facturaId: 'DEV-001',
  platillos: [
    { id: '1', nombre: 'Café', precio: 2.5, cantidad: 2 },
    { id: '2', nombre: 'Sandwich', precio: 5.0, cantidad: 1 }
  ],
  total: total,
  subtotal: subtotal,
  impuestos: iva13 + servicio10,
  montoIVA: iva13,
  montoServicio: servicio10,
  fecha: getTimeDateInCostaRica(true),
  cajero: 'Cajero',
  cliente: 'Cliente General',
  metodoPago: 'Tarjeta',
  montoRecibido: total,
  descuento: 2,
  mesa: 'Mesa 5',
  facturaElectronica: {
    consecutivo: '00100001040000000003',
    clave: '50603032600011540031400100001040000000003174003228'
  }
};

const InvoiceDev = () => (
  <div style={{ padding: 20 }}>
    <h1>Factura de prueba (desarrollo)</h1>
    <p>
      Cambios a <code>thermalPrinter.tsx</code> o este componente se aplicarán al instante.
    </p>
    <div style={{ height: '800px', marginTop: 20 }}>
      <PDFViewer width="100%" height="100%">
        <Ticket data={sampleData} format={defaultFormat} />
      </PDFViewer>
    </div>
  </div>
);

export default InvoiceDev;

if (import.meta.hot) {
  import.meta.hot.accept();
}
