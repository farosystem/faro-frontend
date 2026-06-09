import EditWarehouseContainer from '@/Pages/Warehouses/EditWarehouseContainer';
import NewWarehouse from '@/Pages/Warehouses/NewWarehouse';
import Warehouses from '@/Pages/Warehouses/Warehouses';
import { AppRoute } from '../types';
import EditInternTransferContainer from '@/Pages/InternTransfers/EditInternTransferContainer';
import InternTransfers from '@/Pages/InternTransfers/InternTransfers';
import NewInternTransfer from '@/Pages/InternTransfers/NewInternTransfer';

const warehouseRoutes: AppRoute[] = [
  { path: '/warehouses', component: <Warehouses /> },
  { path: '/newwarehouse', component: <NewWarehouse /> },
  { path: '/editwarehouse/:id', component: <EditWarehouseContainer /> },
  { path: '/internTransfers', component: <InternTransfers /> },
  { path: '/newinterntransfer', component: <NewInternTransfer /> },
  { path: '/internTransfers/:id', component: <EditInternTransferContainer /> }
];

export default warehouseRoutes;
