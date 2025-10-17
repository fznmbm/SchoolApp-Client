import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import studentRoutes from './modules/studentRoutes';
import driverRoutes from './modules/driverRoutes';
import routeRoutes from './modules/routeRoutes';
import schoolRoutes from './modules/schoolRoutes';
import jobRoutes from './modules/jobRoutes';
import paRoutes from './modules/paRoutes';
import licensingRoutes from './modules/licensingRoutes';
import trainingRoutes from './modules/trainingRoutes';
import adminRoutes from './modules/adminRoutes';
import vendorRoutes from './modules/vendorRoutes';
import corporateAccountRoutes from './modules/corporateAccountRoutes';
import { applicationRoutes } from './modules/applicationRoutes';

// Lazy load components
const Login = lazy(() => import('@/pages/login'));
const Layout = lazy(() => import('@components/layout/RootLayout'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const CompanyPage = lazy(() => import('@pages/settings/Company'));
const JobPreferences = lazy(() => import('@pages/jobs/JobPreferences'));
const NotFound = lazy(() => import('@pages/NotFound'));

// Define routes
const routes = [
  // Public routes
  {
    path: '/login',
    element: <Login />
  },
  
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Dashboard />
          },
          {
            path: '/company',
            element: <CompanyPage />
          },
          {
            path: '/settings/job-display',
            element: <JobPreferences />
          },
          // Spread feature modules
          ...studentRoutes,
          ...driverRoutes,
          ...routeRoutes,
          ...schoolRoutes,
          ...jobRoutes,
          ...paRoutes,
          ...licensingRoutes,
          ...trainingRoutes, 
          ...adminRoutes,
          ...vendorRoutes,
          ...corporateAccountRoutes,
          ...applicationRoutes
        ]
      }
    ]
  },
  
  // 404 route
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;