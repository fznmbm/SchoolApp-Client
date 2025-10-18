import { lazy } from 'react';

const AdminList = lazy(() => import('@pages/admin/AdminList'));
const AdminCreate = lazy(() => import('@pages/admin/AdminCreate'));
const AdminEdit = lazy(() => import('@pages/admin/AdminEdit'));
const AdminView = lazy(() => import('@pages/admin/AdminView'));

const adminRoutes = [
  {
    path: '/admins',
    element: <AdminList />
  },
  {
    path: '/admins/create',
    element: <AdminCreate />
  },
  {
    path: '/admins/:id/edit',
    element: <AdminEdit />
  },
  {
    path: '/admins/:id',
    element: <AdminView />
  }
];

export default adminRoutes;