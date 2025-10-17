import { lazy } from 'react';

const LicensingAuthorityList = lazy(() => import('@pages/licensingAuthority/LicensingAuthorityList'));
const LicensingAuthorityCreate = lazy(() => import('@pages/licensingAuthority/LicensingAuthorityCreate'));
const LicensingAuthorityEdit = lazy(() => import('@pages/licensingAuthority/LicensingAuthorityEdit'));
const LicensingAuthorityView = lazy(() => import('@pages/licensingAuthority/LicensingAuthorityView'));

const licensingRoutes = [
  {
    path: '/licensing-authority',
    element: <LicensingAuthorityList />
  },
  {
    path: '/licensing-authority/create',
    element: <LicensingAuthorityCreate />
  },
  {
    path: '/licensing-authority/:id/edit',
    element: <LicensingAuthorityEdit />
  },
  {
    path: '/licensing-authority/:id',
    element: <LicensingAuthorityView />
  }
];

export default licensingRoutes;