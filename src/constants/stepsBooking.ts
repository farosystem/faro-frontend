export const stepsLabelBooking = {
  client: 'Cliente',
  bookDetails: 'Detalles de reserva',
  packages: 'Paquetes',
  rooms: 'Habitaciones',
  servicesAndTours: 'Servicios y Tours',
  guests: 'Huéspedes',
  notes: 'Notas',
  summary: 'Resumen'
};

export const stepsWizardMenuBooking = [
  {
    label: stepsLabelBooking.client,
    icon: 'mdi mdi-account-search-outline'
  },
  {
    label: stepsLabelBooking.bookDetails,
    icon: 'mdi mdi-calendar-range',
    disabled: true
  },
  {
    label: stepsLabelBooking.packages,
    icon: 'mdi mdi-package',
    disabled: true
  },
  {
    label: stepsLabelBooking.rooms,
    icon: 'mdi mdi-bed-outline',
    disabled: true
  },
  {
    label: stepsLabelBooking.guests,
    icon: 'mdi mdi-account-group-outline',
    disabled: true
  },
  {
    label: stepsLabelBooking.servicesAndTours,
    icon: 'mdi mdi-room-service-outline',
    disabled: true
  },
  {
    label: stepsLabelBooking.notes,
    icon: 'mdi mdi-text',
    disabled: true
  },
  {
    label: stepsLabelBooking.summary,
    icon: 'mdi mdi-text-box-check-outline',
    disabled: true
  }
];
