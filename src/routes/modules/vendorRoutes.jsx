import { lazy } from 'react';

const VendorList = lazy(() => import('@pages/vendor/VendorList'));
const VendorCreate = lazy(() => import('@pages/vendor/VendorCreate'));
const VendorEdit = lazy(() => import('@pages/vendor/VendorEdit'));
const VendorView = lazy(() => import('@pages/vendor/VendorView'));

const vendorRoutes = [
  {
    path: '/vendors',
    element: <VendorList />
  },
  {
    path: '/vendors/create',
    element: <VendorCreate />
  },
  {
    path: '/vendors/:id/edit',
    element: <VendorEdit />
  },
  {
    path: '/vendors/:id',
    element: <VendorView />
  }
];

export default vendorRoutes;