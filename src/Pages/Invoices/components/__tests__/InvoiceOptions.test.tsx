import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// avoid running actual GraphQL queries in unit tests by mocking the hook
vi.mock('../../../../lib/hooks/useInvoiceOptions', () => ({
  useInvoiceOptions: () => ({
    saleConditionOptions: [
      { value: '01', label: 'Contado', rawValue: '01' },
      { value: '02', label: 'Crédito', rawValue: '02' },
      { value: '03', label: 'Consignación', rawValue: '03' }
    ],
    documentTypeOptions: [
      { value: '01', label: 'Factura Compra', rawValue: '01' },
      { value: '02', label: 'Factura Electronica', rawValue: '02' },
      { value: '03', label: 'Nota Credito', rawValue: '03' },
      { value: '04', label: 'Factura Exportacion', rawValue: '04' },
      { value: '05', label: 'Tiquete Electronico', rawValue: '05' },
      { value: '06', label: 'Pago parcial', rawValue: '06' }
    ],
    currencyOptions: [],
    paymentMethodOptions: []
  })
}));

import InvoiceOptions, { buildHandleSelect } from '../InvoiceOptions';
import * as InvoiceOptionsModule from '../InvoiceOptions';
import * as InvoiceOptionsHook from '../../../../lib/hooks/useInvoiceOptions';

// extract helper from namespace import to avoid Node typings
const { filterDocumentTypes } = InvoiceOptionsModule;

// dummy parser that just returns the input
const identity = (x: any) => x;

describe('InvoiceOptions helpers', () => {
  it('propagates MedioPagoOtros when TipoMedioPago changes', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();

    const handleSelect = buildHandleSelect(setValue, onChange);

    const handler = handleSelect('TipoMedioPago', identity);

    // simulate choosing an option with value '99' and label 'Otro pago'
    handler({ value: '99', label: 'Otro pago' });

    // first call should set the main field
    expect(setValue).toHaveBeenCalledWith('TipoMedioPago', '99');
    expect(onChange).toHaveBeenCalledWith('TipoMedioPago', '99');

    // second call should set MedioPagoOtros with the option label
    expect(setValue).toHaveBeenCalledWith('MedioPagoOtros', 'Otro pago');
    expect(onChange).toHaveBeenCalledWith('MedioPagoOtros', 'Otro pago');
    expect(onChange).toHaveBeenCalledWith('MedioPagoOtros', 'Otro pago');
  });

  it('normalizes value using label when option id is incorrect', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();
    const handleSelect = buildHandleSelect(setValue, onChange);
    const handler = handleSelect('TipoMedioPago', identity, [
      { value: '99', label: 'Efectivo', rawValue: '99' }
    ] as any);

    handler({ value: '99', label: 'Efectivo' });
    expect(setValue).toHaveBeenCalledWith('TipoMedioPago', '01');
  });

  it('does not confuse options when two share the same value', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();
    const handleSelect = buildHandleSelect(setValue, onChange);
    const dupOpts = [
      { value: '99|0', label: 'Efectivo', rawValue: '99' },
      { value: '99|1', label: 'Otros', rawValue: '99' }
    ] as any;
    const handler = handleSelect('TipoMedioPago', identity, dupOpts);

    // simulate selecting the second option
    handler(dupOpts[1]);
    // normalization should use the actual label user clicked, so we
    // expect the raw id to remain '99' and not be coerced to '01'.
    expect(setValue).toHaveBeenCalledWith('TipoMedioPago', '99');
    // MedioPagoOtros should pick up the correct label from the object
    expect(setValue).toHaveBeenCalledWith('MedioPagoOtros', 'Otros');

    // now simulate the case where the select control already hands us a slugged
    // value (this can happen when options were built earlier with appended
    // index). the handler should still normalize correctly and report the raw
    // id via onChange.
    const slugged = { value: '1|X', label: 'Efectivo', rawValue: '1' } as any;
    const handler2 = handleSelect('TipoMedioPago', identity, [slugged]);
    handler2(slugged);
    expect(setValue).toHaveBeenCalledWith('TipoMedioPago', '01');
  });
});

