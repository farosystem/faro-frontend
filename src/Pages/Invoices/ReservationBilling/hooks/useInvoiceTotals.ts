import { useMemo } from 'react';

export function useInvoiceTotals(items: any[]) {
  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + Number(it.precioCompra || it.precio || 0) * Number(it.cantidadArticulo || 1),
        0
      ),
    [items]
  );

  const taxes = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc +
          (it.impuestos?.[0]?.impuesto
            ? (Number(it.impuestos[0].impuesto) / 100) *
              Number(it.precioCompra || it.precio || 0) *
              Number(it.cantidadArticulo || 1)
            : 0),
        0
      ),
    [items]
  );

  const total = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  return { subtotal, taxes, total };
}
