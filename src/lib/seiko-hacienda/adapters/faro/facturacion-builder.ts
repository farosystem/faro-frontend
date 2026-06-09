import { CODIGO_IMPUESTO, TARIFA_IMPUESTO_VALOR_AGREGADO } from '../../core/enums';
import {
  DocElectronico,
  EmitirFacturaElectronicaRequest,
  Encabezado,
  Receptor,
  LineaDetalle,
  MedioPago,
  InformacionReferencia,
  ImpuestoDetalle
} from '../../core/interfaces/hacienda';

export class FacturaEletronicaBuilder {
  private req: Partial<EmitirFacturaElectronicaRequest> = {
    CodigoCliente: '745',
    DocElectronicos: []
  };

  setCodigoCliente(codigo: string): this {
    this.req.CodigoCliente = codigo;
    return this;
  }

  addDocument(doc: DocElectronico): this {
    this.req.DocElectronicos!.push(doc);
    return this;
  }

  addDocuments(docs: DocElectronico[]): this {
    this.ensureDocument();
    this.req.DocElectronicos!.push(...docs);

    return this;
  }

  setEncabezado(encabezado: Encabezado): this {
    this.ensureDocument();
    this.req.DocElectronicos![0].Encabezado = encabezado;
    return this;
  }

  setReceptor(receptor: Receptor): this {
    this.ensureDocument();
    this.req.DocElectronicos![0].Encabezado.Receptor = receptor;
    return this;
  }

  addLineaDetalle(linea: LineaDetalle): this {
    this.ensureDocument();
    const doc = this.req.DocElectronicos![0];
    doc.LineasDetalle = doc.LineasDetalle || [];
    doc.LineasDetalle.push(linea);
    return this;
  }

  setMediosPago(mediosPago: MedioPago[]): this {
    this.ensureDocument();

    this.req.DocElectronicos![0].MedioPago.push(...mediosPago);
    return this;
  }

  setCodigoActividad(codigo: string): this {
    this.ensureDocument();

    this.req.DocElectronicos![0].Encabezado.CodigoActividad = codigo;

    return this;
  }

  addLineasDetalle(lineas: Partial<LineaDetalle>[]): this {
    this.ensureDocument();
    const doc = this.req.DocElectronicos![0];
    doc.LineasDetalle = doc.LineasDetalle || [];
    lineas.forEach((l) => {
      const completa: LineaDetalle = {
        EsServicio: l.EsServicio ?? 'false',
        CodigoCabys: l.CodigoCabys ?? '',
        CodigoTipo: l.CodigoTipo ?? '',
        Codigo: l.Codigo ?? '',
        PartidaArancelaria: l.PartidaArancelaria ?? '',
        Cantidad: l.Cantidad ?? '1',
        UnidadMedida: l.UnidadMedida ?? 1,
        UnidadMedidaComercial: l.UnidadMedidaComercial ?? '',
        Detalle: l.Detalle ?? '',
        PrecioUnitario: l.PrecioUnitario ?? '0',
        DescripcionExtra: l.DescripcionExtra ?? '',
        BaseImponible: l.BaseImponible ?? 0,
        DescuentoMonto: l.DescuentoMonto ?? 0,
        DescuentoDetalle: l.DescuentoDetalle ?? '',
        DescuentoCodigo: l.DescuentoCodigo ?? '',
        Impuestos: (l.Impuestos as ImpuestoDetalle[]) ?? []
      };
      doc.LineasDetalle!.push(completa);
    });
    return this;
  }

  addLineasFromItems(items: any[]): this {
    const cabys = '6311100000000';
    const lineas: LineaDetalle[] = items.map((it, idx) => {
      const cantidad = Number(it.cantidadArticulo ?? it.Cantidad ?? 1);
      const precioUnitario = Number(it.precioCompra ?? it.PrecioUnitario ?? 0);
      const baseImponible = Number((cantidad * precioUnitario).toFixed(2));
      const tarifaIva = 13;
      const montoIva = Number((baseImponible * (tarifaIva / 100)).toFixed(2));

      return {
        EsServicio: 'S',
        CodigoCabys: cabys,
        CodigoTipo: '01',
        Codigo: '00001',
        PartidaArancelaria: '',
        Cantidad: String(cantidad),
        UnidadMedida: 1,
        UnidadMedidaComercial: '',
        Detalle: it.descripcion || 'Sin descripción',
        PrecioUnitario: String(precioUnitario),
        DescripcionExtra: '',
        BaseImponible: baseImponible,
        DescuentoMonto: 0,
        DescuentoDetalle: '',
        DescuentoCodigo: '',
        Impuestos: [
          {
            Codigo: CODIGO_IMPUESTO._01_IMPUESTO_VALOR_AGREGADO,
            CodigoTarifa: TARIFA_IMPUESTO_VALOR_AGREGADO._08_TARIFA_GENERAL_13,
            Tarifa: tarifaIva,
            FactorIVA: 0,
            Monto: montoIva,
            MontoExportacion: 0,
            Exoneracion: null
          }
        ]
      };
    });

    return this.addLineasDetalle(lineas);
  }

  addMedioPago(pago: MedioPago): this {
    this.ensureDocument();
    const doc = this.req.DocElectronicos![0];
    doc.MedioPago = doc.MedioPago || [];
    doc.MedioPago.push(pago);
    return this;
  }

  setInformacionReferencia(ref: InformacionReferencia[] | null): this {
    this.ensureDocument();
    this.req.DocElectronicos![0].InformacionReferencia = ref;
    return this;
  }

  /**
   * finalize and validate the request
   */
  build(): EmitirFacturaElectronicaRequest {
    if (!this.req.CodigoCliente) {
      throw new Error('CodigoCliente is required');
    }
    if (!this.req.DocElectronicos || this.req.DocElectronicos.length === 0) {
      throw new Error('At least one document is required');
    }
    // we could deep-validate more fields here if desired
    return this.req as EmitirFacturaElectronicaRequest;
  }

  private ensureDocument() {
    if (!this.req.DocElectronicos || this.req.DocElectronicos.length === 0) {
      this.req.DocElectronicos = [
        {
          Encabezado: {} as Encabezado,
          LineasDetalle: [],
          MedioPago: [],
          InformacionReferencia: null
        } as DocElectronico
      ];
    }
  }
}
