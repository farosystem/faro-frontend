import EditSupplierContainer from '@/Pages/Suppliers/EditSupplierContainer';
import NewSupplier from '@/Pages/Suppliers/NewSupplier';
import Suppliers from '@/Pages/Suppliers/Suppliers';
import { AppRoute } from '../types';

const suppliersRoutes: AppRoute[] = [
  { path: '/suppliers', component: <Suppliers /> },
  { path: '/newsupplier', component: <NewSupplier /> },
  { path: '/editsupplier/:id', component: <EditSupplierContainer /> }
];

export default suppliersRoutes;
