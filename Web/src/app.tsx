import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import AntdProvider from './antd/antd.provider';
import AuthMiddleware from './auth/auth.middleware';
import AppSuspense from './common/app.suspense';
import { router } from './router';
import { store } from './store';

import './components/ckeditor/ckeditor.scss';
import './index.scss';

export default function App() {
  return (
    <Provider store={store}>
      <AntdProvider>
        <AppSuspense>
          <AuthMiddleware>
            <RouterProvider router={router} />
          </AuthMiddleware>
        </AppSuspense>
      </AntdProvider>
    </Provider>
  );
}
