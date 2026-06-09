import { describe, it, expect } from 'vitest';
import { findOptionByValue } from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';
import type { Option } from '@/Pages/Restaurant/Orders/Invoice/utils/facturacionHelpers';

const saleConditions: Option[] = [
  { value: '01', label: 'Contado', rawValue: '01' },
  { value: '03', label: 'Consignaci\u00f3n', rawValue: '03' }
];

describe('findOptionByValue helper', () => {
  it('returns the correct option regardless of padding or slug', () => {
    expect(findOptionByValue(saleConditions, '3')?.label).toBe('Consignaci\u00f3n');
    expect(findOptionByValue(saleConditions, '03')?.label).toBe('Consignaci\u00f3n');
    expect(findOptionByValue(saleConditions, '03|foo')?.label).toBe('Consignaci\u00f3n');

    // when saleConditions hold the wrong id but correct label, we still
    // locate the option by inspecting its label
    const badList: Option[] = [{ value: '1', label: 'Consignación', rawValue: '1' }];
    expect(findOptionByValue(badList, '3')?.label).toBe('Consignación');
  });

  it('returns undefined for unknown values', () => {
    expect(findOptionByValue(saleConditions, '02')).toBeUndefined();
    expect(findOptionByValue(saleConditions, '')).toBeUndefined();
  });
});
