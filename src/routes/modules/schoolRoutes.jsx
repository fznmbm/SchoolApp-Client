import { lazy } from 'react';

const SchoolList = lazy(() => import('@pages/school/SchoolList'));
const SchoolCreate = lazy(() => import('@pages/school/SchoolCreate'));
const SchoolView = lazy(() => import('@pages/school/SchoolView'));
const SchoolEdit = lazy(() => import('@pages/school/SchoolEdit'));

const schoolRoutes = [
  {
    path: '/schools',
    element: <SchoolList />
  },
  {
    path: '/schools/create',
    element: <SchoolCreate />
  },
  {
    path: '/schools/:id',
    element: <SchoolView />
  },
  {
    path: '/schools/:id/edit',
    element: <SchoolEdit />
  }
];

export default schoolRoutes;