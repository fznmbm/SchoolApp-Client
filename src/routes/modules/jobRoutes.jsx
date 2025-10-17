
import JobList from '@/pages/jobs/JobList';
import { lazy } from 'react';

const DailyJobsView = lazy(() => import('@pages/jobs/DailyJobsView'));
const RouteJobsView = lazy(() => import('@pages/jobs/RouteJobsView'));
const JobCreate = lazy(() => import('@pages/jobs/JobCreate'));
const JobEdit = lazy(() => import('@pages/jobs/JobEdit'));
const CalendarPage = lazy(() => import('@pages/jobs/CalendarPage'));
const JobView = lazy(() => import('@pages/jobs/JobView'));

const jobRoutes = [
  {
    path: '/jobs',
    element: <DailyJobsView />
  },{
    path: '/jobs-list',
    element: <JobList />
  },
  {
    path: '/jobs-route',
    element: <RouteJobsView />
  },
  {
    path: '/jobs/create',
    element: <JobCreate />
  },
  {
    path: '/jobs/:id/edit', 
    element: <JobEdit />
  },
  {
    path: '/jobs/:id',
    element: <JobView />
  },
  {
    path: '/calender',
    element: <CalendarPage />
  }
];

export default jobRoutes;