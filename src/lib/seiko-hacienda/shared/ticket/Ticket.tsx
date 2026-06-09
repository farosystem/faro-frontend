import { Document, Page, Text, StyleSheet, pdf, View, Image } from '@react-pdf/renderer';

// simple rounding helper used when cálculo de vuelto no viene precomputed
function roundTwo(v: number): number {
  return Math.round(v * 100) / 100;
}

export interface Platillo {
  id: string;
  nombre: string;
  precio: number;
  cantidad?: number;
  // IVA percentage applied to this item (e.g. 13 for restaurant)
  ivaPercent?: number;
}

export interface ReceiptData {
  platillos: Platillo[];
  subtotal: number;
  impuestos: number; // total taxes (IVA + servicio)
  montoIVA?: number;
  montoServicio?: number;
  descuento?: number;
  total: number;
  facturaId?: string;
  fecha: string;
  hora?: string;
  cajero: string;
  cliente: string;
  metodoPago: string;
  montoRecibido: number;
  // precomputed change (rounded); optional
  vuelto?: number;
  mesa?: string | number;
  qrCodeDataUrl?: string;
  facturaElectronica?: FacturaElectronicaTicket;
}

export interface FacturaElectronicaTicket {
  consecutivo: string;
  clave: string;
}

const mockFacturaElectronicaTicket: FacturaElectronicaTicket = {
  consecutivo: '00100001040000000003',
  clave: '50603032600011540031400100001040000000003174003228'
};

// styles for react-pdf
const pdfStyles = StyleSheet.create({
  page: { padding: 5 },
  logo: { marginTop: 20, fontSize: 20, textAlign: 'center' },
  logoImage: { width: 60, height: 15, alignSelf: 'center', marginTop: 15, marginLeft: 10 },
  headerCenter: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5
  },
  subheaderCenter: { fontSize: 8, textAlign: 'center', color: '#7f8c8d' },
  tableHeaderText: { fontSize: 9, fontWeight: 'bold', marginTop: 5 },
  tableBodyText: { fontSize: 9 },
  // make each item row a single line – wrapping was causing the price
  // value to drop to the next line when it was slightly wider than the
  // allocated cell.  increasing the name/price/total widths gives a bit more
  // breathing room for longer dish names or formatted numbers.
  row: { flexDirection: 'row', marginBottom: 2 },
  cellName: { fontSize: 9, width: 130 },
  cellQty: { fontSize: 9, width: 20, textAlign: 'right' },
  cellPrice: { fontSize: 9, width: 50, textAlign: 'right' },
  cellTotal: { fontSize: 9, width: 50, textAlign: 'right' },
  flexBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  legalText: { fontSize: 7, textAlign: 'center', marginTop: 10, color: '#7f8c8d' },
  electronicInvoiceHeader: { fontSize: 10, marginTop: 10, marginBottom: 5, textAlign: 'left' },
  electronicInvoiceConsecutivoClave: {
    fontSize: 7,
    textAlign: 'left',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 2
  },
  electronicInvoiceBody: {
    fontSize: 8,
    textAlign: 'left',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 1
  },

  tableRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 },
  separationLine: { fontSize: 10, textAlign: 'center', color: '#7f8c8d' },
  footerBody: {
    fontSize: 8,
    color: '#7f8c8d',
    marginTop: 20
  }
});

const SeparationLine = () => {
  return (
    <>
      <Text style={pdfStyles.separationLine}>
        ------------------------------------------------------------------
      </Text>
    </>
  );
};

const TicketHeader = () => {
  return (
    <>
      <Image src="/faro-dark.png" style={pdfStyles.logoImage} />
      <Text style={pdfStyles.headerCenter}>Hotelera FARO</Text>
      <Text style={pdfStyles.subheaderCenter}>Ubicacion Fisica</Text>
      <Text style={pdfStyles.subheaderCenter}>Telefono 8888-0000</Text>
      <Text style={pdfStyles.subheaderCenter}>Cedula Juridica 3-000-000000-00</Text>
      <Text style={pdfStyles.subheaderCenter}>faro@example.com</Text>
    </>
  );
};

const TicketElectronicInvoice = ({ data }: { data?: ReceiptData }) => {
  const info = data?.facturaElectronica;
  return (
    <>
      {/* <Text style={pdfStyles.electronicInvoiceHeader}>Factura Electr&oacute;nica</Text> */}
      <Text style={pdfStyles.electronicInvoiceHeader}>Tiquete Electr&oacute;nico</Text>
      <Text style={pdfStyles.electronicInvoiceConsecutivoClave}>
        Consecutivo: {info?.consecutivo || ''}
      </Text>
      <Text style={pdfStyles.electronicInvoiceConsecutivoClave}>Clave: {info?.clave || ''}</Text>
    </>
  );
};

