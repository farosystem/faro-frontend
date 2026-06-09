import CleaningJobs from '@/Pages/CleaningJobs/CleaningJobs';
import EditCleaningJobContainer from '@/Pages/CleaningJobs/EditCleaningJobContainer';
import NewCleaningJob from '@/Pages/CleaningJobs/NewCleaningJob';
import CleanlinessChecks from '@/Pages/CleanlinessCheck/CleanlinessChecks';
import EditCleanlinessCheckContainer from '@/Pages/CleanlinessCheck/EditCleanlinessCheckContainer';
import NewCleanlinessCheck from '@/Pages/CleanlinessCheck/NewCleanlinessCheck';
import { AppRoute } from '../types';

const cleaningjobsRoutes: AppRoute[] = [
  { path: '/cleaningjobs', component: <CleaningJobs /> },
  { path: '/editcleaningjob/:id', component: <EditCleaningJobContainer /> },
  { path: '/newcleaningjob', component: <NewCleaningJob /> },

  { path: '/cleaningjobs/checks', component: <CleanlinessChecks /> },
  { path: '/cleaningjobs/newcheck', component: <NewCleanlinessCheck /> },
  {
    path: '/cleaningjobs/check/:id',
    component: <EditCleanlinessCheckContainer />
  },

  { path: '/cleaningjobs', component: <CleaningJobs /> }
  // { path: "/editcleaningjob/:id", component: <EditCleaningJobContainer /> },
  // { path: "/newcleaningjob", component: <NewCleaningJob /> },
];

export default cleaningjobsRoutes;
