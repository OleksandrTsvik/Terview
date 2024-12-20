import { GetProps, Menu } from 'antd';
import { SelectInfo } from 'rc-menu/lib/interface';
import { useLocation, useNavigate } from 'react-router';

import { SIDER_ITEMS } from './dashboard.constants';

type Props = GetProps<typeof Menu>;

export default function DashboardSiderMenu({ theme = 'dark', onSelect, ...props }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelect = (info: SelectInfo) => {
    navigate(info.key);
    onSelect?.(info);
  };

  return (
    <Menu
      {...props}
      mode="inline"
      theme={theme}
      items={SIDER_ITEMS}
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      onSelect={handleSelect}
    />
  );
}
