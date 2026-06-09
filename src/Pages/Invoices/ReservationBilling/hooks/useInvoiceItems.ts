import { useEffect, useState } from 'react';
import { BillingData } from '../components/Billing/types';
import { LineaDetalleReservaUI } from '@/lib/seiko-hacienda/core/interfaces/linea-detalle-reserva';

export function useInvoiceItems(initialData: BillingData) {
  const [items, setItems] = useState<LineaDetalleReservaUI[]>(
    () => initialData?.articulosLista || []
  );

  useEffect(() => {
    if (initialData?.articulosLista) setItems(initialData.articulosLista);
  }, [initialData]);

  const addItem = (item: any) =>
    setItems((s) => [...s, { ...item, cantidadArticulo: item.cantidadArticulo || 1 }]);

  const removeItem = (index: number) => setItems((s) => s.filter((_, i) => i !== index));

  const updateItemQuantity = (index: number, cantidad: number) =>
    setItems((s) => s.map((it, i) => (i === index ? { ...it, cantidadArticulo: cantidad } : it)));

  return { items, setItems, addItem, removeItem, updateItemQuantity };
}
