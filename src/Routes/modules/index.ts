import accountingRoutes from './accountingRoutes';
import assetsRoutes from './assetsRoutes';
import cashRegisterRoutes from './cashRegisterRoutes';
import cleaningJobsRoutes from './cleaningJobsRoutes';
import customerRoutes from './customerRoutes';
import generalSettingsRoutes from './generalSettingsRoutes';
import invoiceRoutes from './invoiceRoutes';
import paymentMethodsRoutes from './paymentMethodsRoutes';
import purchaseOrdersRoutes from './purchaseOrdersRoutes';
import receptionRoutes from './receptionRoutes';
import restaurantRoutes from './restaurantRoutes';
import stockRoutes from './stockRoutes';
import suppliersRoutes from './suppliersRoutes';
import supplierTypeRoutes from './supplierTypeRoutes';
import taxManagementRoutes from './taxManagementRoutes';
import warehouseRoutes from './warehouseRoutes';
import hotelSettingsRoutes from './hotelSettingsRoutes';
import publicRoutes from './publicRoutes';
import homeRoutes from './homeRoutes';

export {
  homeRoutes,
  cashRegisterRoutes,
  hotelSettingsRoutes,
  invoiceRoutes,
  receptionRoutes,
  stockRoutes,
  restaurantRoutes,
  publicRoutes,
  cleaningJobsRoutes,
  purchaseOrdersRoutes,
  assetsRoutes,
  taxManagementRoutes,
  paymentMethodsRoutes,
  supplierTypeRoutes,
  suppliersRoutes,
  accountingRoutes,
  warehouseRoutes,
  customerRoutes,
  generalSettingsRoutes
};

const modules = {
  homeRoutes,
  customerRoutes,
  purchaseOrdersRoutes,
  assetsRoutes,
  accountingRoutes,
  stockRoutes,
  suppliersRoutes,
  warehouseRoutes,
  restaurantRoutes,
  receptionRoutes,
  cleaningJobsRoutes,
  taxManagementRoutes,
  generalSettingsRoutes,
  cashRegisterRoutes,
  supplierTypeRoutes,
  hotelSettingsRoutes,
  invoiceRoutes,
  paymentMethodsRoutes
};

export { modules };
