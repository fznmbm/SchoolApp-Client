import { lazy } from 'react';

const StudentList = lazy(() => import('@pages/student/StudentList'));
const CreateStudent = lazy(() => import('@pages/student/StudentCreate'));
const StudentEdit = lazy(() => import('@pages/student/StudentEdit'));
const StudentView = lazy(() => import('@pages/student/StudentView'));

const studentRoutes = [
  {
    path: '/students',
    element: <StudentList />
  },
  {
    path: '/students/create',
    element: <CreateStudent />
  },
  {
    path: '/students/:id/edit',
    element: <StudentEdit />
  },
  {
    path: '/students/:id',
    element: <StudentView />
  }
];

export default studentRoutes;