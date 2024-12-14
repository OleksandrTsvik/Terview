import { Empty } from 'antd';

export default function NotesEmpty() {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Не вдалося знайти записи, які б відповідали критеріям пошуку"
    />
  );
}
