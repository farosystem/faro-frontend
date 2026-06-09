export const sidebarRoutes = [
  {
    label: 'Menú',
    isMainMenu: true
  },
  {
    label: 'Inicio',
    icon: 'mdi mdi-home-variant-outline',
    url: '/home',
    isHasArrow: true,
    bgcolor: 'bg-primary'
  },
  {
    label: 'Recepción',
    icon: 'mdi mdi-ballot-outline',
    url: '/reception',
    isHasArrow: true,
    subItem: [
      { sublabel: 'Disponibilidad', link: '/reception/availability' },
      { sublabel: 'Reservas', link: '/reception/availability/booking' },
      { sublabel: 'Check In', link: '/reception/checkin' },
      { sublabel: 'In House', link: '/reception/inhouse' },
      { sublabel: 'Check Out', link: '/reception/checkout' },
      { sublabel: 'Servicios Externos', link: '/reception/bookservice' },
      { sublabel: 'Reportes', link: '/reception/reports' }
    ]
  },
  {
    label: 'Clientes',
    icon: 'mdi mdi-account-group-outline',
    url: '/customers',
    isHasArrow: true
  },
  {
    label: 'Proveedores',
    icon: 'mdi mdi-truck-outline',
    url: '/suppliers',
    isHasArrow: true
  },
  {
    label: 'Activos',
    icon: 'mdi mdi-hammer-screwdriver',
    subItem: [
      { sublabel: 'Activos', link: '/assets' },
      { sublabel: 'Movimientos', link: '/assets/movements' }
    ]
  },
  {
    label: 'Restaurante',
    icon: 'mdi mdi-silverware-fork-knife',
    url: '/restaurant',
    subItem: [
      // { sublabel: "POS Restaurante", link: "/restaurant/pos" },
      // { sublabel: "Pedidos", link: "/restaurant/orders" },
      // { sublabel: "Sesiones", link: "/restaurant/sessions" },
      { sublabel: 'Gestión de menú', link: '/restaurant/menu' },
      { sublabel: 'Inventario', link: '/stock/Restaurante' },
      { sublabel: 'Comandas', link: '/restaurant/orders' },
      { sublabel: 'Ordenes Pendientes', link: '/restaurant/pendingorders' },
      { sublabel: 'Reportes', link: '/restaurant/reports' },
      { sublabel: 'Gestión de Anulaciones', link: '/restaurant/gestion-anulaciones' }
      // { sublabel: "Gestión de mesas", link: "/restaurant/tables" },
      // { sublabel: "Configuración", link: "/restaurant/settings" },
    ]
  },
  {
    label: 'Órdenes de compra',
    icon: 'mdi mdi-text-box-multiple-outline',
    subItem: [
      { sublabel: 'Órdenes de compra', link: '/purchaseorders' },
      { sublabel: 'Recepción de pedidos', link: '/productsreception' }
    ]
  },
  {
    label: 'Inventarios',
    icon: 'mdi mdi-clipboard-list-outline',
    subItem: [
      { sublabel: 'Hotel', link: '/stock/Hotel' },
      { sublabel: 'Restaurante', link: '/stock/Restaurante' },
      { sublabel: 'Tienda', link: '/stock/Tienda' }
    ]
  },
  {
    label: 'Almacenes',
    icon: 'mdi mdi-warehouse',
    subItem: [
      { sublabel: 'Almacenes', link: '/warehouses' },
      { sublabel: 'Transferencias internas', link: '/internTransfers' }
    ]
  },
  {
    label: 'Contabilidad',
    icon: 'mdi mdi-cash-multiple',
    subItem: [
      { sublabel: 'Todos los registros contables', link: '/accountingcontrol' },
      { sublabel: 'Cuentas por pagar', link: '/accountspayable' },
      { sublabel: 'Cuentas por cobrar', link: '/accountsreceivable' }
    ]
  },
  {
    label: 'Puestos de limpieza',
    icon: 'fas fa-soap',
    subItem: [
      { sublabel: 'Puestos de limpieza', link: '/cleaningjobs' },
      { sublabel: 'Chequeos', link: '/cleaningjobs/checks' },
      { sublabel: 'Registrar chequeo', link: '/cleaningjobs/newcheck' }
    ]
  },
  {
    label: 'Facturación Electronica',
    icon: 'mdi mdi-file-document',
    subItem: [
      { sublabel: 'Mantenimiento', link: '/invoice/maintenance' },
      { sublabel: 'Notas de crédito', link: '/invoice/credit/notes' },
      { sublabel: 'Notas de débito', link: '/invoice/debit/notes' },
      { sublabel: 'Documentos Emitidas', link: '/invoice/issued' },
      { sublabel: 'Parámetros', link: '/invoice/parameters' },
      { sublabel: 'Compañía', link: '/invoice/companies' }
    ]
  },
  {
    label: 'Movimientos de cajas',
    icon: 'mdi mdi-swap-horizontal-bold',
    url: '/cashmovements',
    isHasArrow: true
  },
  {
    label: 'Configuración',
    isMainMenu: true
  },
  {
    label: 'Mi perfil',
    icon: 'mdi mdi-account-circle-outline',
    url: '/profile',
    isHasArrow: true
  },
  {
    label: 'Ajustes generales',
    icon: 'mdi mdi-cog-outline',
    url: '/generalsettings',
    subItem: [
      { sublabel: 'Usuarios', link: '/users' },
      { sublabel: 'Roles', link: '/roles' },
      { sublabel: 'Tipo de proveeduría', link: '/suppliertype' },
      { sublabel: 'Ubicaciones', link: '/locations' },
      { sublabel: 'Pisos', link: '/floors' },
      { sublabel: 'Mesas', link: '/tables' },
      { sublabel: 'Impuestos', link: '/taxmanagement' },
      { sublabel: 'Hotel', link: '/hotelsettings' },
      { sublabel: 'Métodos de pago', link: '/paymentmethods' },
      { sublabel: 'Tipo de menú', link: '/menutype' },
      { sublabel: 'Tipo de platillo', link: '/dishtype' },
      { sublabel: 'Cajas', link: '/cashregisters' }
    ]
  }
];
