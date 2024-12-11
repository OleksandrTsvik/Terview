import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import AntdProvider from './antd/antd.provider';
import { router } from './router';
import { store } from './store';

import './index.scss';

export default function App() {
  return (
    <Provider store={store}>
      <AntdProvider>
        <RouterProvider router={router} />
      </AntdProvider>
    </Provider>
  );
}
