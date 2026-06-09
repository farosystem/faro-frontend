import ReservationBillingPage from '@/Pages/Invoices/ReservationBilling/ReservationBillingPage';
import AvailabilityMatrix from '@/Pages/Reception/Availability/AvailabilityMatrix/AvailabilityMatrix';
import NewBooking from '@/Pages/Reception/Availability/NewBooking/components/NewBooking';
import BookService from '@/Pages/Reception/BookService/BookService';
import BookingCheckIn from '@/Pages/Reception/Check/CheckIn/BookingCheckIn';
import CheckIn from '@/Pages/Reception/Check/CheckIn/CheckIn';
import BookingCheckOut from '@/Pages/Reception/Check/CheckOut/BookingCheckOut';
import CheckOut from '@/Pages/Reception/Check/CheckOut/CheckOut';
import AdditionalServices from '@/Pages/Reception/InHouse/AdditionalServices/AdditionalServices';
import InHouse from '@/Pages/Reception/InHouse/InHouse';
import RoomChange from '@/Pages/Reception/InHouse/RoomChange/RoomChange';
import RoomCharges from '@/Pages/Reception/InHouse/RoomCharges/RoomCharges';
import Tours from '@/Pages/Reception/InHouse/Tours/Tours';
import ListBooking from '@/Pages/Reception/ListBooking/ListBooking';
import ReceptionHome from '@/Pages/Reception/ReceptionHome';
import Reports from '@/Pages/Reception/Reports/Reports';
import Booking from '@/Pages/Reception/Availability/Booking/Booking';
import { ReservationBillingProvider } from '@/Pages/Invoices/ReservationBilling/context/ReservationBillingContext';
import { BookingProvider } from '@/Pages/Reception/Availability/NewBooking/context';
import { AppRoute } from '../types';
import InHouseList from '@/Pages/Reception/InHouse/InHouseList';

const receptionRoutes: AppRoute[] = [
  { path: '/reception', component: <ReceptionHome /> },
  // { path: '/reception/availability', component: <AvailabilityNewBooking /> },
  { path: '/reception/availability', component: <AvailabilityMatrix /> },
  {
    path: '/reception/availability/newbooking',
    component: (
      <BookingProvider>
        <NewBooking />
      </BookingProvider>
    )
  },
  {
    path: '/reception/availability/editbooking/:id',
    component: (
      <BookingProvider>
        <NewBooking />
      </BookingProvider>
    )
  },
  { path: '/reception/availability/booking', component: <Booking /> },

  { path: '/reception/checkin', component: <CheckIn /> },
  { path: '/reception/checkout', component: <CheckOut /> },
  { path: '/reception/checkout/:id', component: <BookingCheckOut /> },
  { path: '/reception/checkin/:id', component: <BookingCheckIn /> },

  { path: '/reception/inhouse', component: <InHouseList /> },
  {
    path: '/reception/inhouse/roomChanges',
    component: <RoomChange />
  },
  {
    path: '/reception/inhouse/additionalServices',
    component: <AdditionalServices />
  },
  {
    path: '/reception/inhouse/roomCharge',
    component: <RoomCharges />
  },
  { path: '/reception/inhouse/tours', component: <Tours /> },
  {
    path: '/reception/inhouse/reservationServices',
    component: <div>Servicios de Reserva</div>
  },

  { path: '/reception/bookservice', component: <BookService /> },
  { path: '/reception/reports', component: <Reports /> },
  { path: '/reception/listbooking', component: <ListBooking /> },
  {
    path: '/reception/reservation/billing/:id',
    component: (
      <ReservationBillingProvider>
        <ReservationBillingPage />
      </ReservationBillingProvider>
    )
  }
];

export default receptionRoutes;
