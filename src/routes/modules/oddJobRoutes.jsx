import { lazy } from "react";

const OddJobList = lazy(() => import("@/pages/jobs/OddJobList"));
const OddJobCreate = lazy(() => import("@/pages/jobs/OddJobCreate"));
const OddJobEdit = lazy(() => import("@/pages/jobs/OddJobEdit"));
const OddJobView = lazy(() => import("@/pages/jobs/OddJobView"));

const oddJobRoutes = [
  {
    path: "/odd-jobs",
    element: <OddJobList />,
  },
  {
    path: "/odd-jobs/create",
    element: <OddJobCreate />,
  },
  {
    path: "/odd-jobs/:id/edit",
    element: <OddJobEdit />,
  },
  {
    path: "/odd-jobs/:id",
    element: <OddJobView />,
  },
];

export default oddJobRoutes;
