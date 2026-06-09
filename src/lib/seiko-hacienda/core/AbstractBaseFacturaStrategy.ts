import { Cliente } from '@/gql/graphql';
import { FacturaEletronicaBuilder } from '../adapters/faro/facturacion-builder';
import { mapCodigoMonedaToFFE, mapCondicionVentaToFFE } from '../adapters/ffe-api/ffe-mapper';
import { createDateOfSubmission } from '../utils/date-utils';
import { SITUACION_COMPROBANTE, CONDICION_VENTA, TIPO_IDENTIFICACION, MEDIO_PAGO } from './enums';
import { CondicionesFacturacion } from './interfaces/condiciones-facturacion';
import {
  InformacionReferencia,
  EmitirFacturaElectronicaRequest,
  LineaDetalle
} from './interfaces/hacienda';
import { consultarTipoCambio } from '../utils/tipo-cambio';

export interface EmitirFacturaEletronica<P = FacturaEletronicaParams> {
  build(params: P): Promise<EmitirFacturaElectronicaRequest>;
}

export type FacturaEletronicaParams<TItem = any> = {
  cliente?: Cliente;
  items: TItem[];
  condicionesFacturacion: CondicionesFacturacion;
  referencia?: InformacionReferencia;
};

export abstract class AbstractFacturaElectronicaStrategy<P extends FacturaEletronicaParams>
  implements EmitirFacturaEletronica<P>
{
  async build(params: P): Promise<EmitirFacturaElectronicaRequest> {
    const { cliente, items, condicionesFacturacion, referencia } = params;
    const missingForm = [];

    if (!condicionesFacturacion) throw new Error('condicionesFacturacion es requerido');
    if (!condicionesFacturacion.TipoDocumento) missingForm.push('TipoDocumento');
    if (!condicionesFacturacion.CondicionVenta) missingForm.push('CondicionVenta');
    if (!condicionesFacturacion.TipoMedioPago) missingForm.push('MedioPago');
    if (!condicionesFacturacion.CodigoMoneda) missingForm.push('CodigoMoneda');

    if (missingForm.length)
      throw new Error(`Campos faltantes en condicionesFacturacion: ${missingForm.join(', ')}`);

    if (!Array.isArray(items) || items.length === 0)
      throw new Error('Debe incluir al menos una línea (items) para facturar');

    const mappedItems = this.mapItems(items);

    const totalFactura = mappedItems.reduce((sum, item) => {
      const montoImpuestos = item.Impuestos?.reduce((s, imp) => s + imp.Monto, 0) || 0;
      return sum + item.BaseImponible + montoImpuestos;
    }, 0);

    const codigoMoneda = condicionesFacturacion.CodigoMoneda;
    const tipoCambio = await consultarTipoCambio(codigoMoneda);

    // determine plazoCredito according to sale condition (credit requires >=1)
    let plazoCred = '0';
    const cond = condicionesFacturacion.CondicionVenta;
    const creditConditions = ['02', '10', '11'];
    if (creditConditions.includes(cond)) {
      const supplied = condicionesFacturacion.PlazoCredito ?? 0;
      const num = Number(supplied);
      plazoCred = num >= 1 ? String(num) : '1';
    }

    const builder = new FacturaEletronicaBuilder()
      .setCodigoCliente('745')
      .setEncabezado({
        TipoDocumento: Number(params.condicionesFacturacion.TipoDocumento),
        SecuenciaControlada: 0,
        NumeroConsecutivo: '',
        Clave: '',
        SecuenciaDocumento: 0,
        Sucursal: '001',
        Terminal: '00001',
        SituacionEnvio: SITUACION_COMPROBANTE.NORMAL,
        CodigoActividad: '',
        FechaEmision: createDateOfSubmission(),
        CondicionVenta: mapCondicionVentaToFFE(
          condicionesFacturacion.CondicionVenta as CONDICION_VENTA
        ),
        PlazoCredito: plazoCred,
        TipoCambio: tipoCambio,
        CodigoMoneda: mapCodigoMonedaToFFE(codigoMoneda),
        Receptor: null
      })
      .addLineasDetalle(mappedItems);

    if (cliente) {
      builder.setReceptor({
        Nombre: cliente.nombre ?? '',
        IdentificacionTipo: TIPO_IDENTIFICACION._01_CEDULA_FISICA,
        IdentificacionNumero: cliente.codigo ?? '',
        CorreoElectronico: cliente.correos[0].email ?? '',
        NombreComercial: cliente.nombreFacturacion ?? '',
        CorreoElectronicoCC: cliente.correos[0].email ?? '',
        ActividadEconomica: ''
      });
    }

    // build payment array; Hacienda requires an additional "Otro" field when
    // the payment type is 99 (OTRO).  We allow the incoming condicionesFacturacion
    // to carry a human-readable description in `MedioPagoOtros`.  This field is
    // optional for all other types.
    const medioObj: any = {
      TipoMedioPago: condicionesFacturacion.TipoMedioPago as MEDIO_PAGO,
      TotalMedioPago: String(totalFactura)
    };
    if (
      condicionesFacturacion.TipoMedioPago === '99' &&
      (condicionesFacturacion as any).MedioPagoOtros
    ) {
      medioObj.MedioPagoOtros = (condicionesFacturacion as any).MedioPagoOtros;
    }

    builder.setMediosPago([medioObj]);

    if (referencia) {
      builder.setInformacionReferencia([referencia]);
    }

    this.customizeBuilder(builder, params);

    return builder.build();
  }

  protected abstract customizeBuilder(builder: FacturaEletronicaBuilder, params: P): void;
  protected abstract mapItems(items: P['items']): LineaDetalle[];
}
