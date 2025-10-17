import { lazy } from 'react';

const RouteList = lazy(() => import('@pages/routes/RouteList'));
const RouteCreate = lazy(() => import('@pages/routes/RouteCreate'));
const RouteEdit = lazy(() => import('@pages/routes/RouteEdit'));
const RouteView = lazy(() => import('@pages/routes/RouteView'));

const routeRoutes = [
  {
    path: '/routes',
    element: <RouteList />
  },
  {
    path: '/routes/create',
    element: <RouteCreate />
  },
  {
    path: '/routes/:id/edit',
    element: <RouteEdit />
  },
  {
    path: '/routes/:id',
    element: <RouteView />
  }
];

export default routeRoutes;