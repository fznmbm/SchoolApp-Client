import { lazy } from 'react';

const CorporateAccountList = lazy(() => import('@pages/corporateAccount/CorporateAccountList'));
const CorporateAccountCreate = lazy(() => import('@pages/corporateAccount/CorporateAccountCreate'));
const CorporateAccountEdit = lazy(() => import('@pages/corporateAccount/CorporateAccountEdit'));
const CorporateAccountView = lazy(() => import('@pages/corporateAccount/CorporateAccountView'));

const corporateAccountRoutes = [
  { path: '/corporate-accounts', element: <CorporateAccountList /> },
  { path: '/corporate-accounts/create', element: <CorporateAccountCreate /> },
  { path: '/corporate-accounts/:id/edit', element: <CorporateAccountEdit /> },
  { path: '/corporate-accounts/:id', element: <CorporateAccountView /> },
];

export default corporateAccountRoutes;


