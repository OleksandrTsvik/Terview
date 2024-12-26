import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface Props {
  loading: boolean;
  onClick: () => void;
}

export default function RefetchButton({ loading, onClick }: Props) {
  return <Button size="small" shape="circle" icon={<ReloadOutlined />} loading={loading} onClick={onClick} />;
}
