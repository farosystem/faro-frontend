import Customers from '@/Pages/Customers/Customers';
import EditCustomerContainer from '@/Pages/Customers/EditCustomerContainer';
import NewCustomer from '@/Pages/Customers/NewCustomer';
import { AppRoute } from '../types';

const customerRoutes: AppRoute[] = [
  { path: '/customers', component: <Customers /> },
  { path: '/newcustomer', component: <NewCustomer /> },
  { path: '/editcustomer/:id', component: <EditCustomerContainer /> }
];

export default customerRoutes;
