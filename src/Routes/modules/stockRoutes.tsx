import EditProductContainer from '@/Pages/Stock/EditProductContainer';
import NewProduct from '@/Pages/Stock/NewProduct';
import Stock from '@/Pages/Stock/Stock';
import StockReport from '@/Pages/Stock/StockReport';
import NewStockMoveIn from '@/Pages/StockMove/NewStockMoveIn';
import NewStockMoveOut from '@/Pages/StockMove/NewStockMoveOut';
import StockMove from '@/Pages/StockMove/StockMove';
import { AppRoute } from '../types';

const stockRoutes: AppRoute[] = [
  { path: '/stock/:stockType', component: <Stock /> },
  { path: '/newproduct/:stockType', component: <NewProduct /> },
  { path: '/editproduct/:stockType/:id', component: <EditProductContainer /> },
  { path: '/stockreport/:stockType', component: <StockReport /> },

  {
    path: '/product/movements/:stockType/:productName/:productId',
    component: <StockMove />
  },
  {
    path: '/product/movements/in/:stockType/:productName/:productId',
    component: <NewStockMoveIn />
  },
  {
    path: '/product/movements/out/:stockType/:productName/:productId',
    component: <NewStockMoveOut />
  }
];

export default stockRoutes;
