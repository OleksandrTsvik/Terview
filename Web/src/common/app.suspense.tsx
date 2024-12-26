import { Spin } from 'antd';
import { Suspense } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function AppSuspense({ children }: Props) {
  return <Suspense fallback={<Spin fullscreen />}>{children}</Suspense>;
}
