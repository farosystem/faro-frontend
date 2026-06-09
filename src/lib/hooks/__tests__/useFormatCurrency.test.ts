import { renderHook } from '@testing-library/react-hooks';
import { useFormatCurrency } from '../useFormatCurrency';

describe('useFormatCurrency', () => {
  it('formats numbers with two decimal places and currency symbol', () => {
    const { result } = renderHook(() => useFormatCurrency('COLONES'));
    const { format } = result.current;
    const formatted = format(200);
    // should contain at least two decimal digits after separator (comma or dot)
    expect(formatted).toMatch(/\d+[\.,]\d{2}/);
  });

  it('handles string input and non-numeric values gracefully', () => {
    const { result } = renderHook(() => useFormatCurrency('USD'));
    const { format } = result.current;
    expect(format('123.456')).toMatch(/123\.46/);
    expect(format('foo')).toMatch(/0\.00/);
  });
});
