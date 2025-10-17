import { useRoutes } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
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
import messagingRoutes from './modules/messagingRoutes';
import corporateAccountRoutes from './modules/corporateAccountRoutes';
import oddJobRoutes from './modules/oddJobRoutes';
import InvoiceWizard from '@/pages/InvoiceWizard';

// Lazy load application components
const ApplicationForm = lazy(() => import('@/components/forms/application-form/ApplicationForm'));
const ApplicationsList = lazy(() => import('@/pages/applications/ApplicationsList'));
const ApplicationView = lazy(() => import('@/pages/applications/ApplicationView'));


// Lazy load components
const Login = lazy(() => import('@/pages/login'));
const Layout = lazy(() => import('@components/layout/RootLayout'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Calendar = lazy(() => import('@pages/jobs/CalendarPage'));
const CompanyPage = lazy(() => import('@pages/settings/Company'));
const JobPreferences = lazy(() => import('@pages/jobs/JobPreferences'));
const NotFound = lazy(() => import('@pages/NotFound'));

const AppRoutes = () => {
  // Define routes with JSX elements
  const routes = [
    // Public routes (redirect to dashboard if already authenticated)
    {
      element: <PublicRoute />,
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/staff-invoice',
          element: <InvoiceWizard/>
        },
        {
          path: '/apply',
          element: <ApplicationForm />
        }
      ]
    },

    // Protected routes (redirect to login if not authenticated)
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
              path: '/calendar',
              element: <Calendar />
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
            ...oddJobRoutes,
            ...messagingRoutes,
            {
              path: '/applications',
              element: <ApplicationsList />
            },
            {
              path: '/applications/:id',
              element: <ApplicationView />
            }
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

  // Return the routes using useRoutes hook
  return useRoutes(routes);
};

export default AppRoutes;