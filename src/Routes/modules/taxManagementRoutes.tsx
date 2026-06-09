import EditTaxManagement from '@/Pages/TaxManagement/EditTaxManagement';
import NewTaxManagement from '@/Pages/TaxManagement/NewTaxManagement';
import TaxManagement from '@/Pages/TaxManagement/TaxManagement';
import { AppRoute } from '../types';

const taxManagementRoutes: AppRoute[] = [
  { path: '/taxmanagement', component: <TaxManagement /> },
  { path: '/newtaxmanagement', component: <NewTaxManagement /> },
  { path: '/edittaxmanagement/:id', component: <EditTaxManagement /> }
];

export default taxManagementRoutes;
