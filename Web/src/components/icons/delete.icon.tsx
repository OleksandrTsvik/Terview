import { red } from '@ant-design/colors';
import { DeleteFilled } from '@ant-design/icons';
import { GetProps } from 'antd';

type Props = GetProps<typeof DeleteFilled>;

export default function DeleteIcon(props: Props) {
  return <DeleteFilled style={{ color: red.primary }} {...props} />;
}
