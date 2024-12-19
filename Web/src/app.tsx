import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import AntdProvider from './antd/antd.provider';
import AuthMiddleware from './auth/auth.middleware';
import { router } from './router';
import { store } from './store';

import './index.scss';

export default function App() {
  return (
    <Provider store={store}>
      <AntdProvider>
        <AuthMiddleware>
          <RouterProvider router={router} />
        </AuthMiddleware>
      </AntdProvider>
    </Provider>
  );
}
