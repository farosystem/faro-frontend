import AdminPackages from '@/Pages/GeneralSettings/Hotel/AdminPackage/AdminPackage';
import EditPackage from '@/Pages/GeneralSettings/Hotel/AdminPackage/EditPackage';
import NewPackage from '@/Pages/GeneralSettings/Hotel/AdminPackage/NewPackage';
import Amenities from '@/Pages/GeneralSettings/Hotel/Amenities/Amenities';
import EditAmenities from '@/Pages/GeneralSettings/Hotel/Amenities/EditAmenities';
import NewAmenities from '@/Pages/GeneralSettings/Hotel/Amenities/NewAmenities';
import EditExternalService from '@/Pages/GeneralSettings/Hotel/ExternalService/EditExternalService';
import ExternalService from '@/Pages/GeneralSettings/Hotel/ExternalService/ExternalService';
import NewExternalService from '@/Pages/GeneralSettings/Hotel/ExternalService/NewExternalService';
import EditExtraService from '@/Pages/GeneralSettings/Hotel/ExtraService/EditExtraService';
import ExtraService from '@/Pages/GeneralSettings/Hotel/ExtraService/ExtraService';
import NewExtraService from '@/Pages/GeneralSettings/Hotel/ExtraService/NewExtraService';
import HotelHomeSettings from '@/Pages/GeneralSettings/Hotel/HotelHomeSettings';
import EditItems from '@/Pages/GeneralSettings/Hotel/Items/EditItems';
import Items from '@/Pages/GeneralSettings/Hotel/Items/Items';
import NewItems from '@/Pages/GeneralSettings/Hotel/Items/NewItems';
import EditOperativeAreas from '@/Pages/GeneralSettings/Hotel/OperativeAreas/EditOperativeAreas';
import NewOperativeAreas from '@/Pages/GeneralSettings/Hotel/OperativeAreas/NewOperativeAreas';
import OperativeAreas from '@/Pages/GeneralSettings/Hotel/OperativeAreas/OperativeAreas';
import EditRoom from '@/Pages/GeneralSettings/Hotel/Rooms/EditRoom';
import NewRoom from '@/Pages/GeneralSettings/Hotel/Rooms/NewRoom';
import Rooms from '@/Pages/GeneralSettings/Hotel/Rooms/Roms';
import EditSeason from '@/Pages/GeneralSettings/Hotel/Season/EditSeason';
import NewSeason from '@/Pages/GeneralSettings/Hotel/Season/NewSeason';
import Season from '@/Pages/GeneralSettings/Hotel/Season/Season';
import EditTour from '@/Pages/GeneralSettings/Hotel/Tours/EditTour';
import NewTour from '@/Pages/GeneralSettings/Hotel/Tours/NewTour';
import EditTypeRoom from '@/Pages/GeneralSettings/Hotel/TypeRoom/EditTypeRoom';
import TypeRoom from '@/Pages/GeneralSettings/Hotel/TypeRoom/TypeRoom';
import NewTypeRom from '@/Pages/GeneralSettings/Hotel/TypeRoom/NewTypeRoom';
import EditTypeService from '@/Pages/GeneralSettings/Hotel/TypeService/EditTypeService';
import NewTypeService from '@/Pages/GeneralSettings/Hotel/TypeService/NewTypeService';
import TypeService from '@/Pages/GeneralSettings/Hotel/TypeService/TypeService';
import Tour from '@/Pages/GeneralSettings/Hotel/Tours/Tours';

import DishType from '@/Pages/GeneralSettings/DishType/DishType';
import EditDishType from '@/Pages/GeneralSettings/DishType/EditDishType';
import NewDishType from '@/Pages/GeneralSettings/DishType/NewDishType';
import EditFloor from '@/Pages/GeneralSettings/Floors/EditFloor';
import Floors from '@/Pages/GeneralSettings/Floors/Floors';
import NewFloor from '@/Pages/GeneralSettings/Floors/NewFloor';
import EditMenuType from '@/Pages/GeneralSettings/MenuType/EditMenuType';
import MenuType from '@/Pages/GeneralSettings/MenuType/MenuType';
import NewMenuType from '@/Pages/GeneralSettings/MenuType/NewMenuType';
import EditTable from '@/Pages/GeneralSettings/Tables/EditTable';
import NewTable from '@/Pages/GeneralSettings/Tables/NewTable';
import Tables from '@/Pages/GeneralSettings/Tables/Tables';

