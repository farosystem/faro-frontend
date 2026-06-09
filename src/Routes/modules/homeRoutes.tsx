import { Navigate } from 'react-router-dom';
import { AppRoute } from '../types';
import Home from '@/Pages/Home';
import UserProfile from '@/Pages/Authentication/user-profile';

const homeRoutes: AppRoute[] = [
  {
    path: '/',
    exact: true,
    component: <Navigate to="/home" />
  },
  { path: '/home', component: <Home /> },
  { path: '/profile', component: <UserProfile /> }
];

export default homeRoutes;
