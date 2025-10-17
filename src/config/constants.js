export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
  ADMIN_LIST: '/admins',
  ADMIN_CREATE: '/admins/create',
  ROUTES_LIST: '/routes',
  ROUTES_CREATE: '/routes/create',
};

export const RELATIONSHIPS = [
  { id: 'father', name: 'Father' },
  { id: 'mother', name: 'Mother' },
  { id: 'guardian', name: 'Guardian' },
];