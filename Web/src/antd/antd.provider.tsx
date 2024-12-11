import { ConfigProvider, theme } from 'antd';
import ukUA from 'antd/locale/uk_UA';

interface Props {
  children: React.ReactNode;
}

export default function AntdProvider({ children }: Props) {
  return (
    <ConfigProvider
      locale={ukUA}
      theme={{
        algorithm: theme.darkAlgorithm,
        cssVar: true,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
