import { modules, publicRoutes } from './modules';

const authProtectedRoutes = [
  /**
   * Home Module
   */
  ...modules.homeRoutes,

  /**
   * Customer Module
   */
  ...modules.customerRoutes,

  /**
   * Purcharse OrdersModule
   */
  ...modules.purchaseOrdersRoutes,

  /**
   * Assets Module
   */
  ...modules.assetsRoutes,

  /**
   * Accounting Module
   */
  ...modules.accountingRoutes,

  /**
   * Stocks Module
   */
  ...modules.stockRoutes,

  /**
   * Suppliers Module
   */
  ...modules.suppliersRoutes,

  /**
   * Warehouse Module
   */
  ...modules.warehouseRoutes,

  /**
   * Restaurant Module
   */
  ...modules.restaurantRoutes,

  /**
   * Reception Module
   */
  ...modules.receptionRoutes,

  /**
   * Cleaning Jobs Module
   */
  ...modules.cleaningJobsRoutes,

  /**
   * Tax Management Module
   */
  ...modules.taxManagementRoutes,

  /**
   * General Settings Module
   */
  ...modules.generalSettingsRoutes,

  /**
   * Cash Register Module
   */
  ...modules.cashRegisterRoutes,

  /**
   * Supplier Type Routes
   */
  ...modules.supplierTypeRoutes,

  /**
   * Hotel Settings Module
   */
  ...modules.hotelSettingsRoutes,

  /**
   * Invoice Module
   */
  ...modules.invoiceRoutes,

  /**
   * Payment Methods Module
   */
  ...modules.paymentMethodsRoutes
];

export { authProtectedRoutes, publicRoutes };
