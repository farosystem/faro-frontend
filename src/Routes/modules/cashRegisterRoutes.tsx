import CashPartialClosure from '@/Pages/CashRegisterMovements/CashClosing/CashPartialClosure';
import CashGestionDetail from '@/Pages/CashRegisterMovements/CashGestionDetail';
import CashHome from '@/Pages/CashRegisterMovements/CashHome';
import CashRegisters from '@/Pages/GeneralSettings/CashRegister/CashRegisters';
import EditCashRegister from '@/Pages/GeneralSettings/CashRegister/EditCashRegisters';
import NewCashRegister from '@/Pages/GeneralSettings/CashRegister/NewCashRegister';
import { AppRoute } from '../types';

const cashRegisterRoutes: AppRoute[] = [
  { path: '/cashmovements', component: <CashHome /> },
  { path: '/cashmovements/gestion/:id', component: <CashGestionDetail /> },
  { path: '/cashregisters', component: <CashRegisters /> },
  { path: '/newcashregister', component: <NewCashRegister /> },
  { path: '/editcashregister/:id', component: <EditCashRegister /> },
  { path: '/cierre-parcial/:cajaId', component: <CashPartialClosure /> }
];

export default cashRegisterRoutes;