// transaction info component
const TicketTransactionInfo = ({ data }: { data: ReceiptData }) => {
  return (
    <>
      <Text style={pdfStyles.electronicInvoiceBody}>Fecha: {data.fecha}</Text>
      {data.mesa !== undefined && (
        <Text style={pdfStyles.electronicInvoiceBody}>Mesa/Orden: {data.mesa}</Text>
      )}
      <Text style={pdfStyles.electronicInvoiceBody}>Cajero: {data.cajero}</Text>
      <Text style={pdfStyles.electronicInvoiceBody}>Cliente: {data.cliente}</Text>
    </>
  );
};

const TicketRestaurantItems = ({
  data,
  format
}: {
  data: ReceiptData;
  format: (n: number) => string;
}) => {
  return (
    <>
      <View style={pdfStyles.row}>
        <Text style={[pdfStyles.tableHeaderText, pdfStyles.cellName]}>Descripción</Text>
        <Text style={[pdfStyles.tableHeaderText, pdfStyles.cellQty, { textAlign: 'right' }]}>
          Cant
        </Text>
        <Text style={[pdfStyles.tableHeaderText, pdfStyles.cellPrice, { textAlign: 'right' }]}>
          Precio
        </Text>
        <Text style={[pdfStyles.tableHeaderText, { width: 25, textAlign: 'right' }]}>%</Text>
        <Text style={[pdfStyles.tableHeaderText, pdfStyles.cellTotal, { textAlign: 'right' }]}>
          Total
        </Text>
      </View>
      {data.platillos.map((p) => (
        <View key={p.id} style={pdfStyles.row}>
          <Text style={pdfStyles.cellName} wrap>
            {p.nombre}
          </Text>
          <Text style={pdfStyles.cellQty}>{p.cantidad || 1}</Text>
          <Text style={pdfStyles.cellPrice}>{format(p.precio)}</Text>
          <Text style={{ width: 25, textAlign: 'right', fontSize: 9 }}>{p.ivaPercent ?? 0}%</Text>
          <Text style={pdfStyles.cellTotal}>{format((p.cantidad || 1) * p.precio)}</Text>
        </View>
      ))}
    </>
  );
};

const TickerFooter = ({ data, format }: { data: ReceiptData; format: (n: number) => string }) => {
  const vuelto =
    data.vuelto !== undefined ? data.vuelto : roundTwo(data.montoRecibido - data.total);
  return (
    <>
      <View style={pdfStyles.flexBetween}>
        <Text style={{ fontSize: 9 }}>Subtotal:</Text>mockFacturaElectronicaTicket
        <Text style={{ fontSize: 9 }}>{format(data.subtotal)}</Text>
      </View>
      <View style={pdfStyles.flexBetween}>
        <Text style={{ fontSize: 9 }}>IVA (13%):</Text>
        <Text style={{ fontSize: 9 }}>{format(data.montoIVA || 0)}</Text>
      </View>
      <View style={pdfStyles.flexBetween}>
        <Text style={{ fontSize: 9 }}>Servicio (10%):</Text>
        <Text style={{ fontSize: 9 }}>{format(data.montoServicio || 0)}</Text>
      </View>
      {data.descuento !== undefined && (
        <View style={pdfStyles.flexBetween}>
          <Text style={{ fontSize: 9 }}>Descuento:</Text>
          <Text style={{ fontSize: 9 }}>-{format(data.descuento)}</Text>
        </View>
      )}
      <View style={{ ...pdfStyles.flexBetween, marginTop: 4, marginBottom: 4 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>TOTAL:</Text>
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{format(data.total)}</Text>
      </View>
      <SeparationLine />
      <View style={{ marginTop: 5, fontSize: 8 }}>
        <Text>Detalle de pago:</Text>
        <Text>
          Pago con {data.metodoPago}: {format(data.montoRecibido)}
        </Text>
        <Text>Vuelto: {format(vuelto > 0 ? vuelto : 0)}</Text>
      </View>
      <Text style={pdfStyles.legalText}>
        Autorizado mediante resolución N° MH-DGT-RES-0027-2024 del 19 de noviembre de 2024
      </Text>
      <Text style={pdfStyles.legalText}>¡Gracias por su compra!</Text>
      {data.qrCodeDataUrl && (
        <Image
          src={data.qrCodeDataUrl}
          style={{ width: 80, height: 80, alignSelf: 'center', marginTop: 8 }}
        />
      )}
    </>
  );
};

export const Ticket = ({ data, format }: { data: ReceiptData; format: (n: number) => string }) => {
  return (
    <Document>
      <Page size={{ width: 226.8, height: 600 }} style={pdfStyles.page}>
        <TicketHeader />
        <TicketElectronicInvoice data={data} />
        <TicketTransactionInfo data={data} />
        <SeparationLine />
        <TicketRestaurantItems data={data} format={format} />
        <TickerFooter data={data} format={format} />
      </Page>
    </Document>
  );
};

/**
 * Generate and download a PDF using react-pdf.
 * Returns a promise that resolves when the download is triggered.
 */
export async function downloadReceiptPDF(data: ReceiptData, format: (n: number) => string) {
  // create a document element with given data
  const blob = await pdf(<Ticket data={data} format={format} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `factura_${data.facturaId || '000'}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
