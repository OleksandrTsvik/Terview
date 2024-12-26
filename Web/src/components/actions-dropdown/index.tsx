import { EllipsisOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, GetProps, MenuProps } from 'antd';
import { MouseEventHandler } from 'react';

type DropdownProps = GetProps<typeof Dropdown>;

interface Props extends DropdownProps {
  items: MenuProps['items'];
  vertical?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ActionsDropdown({ items, vertical = true, onClick, ...props }: Props) {
  return (
    <Dropdown menu={{ items }} {...props}>
      <Button type="text" icon={vertical ? <MoreOutlined /> : <EllipsisOutlined />} onClick={onClick} />
    </Dropdown>
  );
}
