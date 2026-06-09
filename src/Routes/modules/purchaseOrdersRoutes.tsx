import EditProductsReceptionContainer from '@/Pages/ProductsReception/EditProductsReceptionContainer';
import ProductsReception from '@/Pages/ProductsReception/ProductsReception';
import EditPurchaseOrderContainer from '@/Pages/PurchaseOrders/EditPurchaseOrderContainer';
import NewPurchaseOrder from '@/Pages/PurchaseOrders/NewPurchaseOrder';
import PurchaseOrders from '@/Pages/PurchaseOrders/PurchaseOrders';
import { AppRoute } from '../types';

const purcharseOrdersRoutes: AppRoute[] = [
  { path: '/purchaseorders', component: <PurchaseOrders /> },
  { path: '/newpurchaseorder', component: <NewPurchaseOrder /> },
  { path: '/editpurchaseorder/:id', component: <EditPurchaseOrderContainer /> },

  { path: '/productsreception', component: <ProductsReception /> },
  {
    path: '/productsreception/:id',
    component: <EditProductsReceptionContainer />
  }
];

export default purcharseOrdersRoutes;