import { PackageProvider } from '@/Pages/GeneralSettings/Hotel/AdminPackage/context/PackageContext';
import { BookingProvider } from '@/Pages/Reception/Availability/NewBooking/context';
import { AppRoute } from '../types';

const hotelSettingsRoutes: AppRoute[] = [
  { path: '/hotelsettings', component: <HotelHomeSettings /> },
  { path: '/hotelsettings/typeroom', component: <TypeRoom /> },
  { path: '/hotelsettings/newtyperoom', component: <NewTypeRom /> },
  { path: '/hotelsettings/edittyperoom/:id', component: <EditTypeRoom /> },
  { path: '/hotelsettings/amenities', component: <Amenities /> },
  { path: '/hotelsettings/newamenities', component: <NewAmenities /> },
  { path: '/hotelsettings/editamenities/:id', component: <EditAmenities /> },
  { path: '/hotelsettings/extraservices', component: <ExtraService /> },
  { path: '/hotelsettings/newextraservices', component: <NewExtraService /> },
  {
    path: '/hotelsettings/editextraservice/:id',
    component: <EditExtraService idBooking={undefined} updateServiceBooking={undefined} />
  },
  { path: '/hotelsettings/externalservices', component: <ExternalService /> },
  {
    path: '/hotelsettings/newexternalservices',
    component: <NewExternalService />
  },
  {
    path: '/hotelsettings/editexternalservice/:id',
    component: <EditExternalService idBooking={undefined} updateServiceBooking={undefined} />
  },
  { path: '/hotelsettings/rooms', component: <Rooms /> },
  {
    path: '/hotelsettings/newroom',
    component: (
      <BookingProvider>
        <NewRoom />
      </BookingProvider>
    )
  },
  {
    path: '/hotelsettings/editroom/:id',
    component: <EditRoom />
  },
  { path: '/hotelsettings/season', component: <Season /> },
  { path: '/hotelsettings/newseason', component: <NewSeason /> },
  { path: '/hotelsettings/editseason/:id', component: <EditSeason /> },
  {
    path: '/hotelsettings/hotelpackages',
    component: (
      <PackageProvider>
        <AdminPackages />
      </PackageProvider>
    )
  },
  { path: '/hotelsettings/tours', component: <Tour /> },
  { path: '/hotelsettings/newtour', component: <NewTour /> },
  /**
   * TODO: Fix
   */
  {
    path: '/hotelsettings/edittour/:id',
    component: <EditTour idBooking={undefined} updateTourBooking={undefined} />
  },
  { path: '/hotelsettings/newpackage', component: <NewPackage /> },
  /**
   * TODO: Fix
   */
  {
    path: '/hotelsettings/editpackage/:id',
    component: (
      <PackageProvider>
        <BookingProvider>
          <EditPackage bookingId={undefined} updatePackage={undefined} />
        </BookingProvider>
      </PackageProvider>
    )
  },
  { path: '/hotelsettings/typeservice', component: <TypeService /> },
  { path: '/hotelsettings/newtypeservice', component: <NewTypeService /> },
  {
    path: '/hotelsettings/edittypeservice/:id',
    component: <EditTypeService />
  },
  { path: '/hotelsettings/operativeareas', component: <OperativeAreas /> },
  { path: '/hotelsettings/newoperativearea', component: <NewOperativeAreas /> },
  {
    path: '/hotelsettings/editoperativeareas/:id',
    component: <EditOperativeAreas />
  },
  { path: '/hotelsettings/items', component: <Items /> },
  { path: '/hotelsettings/newitems', component: <NewItems /> },
  { path: '/hotelsettings/edititems/:id', component: <EditItems /> },

  { path: '/floors', component: <Floors /> },
  { path: '/newfloor', component: <NewFloor /> },
  { path: '/editfloor/:id', component: <EditFloor /> },
  { path: '/tables', component: <Tables /> },
  { path: '/newtable', component: <NewTable /> },
  { path: '/edittable/:id', component: <EditTable /> },
  { path: '/menutype', component: <MenuType /> },
  { path: '/newmenutype', component: <NewMenuType /> },
  { path: '/editmenutype/:id', component: <EditMenuType /> },
  { path: '/dishtype', component: <DishType /> },
  { path: '/newdishtype', component: <NewDishType /> },
  { path: '/editdishtype/:id', component: <EditDishType /> }
];

export default hotelSettingsRoutes;
