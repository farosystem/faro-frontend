import BillingPage from '@/Pages/Invoices/Billing/BillingPage';
import InvoiceCompany from '@/Pages/Invoices/Company/Company';
import InvoiceCreditNote from '@/Pages/Invoices/CreditNote';
import InvoiceIssued from '@/Pages/Invoices/Issued';
import InvoiceParameters from '@/Pages/Invoices/Parameters';
import InvoiceMaintenance from '@/Pages/Invoices/Maintenance';

import { AppRoute } from '../types';

const invoiceRoutes: AppRoute[] = [
  { path: '/invoice/maintenance', component: <BillingPage /> },
  { path: '/invoice/credit/notes', component: <InvoiceCreditNote /> },
  { path: '/invoice/debit/notes', component: <InvoiceMaintenance /> },
  { path: '/invoice/issued', component: <InvoiceIssued /> },
  { path: '/invoice/parameters', component: <InvoiceParameters /> },
  { path: '/invoice/companies', component: <InvoiceCompany /> }
];

export default invoiceRoutes;
