import { RouteObject, createBrowserRouter } from 'react-router';

import { BASE_URL } from '@/common/node-env.constants';
import DashboardLayoutPage from '@/features/dashboard-layout/dashboard-layout.page';
import DashboardNotFoundPage from '@/features/dashboard-layout/dashboard-not-found.page';
import LayoutPage from '@/features/layout/layout.page';
import NotFoundPage from '@/features/layout/not-found.page';
import LoginPage from '@/features/login-page/login.page';
import NoteAddPage from '@/features/note-add-page/note-add.page';
import NoteEditPage from '@/features/note-edit-page/note-edit.page';
import NotesEditPage from '@/features/notes-edit-page/notes-edit.page';
import NotesPage from '@/features/notes-page/notes.page';

import AnonymousOutlet from './anonymous.outlet';
import PrivateOutlet from './private.outlet';

const routes: RouteObject[] = [
  {
    element: <AnonymousOutlet />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <PrivateOutlet />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayoutPage />,
        children: [
          { index: true, element: 'Dashboard' },
          { path: 'notes', element: <NotesEditPage /> },
          { path: 'notes/add', element: <NoteAddPage /> },
          { path: 'notes/edit/:noteId', element: <NoteEditPage /> },
          { path: '*', element: <DashboardNotFoundPage /> },
        ],
      },
    ],
  },
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
  basename: BASE_URL,
});
