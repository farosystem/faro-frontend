import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { OBTENER_FACTURAS_PARAMETROS_BY_TYPE } from '../../services/FacturasParametrosService';
import { OBTENER_TODAS_MATERIAS_PRIMAS } from '../../services/MateriaPrimaService';
import { OBTENER_CLIENTES } from '../../services/ClienteService';
import type { Query } from '@/gql/graphql';
import type { Option } from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';

// convert raw parameter records into Option objects; we also preserve the
// original id in `rawValue` so callers can distinguish slugged values.
const mapToOptions = (data: any[] | undefined): Option[] =>
  (data || []).map((x) => ({ value: x.id, label: x.value, rawValue: x.id }));

export function useInvoiceOptions() {
  const { data: currencies } = useQuery<Query>(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'currencyTypes' }
  });
  const { data: paymentMethods } = useQuery<Query>(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'paymentMethods' }
  });
  const { data: saleConditions } = useQuery<Query>(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'saleConditions' }
  });
  const { data: documentTypes } = useQuery<Query>(OBTENER_FACTURAS_PARAMETROS_BY_TYPE, {
    variables: { type: 'documentTypes' }
  });
  const { data: materias } = useQuery<Query>(OBTENER_TODAS_MATERIAS_PRIMAS);
  const { data: clientes } = useQuery<Query>(OBTENER_CLIENTES);

  const currencyOptions = useMemo(
    () => mapToOptions(currencies?.obtenerFacturasParametrosByType),
    [currencies]
  );
  const paymentMethodOptions = useMemo(
    () => mapToOptions(paymentMethods?.obtenerFacturasParametrosByType),
    [paymentMethods]
  );
  const saleConditionOptions = useMemo(
    () => mapToOptions(saleConditions?.obtenerFacturasParametrosByType),
    [saleConditions]
  );
  const documentTypeOptions = useMemo(
    () => mapToOptions(documentTypes?.obtenerFacturasParametrosByType),
    [documentTypes]
  );

  const currenciesQuery = useMemo(() => currencies?.obtenerFacturasParametrosByType, [currencies]);
  const paymentMethodsQuery = useMemo(
    () => paymentMethods?.obtenerFacturasParametrosByType,
    [paymentMethods]
  );
  const saleConditionsQuery = useMemo(
    () => saleConditions?.obtenerFacturasParametrosByType,
    [saleConditions]
  );
  const documentTypesQuery = useMemo(
    () => documentTypes?.obtenerFacturasParametrosByType,
    [documentTypes]
  );

  return {
    currenciesQuery,
    paymentMethodsQuery,
    saleConditionsQuery,
    documentTypesQuery,
    saleConditionOptions,
    documentTypeOptions,
    currencyOptions,
    paymentMethodOptions,
    materias: materias?.obtenerTodasMateriasPrimas || [],
    clientes: clientes?.obtenerClientes || []
  };
}
