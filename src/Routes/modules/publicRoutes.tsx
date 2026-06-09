import Login from '@/Pages/Authentication/Login';
import Logout from '@/Pages/Authentication/Logout';
import RecoverPassword from '@/Pages/Authentication/RecoverPassword';
import ForgetPasswordPage from '@/Pages/Authentication/ForgetPassword';
import Error404 from '@/Pages/Utility/Error404Page';
import InvoiceDev from '@/Pages/Utility/InvoiceDev';

import { Navigate } from 'react-router-dom';
import { AppRoute } from '../types';

const publicRoutes: AppRoute[] = [
  { path: '/logout', component: <Logout /> },
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <ForgetPasswordPage /> },
  { path: '/auth-recoverpw', component: <RecoverPassword /> },
  // development-only invoice preview
  { path: '/facturaprueba', component: <InvoiceDev /> },

  {
    path: '*',
    component: <Navigate to="/404" />
  },
  { path: '/404', component: <Error404 /> }
];

export default publicRoutes;
