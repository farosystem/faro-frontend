import { useEffect } from 'react';

export function useDefaultFormValues({
  watch,
  setValue,
  saleConditionOptions,
  documentTypeOptions,
  currencyOptions,
  paymentMethodOptions
}: {
  watch: any;
  setValue: any;
  saleConditionOptions: any[];
  documentTypeOptions: any[];
  currencyOptions: any[];
  paymentMethodOptions: any[];
}) {
  useEffect(() => {
    try {
      if (!watch('CondicionVenta') && saleConditionOptions.length)
        setValue('CondicionVenta', saleConditionOptions[0]);
      if (!watch('TipoDocumento') && documentTypeOptions.length)
        setValue('TipoDocumento', documentTypeOptions[0]);
      if (!watch('currency') && currencyOptions.length) setValue('currency', currencyOptions[0]);
      if (!watch('MedioPago') && paymentMethodOptions.length)
        setValue('MedioPago', paymentMethodOptions[0]);
    } catch (e) {
      // ignore during initial render
    }
  }, [
    saleConditionOptions,
    documentTypeOptions,
    currencyOptions,
    paymentMethodOptions,
    setValue,
    watch
  ]);
}
