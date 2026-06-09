import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Col, Row, Input } from 'reactstrap';
import { UseFormSetValue } from 'react-hook-form';
import { useInvoiceOptions } from '../../../lib/hooks/useInvoiceOptions';
import { CondicionesFacturacion } from '@/lib/seiko-hacienda/core/interfaces/condiciones-facturacion';
import {
  parseCodigoMoneda,
  parseCondicionVenta,
  parseMedioPago,
  parseTipoDocumento
} from '@/lib/seiko-hacienda/adapters/faro/ui-mappers';
import type { Option } from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';
import { CONDICION_VENTA } from '@/lib/seiko-hacienda/core/enums/condicion-venta';
import {
  normalizeTipoDocumentoValue,
  normalizeMedioPagoValue,
  findOptionByValue
} from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';

// fields that the invoice options component can report back to its
// caller. the string literals need to stay in sync with the hacienda
// `CondicionesFacturacion` interface but we keep them here explicitly to
// avoid circular imports and make the intent clear.
type InvoiceField =
  | 'CondicionVenta'
  | 'TipoDocumento'
  | 'CodigoMoneda'
  | 'TipoMedioPago'
  | 'MedioPagoOtros'
  | 'PlazoCredito';

interface Props {
  /** optional react-hook-form setter (existing usage) */
  setValue?: UseFormSetValue<CondicionesFacturacion>;
  /** optional callback when a field changes - used by screens not using react-hook-form */
  onChange?: (field: InvoiceField, value: string) => void;
  /**
   * current selected raw values for each field. when provided the selects are
   * controlled and will always reflect whatever is passed here. this replaces
   * the older `defaultValues` prop, which only applied on mount.
   */
  values?: Partial<{
    CondicionVenta: string;
    TipoDocumento: string;
    CodigoMoneda: string;
    TipoMedioPago: string;
    MedioPagoOtros: string;
    PlazoCredito: string | number;
  }>;
  defaultValues?: Partial<{
    CondicionVenta: string;
    TipoDocumento: string;
    CodigoMoneda: string;
    TipoMedioPago: string;
    MedioPagoOtros: string;
    PlazoCredito: string | number;
  }>;
}

export function buildHandleSelect(
  setValue?: UseFormSetValue<CondicionesFacturacion>,
  onChange?: (field: InvoiceField, value: string) => void
) {
  return (field: keyof CondicionesFacturacion, parser: (val: any) => any, opts?: Option[]) =>
    (v: any) => {
      // raw is the original id returned by the server; when we slugged options
      // to make them unique this will still contain the true value.
      const raw = v?.rawValue || v?.value;
      let val = raw;
      if (field === 'TipoDocumento' && opts) {
        // ensure we pass a Hacienda-compliant code to the parser
        val = normalizeTipoDocumentoValue(val, opts);
      }
      if (field === 'TipoMedioPago') {
        // sometimes backend IDs are wrong; turn label into good code using the
        // label the user actually picked (not just the first match in opts).
        val = normalizeMedioPagoValue(val, opts || [], v?.label);
      }
      const parsed = parser(val);
      if (setValue) {
        setValue(field as any, parsed);
      }
      if (onChange) {
        onChange(field as any, raw);
      }

      // if user filled payment method, also propagate label to MedioPagoOtros (backend
      // will ignore unless TipoMedioPago === '99')
      if (field === 'TipoMedioPago') {
        const label = v?.label || '';
        if (setValue) {
          setValue('MedioPagoOtros' as any, label);
        }
        if (onChange) {
          onChange('MedioPagoOtros', label);
        }
      }
    };
}

// only a subset of document types are relevant for this form; the backend
// returns a larger list (Factura Compra, Factura Exportacion, etc.) that
// aren't used in normal invoicing screens. filter them here so callers can
// rely on a small, consistent set. the allowed labels were agreed with
// product/UX teams.
export const filterDocumentTypes = (opts: Option[]) => {
  const allowed = new Set([
    'Factura Electrónica',
    'Factura Electronica',
    'Tiquete Electrónico',
    'Tiquete Electronico',
    'Nota Crédito',
    'Nota Credito',
    'Nota Débito',
    'Nota Debito',
    'Pago parcial'
  ]);
  return opts.filter((o) => allowed.has(o.label));
};