// UI rendering tests ------------------------------------------------------
describe('InvoiceOptions component', () => {
  it('shows plazo input when sale condition is crédito and calls callbacks', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();

    render(
      <InvoiceOptions
        setValue={setValue}
        onChange={onChange}
        values={{ CondicionVenta: '2' /* unpadded numeric to simulate real data */ }}
      />
    );

    // plazo field should be present – label+input pair
    const input = screen.getByLabelText(/Plazo cr[eé]dito/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // change value
    fireEvent.change(input, { target: { value: '30' } });
    expect(setValue).toHaveBeenCalledWith('PlazoCredito', 30);
    expect(onChange).toHaveBeenCalledWith('PlazoCredito', '30');
  });

  it('hides plazo when not credit', () => {
    render(<InvoiceOptions values={{ CondicionVenta: '01' }} />);
  });

  it('allows choosing and displaying a non-contado sale condition', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();

    const { rerender } = render(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{}} />
    );

    // simulate handing back the value as if the user selected 'Crédito'
    rerender(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{ CondicionVenta: '02' }} />
    );
    expect(screen.getAllByText(/Cr[eé]dito/i).length).toBeGreaterThan(0);

    // verify callbacks receive the raw id when handleSelect is invoked
    const handler = buildHandleSelect(setValue, onChange)('CondicionVenta', identity);
    handler({ value: '03', label: 'Consignación' });
    expect(setValue).toHaveBeenCalledWith('CondicionVenta', '03');
    expect(onChange).toHaveBeenCalledWith('CondicionVenta', '03');

    // rerender with updated value to ensure the dropdown shows Consignación
    rerender(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{ CondicionVenta: '03' }} />
    );
    expect(screen.getAllByText(/Consignaci[oó]n/i).length).toBeGreaterThan(0);
  });

  it('matches a controlled value regardless of padding or value format', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();
    const spy = vi.spyOn(InvoiceOptionsHook, 'useInvoiceOptions').mockReturnValue({
      saleConditionOptions: [
        // simulate backend returning unpadded ids
        { value: '3', label: 'Consignación', rawValue: '3' },
        { value: '2', label: 'Crédito', rawValue: '2' }
      ],
      documentTypeOptions: [],
      currencyOptions: [],
      paymentMethodOptions: []
    } as any);

    // parent passes padded '03' – component should still select the matching opt
    const { rerender } = render(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{ CondicionVenta: '03' }} />
    );
    expect(screen.getByText(/Consignaci[oó]n/i)).toBeInTheDocument();

    // also try unpadded incoming value
    rerender(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{ CondicionVenta: '3' }} />
    );
    expect(screen.getByText(/Consignaci[oó]n/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  it('corrects mis‑coded id for consignación by label', async () => {
    const setValue = vi.fn();
    const onChange = vi.fn();
    const spy2 = vi.spyOn(InvoiceOptionsHook, 'useInvoiceOptions').mockReturnValue({
      saleConditionOptions: [
        { value: '1', label: 'Consignación', rawValue: '1' },
        { value: '2', label: 'Crédito', rawValue: '2' }
      ],
      documentTypeOptions: [],
      currencyOptions: [],
      paymentMethodOptions: []
    } as any);

    render(<InvoiceOptions setValue={setValue} onChange={onChange} values={{}} />);
    fireEvent.mouseDown(screen.getByText(/Contado|Consignaci/i));
    const option = await screen.findByRole('option', { name: /Consignaci/i });
    fireEvent.click(option);

    expect(setValue).toHaveBeenCalledWith('CondicionVenta', '3');
    expect(onChange).toHaveBeenCalledWith('CondicionVenta', '3');
    spy2.mockRestore();
  });

  it('works uncontrolled: user can pick a non-contado condition directly', async () => {
    const setValue = vi.fn();
    const onChange = vi.fn();

    render(<InvoiceOptions setValue={setValue} onChange={onChange} values={{}} />);

    // open the dropdown by clicking on the current value element
    const control = screen.getByText(/Contado/i);
    fireEvent.mouseDown(control);
    const credito = await screen.findByText(/Cr[eé]dito/i);
    fireEvent.click(credito);

    // control element should now display the chosen label
    expect(control.textContent).toMatch(/Cr[eé]dito/i);
    // callback must have been invoked with raw id
    expect(setValue).toHaveBeenCalledWith('CondicionVenta', '02');
  });

  it('still updates when only setValue is provided (no values/onChange)', async () => {
    const setValue = vi.fn();

    render(<InvoiceOptions setValue={setValue} />);

    const control = screen.getByText(/Contado/i);
    fireEvent.mouseDown(control);
    const credito = await screen.findByText(/Cr[eé]dito/i);
    fireEvent.click(credito);

    expect(setValue).toHaveBeenCalledWith('CondicionVenta', '02');
    expect(control.textContent).toMatch(/Cr[eé]dito/i);
  });

  it('disables condition dropdown and shows note when only one option exists', () => {
    // temporarily adjust the mocked hook to return just a single sale condition
    const spy = vi.spyOn(InvoiceOptionsHook, 'useInvoiceOptions').mockReturnValue({
      saleConditionOptions: [{ value: '01', label: 'Contado', rawValue: '01' }],
      documentTypeOptions: [],
      currencyOptions: [],
      paymentMethodOptions: []
    } as any);

    render(<InvoiceOptions />);

    expect(screen.getByText(/Solo hay una condición de venta disponible/)).toBeInTheDocument();
    const control = screen.getByText(/Contado/i);
    // attempt to open should not reveal other options
    fireEvent.mouseDown(control);
    expect(screen.queryByText(/Cr[eé]dito/i)).toBeNull();

    spy.mockRestore();
  });

  it('prefers local selection when values.prop CondicionVenta is empty string', async () => {
    const setValue = vi.fn();
    // start with parent supplying an object but empty string value
    render(<InvoiceOptions setValue={setValue} values={{ CondicionVenta: '' }} />);
    const control = screen.getByText(/Contado/i);
    fireEvent.mouseDown(control);
    const credito = await screen.findByText(/Cr[eé]dito/i);
    fireEvent.click(credito);

    // local state should drive control because props value was falsy
    expect(control.textContent).toMatch(/Cr[eé]dito/i);
    expect(setValue).toHaveBeenCalledWith('CondicionVenta', '02');
  });

  it('handles sale conditions with non-unique ids', async () => {
    const setValue = vi.fn();
    const onChange = vi.fn();
    // configure hook to return two options sharing the same rawValue
    const spy = vi.spyOn(InvoiceOptionsHook, 'useInvoiceOptions').mockReturnValue({
      saleConditionOptions: [
        { value: '01|0', label: 'Contado', rawValue: '01' },
        { value: '01|1', label: 'Arrendamiento', rawValue: '01' }
      ],
      documentTypeOptions: [],
      currencyOptions: [],
      paymentMethodOptions: []
    } as any);

    render(<InvoiceOptions setValue={setValue} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByText(/Contado/i));
    const option = await screen.findByRole('option', { name: /Arrendamiento/i });
    fireEvent.click(option);

    // ensure callbacks fired at all
    expect(setValue).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();

    // wait for the control text to update after state change
    const newControl = await screen.findByText(/Arrendamiento/i);
    expect(newControl).toBeInTheDocument();

    // callbacks should still receive the raw id
    expect(setValue).toHaveBeenCalledWith('CondicionVenta', '01');
    expect(onChange).toHaveBeenCalledWith('CondicionVenta', '01');

    spy.mockRestore();
  });

  it('shows an extra input when payment method is "Otros" and propagates changes', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();

    render(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{ TipoMedioPago: '99' }} />
    );

    const input = screen.getByLabelText(/Otro medio de pago/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Transferencia bancaria' } });
    expect(setValue).toHaveBeenCalledWith('MedioPagoOtros', 'Transferencia bancaria');
    expect(onChange).toHaveBeenCalledWith('MedioPagoOtros', 'Transferencia bancaria');
  });

  it('clears the other-payment field when method switches off "Otros"', () => {
    const setValue = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <InvoiceOptions
        setValue={setValue}
        onChange={onChange}
        values={{ TipoMedioPago: '99', MedioPagoOtros: 'abc' }}
      />
    );
    // initial input present
    expect(screen.getByLabelText(/Otro medio de pago/i)).toBeInTheDocument();

    // simulate prop change to non-99
    rerender(
      <InvoiceOptions setValue={setValue} onChange={onChange} values={{ TipoMedioPago: '01' }} />
    );
    expect(screen.queryByLabelText(/Otro medio de pago/i)).toBeNull();
    // setValue should have been called to clear the value
    expect(setValue).toHaveBeenCalledWith('MedioPagoOtros', '');
    expect(onChange).toHaveBeenCalledWith('MedioPagoOtros', '');
  });

  it('renders plazo and other inputs within the same row when both visible', () => {
    render(
      <InvoiceOptions
        values={{
          CondicionVenta: '02',
          TipoMedioPago: '99',
          MedioPagoOtros: 'abc',
          PlazoCredito: '10'
        }}
      />
    );
    const plazoInput = screen.getByLabelText(/Plazo cr[eé]dito/i);
    const otherInput = screen.getByLabelText(/Otro medio de pago/i);
    // check they share the same row parent element and that it uses
    // justify-content-between so inputs appear on opposite ends
    const row = plazoInput.closest('.row');
    expect(row).toBe(otherInput.closest('.row'));
    expect(row).toHaveClass('justify-content-between');
  });

  it('justify other-payment to end when credit is absent', () => {
    render(<InvoiceOptions values={{ TipoMedioPago: '99' }} />);
    const otherInput = screen.getByLabelText(/Otro medio de pago/i);
    const row = otherInput.closest('.row');
    expect(row).toHaveClass('justify-content-end');
  });

  it('filters out unwanted document types', () => {
    const rawOpts = [
      { value: '01', label: 'Factura Compra' },
      { value: '02', label: 'Factura Electronica' },
      { value: '03', label: 'Nota Credito' },
      { value: '04', label: 'Factura Exportacion' },
      { value: '05', label: 'Tiquete Electronico' },
      { value: '06', label: 'Pago parcial' }
    ];
    const filtered = filterDocumentTypes(rawOpts as any);
    const labels = filtered.map((o) => o.label);
    expect(labels).toEqual([
      'Factura Electronica',
      'Nota Credito',
      'Tiquete Electronico',
      'Pago parcial'
    ]);
  });
});
