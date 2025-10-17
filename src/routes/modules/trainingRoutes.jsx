import { lazy } from 'react';

const TrainingList = lazy(() => import('@pages/training/TrainingList'));
const TrainingCreate = lazy(() => import('@pages/training/TrainingCreate'));
const TrainingEdit = lazy(() => import('@pages/training/TrainingEdit'));
const TrainingView = lazy(() => import('@pages/training/TrainingView'));

const trainingRoutes = [
  {
    path: '/training',
    element: <TrainingList />
  },
  {
    path: '/training/create',
    element: <TrainingCreate />
  },
  {
    path: '/training/:id/edit',
    element: <TrainingEdit />
  },
  {
    path: '/training/:id',
    element: <TrainingView />
  }
];

export default trainingRoutes;