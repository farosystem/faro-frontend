import { useMemo } from 'react';

export function useSelection(selectedLines: any[]) {
  const articulosLista = useMemo(
    () =>
      (selectedLines || []).map((l: any) => ({
        id: l.id,
        descripcion: l.descripcion || l.Detalle,
        codigoCabys: l.codigoCabys || '0',
        precioCompra: Number(l.precioCompra || l.PrecioUnitario || 0),
        cantidadArticulo: Number(l.cantidadArticulo || l.Cantidad || 1),
        impuestos: l.impuestos || []
      })),
    [selectedLines]
  );

  const subtotal = useMemo(
    () => articulosLista.reduce((s: number, a: any) => s + a.precioCompra * a.cantidadArticulo, 0),
    [articulosLista]
  );

  return { articulosLista, subtotal, hasSelection: articulosLista.length > 0 };
}
