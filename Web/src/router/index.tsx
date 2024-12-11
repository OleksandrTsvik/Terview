import { RouteObject, createBrowserRouter } from 'react-router';

import LayoutPage from '../features/layout/layout.page';
import NotFoundPage from '../features/layout/not-found.page';
import NotesPage from '../features/notes/notes.page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPage />,
    children: [
      { index: true, element: <NotesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});
