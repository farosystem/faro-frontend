import AccountingControl from '@/Pages/AccountingControl/AccountingControl';
import AccountsPayable from '@/Pages/AccountingControl/AccountsPayable';
import AccountsReceivable from '@/Pages/AccountingControl/AccountsReceivable';
import EditAccountingControlContainer from '@/Pages/AccountingControl/EditAccountingControlContainer';
import NewAccountsControl from '@/Pages/AccountingControl/NewAccountsControl';
import { AppRoute } from '../types';

const accountingRoutes: AppRoute[] = [
  { path: '/accountingcontrol', component: <AccountingControl /> },
  { path: '/accountspayable', component: <AccountsPayable /> },
  { path: '/accountsreceivable', component: <AccountsReceivable /> },
  { path: '/newaccountscontrol/:tipo', component: <NewAccountsControl /> },
  {
    path: '/editaccountingcontrol/:tipo/:id',
    component: <EditAccountingControlContainer />
  }
];

export default accountingRoutes;
