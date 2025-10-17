import { lazy } from 'react';

const DriverList = lazy(() => import('@pages/drivers/DriverList'));
const DriverCreate = lazy(() => import('@pages/drivers/DriverCreate'));
const DriverView = lazy(() => import('@pages/drivers/DriverView'));
const DriverEdit = lazy(() => import('@pages/drivers/DriverEdit'));
const DriverInvoiceHistory = lazy(() => import('@pages/DriverInvoiceHistory'));

const driverRoutes = [
  {
    path: '/drivers',
    element: <DriverList />
  },
  {
    path: '/drivers/create',
    element: <DriverCreate />
  },
  {
    path: '/drivers/:id',
    element: <DriverView />
  },
  {
    path: '/drivers/:id/edit',
    element: <DriverEdit />
  },
  {
    path: '/drivers/invoice',
    element: <DriverInvoiceHistory />
  }
];

export default driverRoutes;