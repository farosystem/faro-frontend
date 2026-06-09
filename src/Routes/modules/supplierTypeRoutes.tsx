import EditSupplyType from '@/Pages/GeneralSettings/SupplyType/EditSupplyType';
import NewSupplyType from '@/Pages/GeneralSettings/SupplyType/NewSupplyType';
import SupplyType from '@/Pages/GeneralSettings/SupplyType/SupplyType';
import { AppRoute } from '../types';

const supplierTypeRoutes: AppRoute[] = [
  { path: '/suppliertype', component: <SupplyType /> },
  { path: '/newsuppliertype', component: <NewSupplyType /> },
  { path: '/editsuppliertype/:id', component: <EditSupplyType /> }
];

export default supplierTypeRoutes;
