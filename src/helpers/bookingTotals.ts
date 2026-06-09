export type BookingTotalsInput = {
  packageList?: any[];
  rooms?: any[];
  servicesPerRoom?: any[];
  extraServices?: any[];
  tours?: any[];
  peopleCount?: number;
  nights?: number;
};

export type BookingTotals = {
  totalPackage: number;
  roomsSubtotal: number;
  servicePerRoomSubtotal: number;
  extraServicesSubtotal: number;
  toursSubtotal: number;
  total: number;
  cancellation?: {
    byCategory: {
      packages: number;
      rooms: number;
      servicePerRoom: number;
      extraServices: number;
      tours: number;
    };
    penaltyRate: number;
    totalPenalty: number;
    refundable: number;
    daysUntilCheckin: number | null;
  };
};

import dayjs from 'dayjs';

const sum = (arr: any[] = [], fn: (item: any) => number) =>
  (arr || []).reduce((t, item) => t + fn(item), 0);

export function computeTotals(
  input: BookingTotalsInput & { checkIn?: string | number | Date | null }
): BookingTotals {
  const {
    packageList = [],
    rooms = [],
    servicesPerRoom = [],
    extraServices = [],
    tours = [],
    peopleCount = 0,
    nights = 0,
    checkIn = null
  } = input as any;

  const totalPackage = sum(packageList, (p) => (p?.precio || 0) * (peopleCount || 1));

  const roomsSubtotal = sum(rooms, (r) => (r?.precioPorNoche || 0) * nights);

  const servicePerRoomSubtotal = sum(servicesPerRoom, (room) => {
    const services = Array.isArray(room.service) ? room.service : [room.service];
    return sum(services.filter(Boolean), (s) => (s?.precio || 0) * (parseInt(s?.extra) || 1));
  });

  const extraServicesSubtotal = sum(extraServices, (s) => (s?.precio || 0) * (s?.extra || 1));

  const toursSubtotal = sum(tours, (t) => t?.precio || 0) * (peopleCount || 1);

  const total =
    totalPackage + roomsSubtotal + servicePerRoomSubtotal + extraServicesSubtotal + toursSubtotal;

  // Cancellation calculations
  let daysUntilCheckin: number | null = null;
  if (checkIn) {
    try {
      daysUntilCheckin = Math.max(
        0,
        dayjs(checkIn).startOf('day').diff(dayjs().startOf('day'), 'day')
      );
    } catch (e) {
      daysUntilCheckin = null;
    }
  }

  // Default policy (MVP): >=7 days -> 0%, 2-6 days -> 50%, <2 days -> 100%
  const penaltyRate =
    daysUntilCheckin === null ? 0 : daysUntilCheckin >= 7 ? 0 : daysUntilCheckin >= 2 ? 0.5 : 1;

  const byCategory = {
    packages: totalPackage,
    rooms: roomsSubtotal,
    servicePerRoom: servicePerRoomSubtotal,
    extraServices: extraServicesSubtotal,
    tours: toursSubtotal
  };

  const totalPenalty = Object.values(byCategory).reduce((s, v) => s + v * penaltyRate, 0);
  const refundable = total - totalPenalty;

  return {
    totalPackage,
    roomsSubtotal,
    servicePerRoomSubtotal,
    extraServicesSubtotal,
    toursSubtotal,
    total,
    cancellation: {
      byCategory,
      penaltyRate,
      totalPenalty,
      refundable,
      daysUntilCheckin
    }
  };
}

export function formatCurrency(value: number, currency = 'USD') {
  return value.toLocaleString(undefined, { style: 'currency', currency, minimumFractionDigits: 0 });
}
