/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { RouteObject, createBrowserRouter } from 'react-router';

import { BASE_URL } from '@/common/node-env.constants';

import AnonymousOutlet from './anonymous.outlet';
import PrivateOutlet from './private.outlet';

const DashboardLayoutPage = lazy(() => import('@/features/dashboard-layout/dashboard-layout.page'));
const DashboardNotFoundPage = lazy(() => import('@/features/dashboard-layout/dashboard-not-found.page'));
const DashboardPage = lazy(() => import('@/features/dashboard-page/dashboard.page'));
const LayoutPage = lazy(() => import('@/features/layout/layout.page'));
const NotFoundPage = lazy(() => import('@/features/layout/not-found.page'));
const LoginPage = lazy(() => import('@/features/login-page/login.page'));
const LogsPage = lazy(() => import('@/features/logs-page/logs.page'));
const NoteAddPage = lazy(() => import('@/features/note-add-page/note-add.page'));
const NoteEditPage = lazy(() => import('@/features/note-edit-page/note-edit.page'));
const NotesEditPage = lazy(() => import('@/features/notes-edit-page/notes-edit.page'));
const NotesPage = lazy(() => import('@/features/notes-page/notes.page'));
const SchedulerPage = lazy(() => import('@/features/scheduler-page/scheduler.page'));

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
          { index: true, element: <DashboardPage /> },
          { path: 'notes', element: <NotesEditPage /> },
          { path: 'notes/add', element: <NoteAddPage /> },
          { path: 'notes/edit/:noteId', element: <NoteEditPage /> },
          { path: 'scheduler', element: <SchedulerPage /> },
          { path: 'logs', element: <LogsPage /> },
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
