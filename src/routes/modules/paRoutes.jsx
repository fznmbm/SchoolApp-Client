import { lazy } from 'react';

const PAList = lazy(() => import('@pages/pa/PAList'));
const PACreate = lazy(() => import('@pages/pa/PACreate'));
const PAEdit = lazy(() => import('@pages/pa/PAEdit'));
const PAView = lazy(() => import('@pages/pa/PAView'));

const paRoutes = [
  {
    path: '/pa',
    element: <PAList />
  },
  {
    path: '/pa/create',
    element: <PACreate />
  },
  {
    path: '/pa/:id/edit',
    element: <PAEdit />
  },
  {
    path: '/pa/:id',
    element: <PAView />
  }
];

export default paRoutes;