import EditPaymentMethod from '@/Pages/GeneralSettings/PaymentMethod/EditPaymentMethod';
import NewPaymentMethod from '@/Pages/GeneralSettings/PaymentMethod/NewPaymentMethod';
import PaymentMethod from '@/Pages/GeneralSettings/PaymentMethod/PaymentMethod';
import { AppRoute } from '../types';

const paymentMethodsRoutes: AppRoute[] = [
  { path: '/paymentmethods', component: <PaymentMethod /> },
  { path: '/newpaymentmethod', component: <NewPaymentMethod /> },
  { path: '/editpaymentmethod/:id', component: <EditPaymentMethod /> }
];

export default paymentMethodsRoutes;
