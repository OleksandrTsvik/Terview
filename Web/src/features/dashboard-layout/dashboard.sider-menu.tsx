import { Menu } from 'antd';
import { SelectInfo } from 'rc-menu/lib/interface';
import { useLocation, useNavigate } from 'react-router';

import { SIDER_ITEMS } from './dashboard.constants';

export default function DashboardSiderMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelect = (info: SelectInfo) => {
    navigate(info.key);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={SIDER_ITEMS}
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      onSelect={handleSelect}
    />
  );
}
