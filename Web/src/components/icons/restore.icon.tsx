import { yellow } from '@ant-design/colors';
import { RollbackOutlined } from '@ant-design/icons';
import { GetProps } from 'antd';

type Props = GetProps<typeof RollbackOutlined>;

export default function RestoreIcon(props: Props) {
  return <RollbackOutlined style={{ color: yellow.primary }} {...props} />;
}
