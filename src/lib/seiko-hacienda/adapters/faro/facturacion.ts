import { RestauranteLineaDetalle } from '@/Pages/Restaurant/Orders/types';
import { useQuery } from '@apollo/client';
import { OBTENER_ACTIVIDADES_ECONOMICAS } from '@/services/MovimientosRestauranteService';
import { EmitirFacturaElectronicaRequest, LineaDetalle } from '../../core/interfaces/hacienda';
import { FacturaEletronicaBuilder } from './facturacion-builder';
import {
  AbstractFacturaElectronicaStrategy,
  EmitirFacturaEletronica,
  FacturaEletronicaParams
} from '../../core/AbstractBaseFacturaStrategy';
import { CODIGO_IMPUESTO, TARIFA_IMPUESTO_VALOR_AGREGADO } from '../../core/enums';
import { LineaDetalleReservaUI } from '../../core/interfaces/linea-detalle-reserva';

export type ReservaFacturaParams = FacturaEletronicaParams & {
  codigoActividad?: string;
};

export type RestauranteFacturaParams<TItem = RestauranteLineaDetalle> =
  FacturaEletronicaParams<TItem> & {
    includeRoomCharge?: boolean;
    codigoActividad?: string;
  };

type StrategyParamsMap = {
  reserva: ReservaFacturaParams;
  restaurante: RestauranteFacturaParams;
};

export class ReservaFacturaStrategy extends AbstractFacturaElectronicaStrategy<ReservaFacturaParams> {
  protected customizeBuilder(
    builder: FacturaEletronicaBuilder,
    params: ReservaFacturaParams
  ): void {
    // actividad económica puede venir desde el backend via params
    builder.setCodigoActividad(params.codigoActividad || '551000');
  }

  protected mapItems(items: LineaDetalleReservaUI[]): LineaDetalle[] {
    return items.map((it, idx) => {
      const linea = idx + 1;
      /**
       * TODO: Dinámico CaByS
       */
      const cabys_6311100000000 = '6311100000000';
      it.CodigoCabys = cabys_6311100000000;

      if (!it.CodigoCabys) throw new Error(`Línea ${linea}: se requiere Codigo Cabys`);

      const cantidad = Number(it.cantidadArticulo ?? it.Cantidad ?? 1);
      if (!Number.isFinite(cantidad) || cantidad <= 0)
        throw new Error(`Línea ${linea}: cantidad inválida`);

      const precioUnitario = Number(it.precioCompra ?? it.PrecioUnitario ?? 0);
      if (!Number.isFinite(precioUnitario) || precioUnitario < 0)
        throw new Error(`Línea ${linea}: precio inválido`);

      const baseImponible = Number((cantidad * precioUnitario).toFixed(2));
      /**
       * TODO: Dinámico
       */
      const tarifaIva = 13;
      const montoIva = Number((baseImponible * (tarifaIva / 100)).toFixed(2));

      return {
        EsServicio: 'S',
        CodigoCabys: cabys_6311100000000,
        CodigoTipo: '01',
        /**
         * TODO: ID de producto real
         */
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
  }
}

export class RestauranteFacturaStrategy extends AbstractFacturaElectronicaStrategy<RestauranteFacturaParams> {
  protected customizeBuilder(
    builder: FacturaEletronicaBuilder,
    params: RestauranteFacturaParams
  ): void {
    // Definimos la actividad económica de Restaurante
    builder.setCodigoActividad(params.codigoActividad || '561000');
    if (params.includeRoomCharge) {
      // Ajuste hipotético: Si se carga a la habitación, podemos añadir una referencia
      // builder.addReferenciaInterna('CargoHabitacion', true);
    }
  }

  protected mapItems(items: RestauranteLineaDetalle[]): LineaDetalle[] {
    return items.map((it, idx) => {
      const linea = idx + 1;

      // CAByS para servicios de alimentación/restaurante
      const cabys_restaurante = '6311100000000';

      // Ya usamos las propiedades reales de tu interfaz: cantidad, precio, nombre, observaciones
      const cantidad = Number(it.cantidad ?? 1);
      if (!Number.isFinite(cantidad) || cantidad <= 0)
        throw new Error(`Línea ${linea}: cantidad inválida`);

      const precioUnitario = Number(it.precio ?? 0);
      if (!Number.isFinite(precioUnitario) || precioUnitario < 0)
        throw new Error(`Línea ${linea}: precio inválido`);

      const baseImponible = Number((cantidad * precioUnitario).toFixed(2));

      // TODO: Hacer tarifa de IVA dinámica si tu sistema lo requiere
      const tarifaIva = 13;
      const montoIva = Number((baseImponible * (tarifaIva / 100)).toFixed(2));

      return {
        EsServicio: 'S',
        CodigoCabys: cabys_restaurante,
        CodigoTipo: '01',
        Codigo: it.id || '00001',
        PartidaArancelaria: '',
        Cantidad: String(cantidad),
        UnidadMedida: 1,
        UnidadMedidaComercial: '',
        Detalle: it.nombre || 'Sin descripción',
        PrecioUnitario: String(precioUnitario),
        DescripcionExtra: it.observaciones || '',
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
  }
}

const estrategiaMap: {
  reserva: EmitirFacturaEletronica<ReservaFacturaParams>;
  restaurante: EmitirFacturaEletronica<RestauranteFacturaParams>;
} = {
  reserva: new ReservaFacturaStrategy(),
  restaurante: new RestauranteFacturaStrategy()
};

export function getFacturaStrategy<K extends keyof StrategyParamsMap>(
  key: K = 'reserva' as K
): EmitirFacturaEletronica<StrategyParamsMap[K]> {
  return estrategiaMap[key] as any;
}

export function useActividadesEconomicas() {
  const { data, loading, error } = useQuery(OBTENER_ACTIVIDADES_ECONOMICAS);
  return {
    actividades: data?.obtenerActividadesEconomicas || [],
    loading,
    error
  };
}

export async function buildEmitirFacturaRequest<K extends keyof StrategyParamsMap = 'reserva'>(
  strategyKey: K = 'reserva' as K,
  params: StrategyParamsMap[K]
): Promise<EmitirFacturaElectronicaRequest> {
  const strat = getFacturaStrategy(strategyKey);
  return await strat.build(params as any);
}
