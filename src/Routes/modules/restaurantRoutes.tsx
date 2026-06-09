import { Routes, Route } from 'react-router-dom';
import EditMenuContainer from '@/Pages/Restaurant/Menu/EditMenuContainer';
import NewMenu from '@/Pages/Restaurant/Menu/NewMenu';
import CreateOrder from '@/Pages/Restaurant/Orders/CreateOrder';
import RestaurantOrderInvoice from '@/Pages/Restaurant/Orders/Invoice/RestaurantOrderInvoice';
import RestaurantOrderPayment from '@/Pages/Restaurant/Orders/Payment/RestaurantOrderPayment';
import Orders from '@/Pages/Restaurant/Orders/Orders';
import PendingOrders from '@/Pages/Restaurant/PendingOrders/PendingOrders';
import RestaurantHome from '@/Pages/Restaurant/RestaurantHome';
import Menu from '@/Pages/Restaurant/Menu/Menu';
import WeeklyTracking from '@/Pages/Restaurant/Tracking/Tracking';
import Reports from '@/Pages/Restaurant/Reports/Reports';
import GestionAnulacionesPendientes from '@/Pages/GestionAnulaciones/GestionAnulacionesPendientes';

import { AppRoute } from '../types';
import { RestaurantOrderProvider } from '@/Pages/Restaurant/Orders/context/RestaurantOrderContext';
import { RestaurantOrderInvoiceProvider } from '@/Pages/Restaurant/Orders/Invoice/context/RestaurantOrderInvoiceContext';

const restaurantRoutes: AppRoute[] = [
  {
    path: '/restaurant/*',
    component: (
      <RestaurantOrderInvoiceProvider>
        <Routes>
          <Route path="/" element={<RestaurantHome />} />
          <Route path="newmenu" element={<NewMenu />} />
          <Route path="menu" element={<Menu />} />
          <Route path="editmenu/:id" element={<EditMenuContainer />} />
          <Route path="orders/new" element={<CreateOrder />} />
          <Route path="pendingorders" element={<PendingOrders />} />
          <Route path="weekly-tracking" element={<WeeklyTracking />} />
          <Route path="reports" element={<Reports />} />

          <Route
            path="orders"
            element={
              <RestaurantOrderProvider>
                <Orders />
              </RestaurantOrderProvider>
            }
          />

          <Route path="orders/payment" element={<RestaurantOrderPayment />} />
          <Route path="orders/invoice" element={<RestaurantOrderInvoice />} />
          <Route path="gestion-anulaciones" element={<GestionAnulacionesPendientes />} />
        </Routes>
      </RestaurantOrderInvoiceProvider>
    )
  }
];

export default restaurantRoutes;
