import { GetProps, Menu } from 'antd';
import { SelectInfo } from 'rc-menu/lib/interface';
import { useLocation, useNavigate } from 'react-router';

import useSiderItems from './use-sider.items';

type Props = GetProps<typeof Menu>;

export default function DashboardSiderMenu({ theme = 'dark', onSelect, ...props }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const items = useSiderItems();

  const handleSelect = (info: SelectInfo) => {
    navigate(info.key);
    onSelect?.(info);
  };

  return (
    <Menu
      {...props}
      mode="inline"
      theme={theme}
      items={items}
      defaultSelectedKeys={[location.pathname]}
      selectedKeys={[location.pathname]}
      onSelect={handleSelect}
    />
  );
}
