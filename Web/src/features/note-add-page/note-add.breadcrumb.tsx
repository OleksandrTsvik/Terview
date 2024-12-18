import { Breadcrumb } from 'antd';
import { Link } from 'react-router';

import styles from './note-add.module.scss';

export default function NoteAddBreadcrumb() {
  return (
    <Breadcrumb
      className={styles.breadcrumb}
      items={[
        {
          title: <Link to="/dashboard/notes">Нотатки</Link>,
        },
        {
          title: 'Додати нотатку',
        },
      ]}
    />
  );
}
