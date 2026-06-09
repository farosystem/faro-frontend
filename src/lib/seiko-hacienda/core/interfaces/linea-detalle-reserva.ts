import { LineaDetalle } from './hacienda';

export interface LineaDetalleReservaUI extends Partial<LineaDetalle> {
  id: string;
  category: 'Reserva' | 'Habitaciones' | 'Servicios' | 'Tours' | 'Paquetes' | 'Otros';
  source: 'room' | 'service' | 'tour' | 'package' | 'other';
  reservaHabitacionId?: string | null;
  precioCompra?: number | string;
  cantidadArticulo?: number | string;
  descripcion?: string;
}