const InvoiceOptions = ({ setValue, onChange, defaultValues = {}, values = {} }: Props) => {
  const { saleConditionOptions, documentTypeOptions, currencyOptions, paymentMethodOptions } =
    useInvoiceOptions();

  // react-select menus can be rendered inside a positioned container which may
  // clip the dropdown or prevent clicks; attach them to body with a high z-index
  // so they always float above other elements. tests run in jsdom where
  // document.body exists, so this is safe.
  const selectProps =
    typeof document !== 'undefined'
      ? {
          menuPortalTarget: document.body,
          styles: { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }
        }
      : {};

  const filteredDocumentTypeOptions = filterDocumentTypes(documentTypeOptions);

  const baseHandle = buildHandleSelect(setValue, onChange);
  const handleSelect =
    (field: keyof CondicionesFacturacion, parser: any, opts?: Option[]) => (v: any) => {
      // correct obvious backend miscodes using the label before propagating
      let corrected = v;
      if (field === 'CondicionVenta' && v) {
        const lbl: string = (v.label || '').toLowerCase();
        // if the label mentions consignación but the id is wrong, hijack it
        if (lbl.includes('consignaci') && (v.rawValue === '1' || v.value === '1')) {
          corrected = { ...v, rawValue: '3', value: '3' };
        }
        // other condition fixes could be added here later
      }

      baseHandle(field, parser, opts)(corrected);
      if (field === 'CondicionVenta') {
        // keep full option object for uncontrolled mode. this lets us
        // display the correct label when two options share the same
        // backend id (rawValue).
        setLocalCondicionOpt(corrected || null);
      }
    };

  // local object state for sale condition when uncontrolled. storing the
  // whole Option allows us to correctly display the chosen item even if
  // multiple options share the same rawValue (backend bug).
  const [localCondicionOpt, setLocalCondicionOpt] = useState<Option | null>(null);

  // determine whether the current or default sale condition is credit-like
  const isCredit = (() => {
    // prefer raw value from local option if available, else fall back to
    // controlled values
    let condRaw =
      localCondicionOpt?.rawValue ||
      (values?.CondicionVenta as string) ||
      (defaultValues?.CondicionVenta as string) ||
      '';
    try {
      condRaw = parseCondicionVenta(condRaw);
    } catch {
      condRaw = '';
    }
    return [
      CONDICION_VENTA._02_CREDITO,
      CONDICION_VENTA._10_VENTA_A_CREDITO_EN_IVA_HASTA_90_DIAS,
      CONDICION_VENTA._11_PAGO_VENTA_A_CREDITO_EN_IVA_HASTA_90_DIAS
    ].includes(condRaw as CONDICION_VENTA);
  })();
  // compute whether payment method is "others" so we can show an extra input
  const rawPayment =
    (values?.TipoMedioPago as string) || (defaultValues?.TipoMedioPago as string) || '';
  const isOtherPayment = rawPayment === '99';

  // determine flex alignment for the row containing plazo/otro inputs; when
  // only the other-payment field exists we push it to the end, otherwise we
  // space-between to keep plazo at start and other at end.
  const rowClassName =
    isOtherPayment && !isCredit ? 'mb-2 justify-content-end' : 'mb-2 justify-content-between';

  // local editable state for plazo to remain usable when parent doesn't
  // supply `values`/`setValue` callbacks. keeps in sync if parent does change.
  const [localPlazo, setLocalPlazo] = useState<string | number>(
    values?.PlazoCredito ?? defaultValues?.PlazoCredito ?? ''
  );

  // local state for payment-other description
  const [localPaymentOther, setLocalPaymentOther] = useState<string>(
    (values as any)?.MedioPagoOtros ?? (defaultValues as any)?.MedioPagoOtros ?? ''
  );

  useEffect(() => {
    // if parent supplies an explicit value object (even empty string) we
    // consider the field controlled and reset our local choice so the
    // controlled logic takes over.
    if (values?.CondicionVenta !== undefined) {
      setLocalCondicionOpt(null);
    } else if (defaultValues?.CondicionVenta !== undefined) {
      setLocalCondicionOpt(null);
    }
  }, [values?.CondicionVenta, defaultValues?.CondicionVenta]);

  useEffect(() => {
    if (values?.PlazoCredito !== undefined) {
      setLocalPlazo(values.PlazoCredito);
    } else if (defaultValues?.PlazoCredito !== undefined) {
      setLocalPlazo(defaultValues.PlazoCredito);
    }
  }, [values?.PlazoCredito, defaultValues?.PlazoCredito]);

  useEffect(() => {
    if ((values as any)?.MedioPagoOtros !== undefined) {
      setLocalPaymentOther((values as any).MedioPagoOtros);
    } else if ((defaultValues as any)?.MedioPagoOtros !== undefined) {
      setLocalPaymentOther((defaultValues as any).MedioPagoOtros);
    }
  }, [
    values?.TipoMedioPago,
    (values as any)?.MedioPagoOtros,
    (defaultValues as any)?.MedioPagoOtros
  ]);

  useEffect(() => {
    // clear the auxiliary text when payment method changes away from "others"
    if (!isOtherPayment && localPaymentOther) {
      setLocalPaymentOther('');
      if (setValue) setValue('MedioPagoOtros' as any, '');
      if (onChange) onChange('MedioPagoOtros', '');
    }
  }, [isOtherPayment]);

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <label className="form-label">Condición de Venta</label>
          <Select
            {...selectProps}
            isDisabled={saleConditionOptions.length === 0}
            isClearable
            value={
              saleConditionOptions.length > 0
                ? localCondicionOpt ||
                  (() => {
                    const currentCondicion =
                      values?.CondicionVenta || (defaultValues?.CondicionVenta as string) || '';
                    return (
                      findOptionByValue(saleConditionOptions, currentCondicion) ||
                      (currentCondicion ? null : saleConditionOptions[0])
                    );
                  })()
                : null
            }
            options={saleConditionOptions}
            onChange={handleSelect('CondicionVenta', (x) => x)}
          />
          {saleConditionOptions.length === 0 && (
            <small className="text-danger">No hay condiciones de venta disponibles</small>
          )}
        </Col>
        <Col md={3}>
          <label className="form-label">Tipo de Factura</label>
          <Select
            {...selectProps}
            isDisabled={filteredDocumentTypeOptions.length === 0}
            isClearable
            value={
              filteredDocumentTypeOptions.length > 0
                ? findOptionByValue(filteredDocumentTypeOptions, values?.TipoDocumento || '') ||
                  (values?.TipoDocumento ? null : filteredDocumentTypeOptions[0])
                : null
            }
            options={filteredDocumentTypeOptions}
            onChange={handleSelect(
              'TipoDocumento',
              parseTipoDocumento,
              filteredDocumentTypeOptions
            )}
          />
          {filteredDocumentTypeOptions.length === 0 && (
            <small className="text-danger">No hay tipos de factura disponibles</small>
          )}
        </Col>
        <Col md={3}>
          <label className="form-label">Moneda</label>
          <Select
            {...selectProps}
            isDisabled={currencyOptions.length === 0}
            isClearable
            value={
              currencyOptions.length > 0
                ? findOptionByValue(currencyOptions, values?.CodigoMoneda || '') ||
                  (values?.CodigoMoneda ? null : currencyOptions[0])
                : null
            }
            options={currencyOptions}
            onChange={handleSelect('CodigoMoneda', parseCodigoMoneda)}
          />
          {currencyOptions.length === 0 && (
            <small className="text-danger">No hay monedas disponibles</small>
          )}
        </Col>
        <Col md={3}>
          <label className="form-label">Forma de Pago</label>
          <Select
            {...selectProps}
            isDisabled={paymentMethodOptions.length === 0}
            isClearable
            value={
              paymentMethodOptions.length > 0
                ? findOptionByValue(paymentMethodOptions, values?.TipoMedioPago || '') ||
                  (values?.TipoMedioPago ? null : paymentMethodOptions[0])
                : null
            }
            options={paymentMethodOptions}
            onChange={handleSelect('TipoMedioPago', parseMedioPago, paymentMethodOptions)}
          />
          {paymentMethodOptions.length === 0 && (
            <small className="text-danger">No hay métodos de pago disponibles</small>
          )}
        </Col>
      </Row>
      {(isCredit || isOtherPayment) && (
        <Row className={rowClassName}>
          {isCredit && (
            <Col md={3}>
              <label className="form-label" htmlFor="plazo-credito">
                Plazo crédito
              </label>
              <Input
                id="plazo-credito"
                type="number"
                min={1}
                style={{ width: '4rem' }}
                className="form-control"
                value={localPlazo}
                onChange={(e) => {
                  const v = e.target.value;
                  setLocalPlazo(v);
                  if (setValue) setValue('PlazoCredito' as any, Number(v) || 0);
                  if (onChange) onChange('PlazoCredito', v);
                }}
              />
            </Col>
          )}

          {isOtherPayment && (
            <Col md={3}>
              <label className="form-label" htmlFor="medio-pago-otro">
                Otro medio de pago
              </label>
              <Input
                id="medio-pago-otro"
                type="text"
                className="form-control"
                value={localPaymentOther}
                onChange={(e) => {
                  const v = e.target.value;
                  setLocalPaymentOther(v);
                  if (setValue) setValue('MedioPagoOtros' as any, v);
                  if (onChange) onChange('MedioPagoOtros', v);
                }}
              />
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default InvoiceOptions;
