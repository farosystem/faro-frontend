import GeneralSettings from '@/Pages/GeneralSettings/GeneralSettings';
import EditLocation from '@/Pages/GeneralSettings/Locations/EditLocations';
import NewLocation from '@/Pages/GeneralSettings/Locations/NewLocation';
import NotasManagement from '@/Pages/GeneralSettings/NotasManagement';
import EditRoleContainer from '@/Pages/GeneralSettings/Roles/EditRoleContainer';
import NewRole from '@/Pages/GeneralSettings/Roles/NewRole';
import Roles from '@/Pages/GeneralSettings/Roles/Roles';
import EditUser from '@/Pages/GeneralSettings/Users/EditUser';
import NewUser from '@/Pages/GeneralSettings/Users/NewUser';
import Location from '@/Pages/GeneralSettings/Locations/Locations';
import Users from '@/Pages/GeneralSettings/Users/Users';

import { AppRoute } from '../types';

const generalSettingsRoutes: AppRoute[] = [
  { path: '/generalsettings', component: <GeneralSettings /> },
  { path: '/users', component: <Users /> },
  { path: '/newuser', component: <NewUser /> },
  { path: '/edituser/:id', component: <EditUser /> },
  { path: '/roles', component: <Roles /> },
  { path: '/newrole', component: <NewRole /> },
  { path: '/editrole/:id', component: <EditRoleContainer /> },
  { path: '/locations', component: <Location /> },
  { path: '/editlocation/:id', component: <EditLocation /> },
  { path: '/newlocation', component: <NewLocation /> },
  { path: '/notasManagement', component: <NotasManagement /> }
];

export default generalSettingsRoutes;
