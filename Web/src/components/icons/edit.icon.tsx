import { blue } from '@ant-design/colors';
import { EditFilled } from '@ant-design/icons';
import { GetProps } from 'antd';

type Props = GetProps<typeof EditFilled>;

export default function EditIcon(props: Props) {
  return <EditFilled style={{ color: blue.primary }} {...props} />;
}
