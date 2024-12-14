import { Button, Result } from 'antd';
import { Link } from 'react-router';

export default function DashboardNotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Сторінку не знайдено"
      extra={
        <Link to="/dashboard">
          <Button type="default">На головну</Button>
        </Link>
      }
    />
  );
}
