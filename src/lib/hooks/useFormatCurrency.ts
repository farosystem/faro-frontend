import { useMemo } from 'react';

const CURRENCY_MAP: Record<string, string> = {
  COLONES: 'CRC',
  DOLARES: 'USD',
  EUROS: 'EUR'
};

const localeMap: Record<string, string> = {
  CRC: 'es-CR',
  USD: 'en-US',
  EUR: 'es-ES'
};

const useFormatCurrency = (currency: string) => {
  const code = CURRENCY_MAP[currency.toUpperCase()] || currency;
  const locale = localeMap[code] || 'es-CR';

  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (_e) {
      return {
        format: (v: number) => String(v)
      } as Intl.NumberFormat;
    }
  }, [code, locale]);

  const format = useMemo(
    () => (amt: string | number) => {
      const num = typeof amt === 'string' ? parseFloat(amt) : amt;
      return formatter.format(isNaN(num) ? 0 : num);
    },
    [formatter]
  );

  return { format };
};

export { useFormatCurrency };
