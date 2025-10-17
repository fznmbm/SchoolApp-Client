import { lazy } from 'react';

const WhatsAppMessaging = lazy(() => import('@pages/WhatsAppMessaging'));

const messagingRoutes = [
    {
        path: '/messaging',
        element: <WhatsAppMessaging />
    },
];

export default messagingRoutes;