import { Breadcrumb } from 'antd';
import { Link } from 'react-router';

import styles from './note-edit.module.scss';

export default function NoteEditBreadcrumb() {
  return (
    <Breadcrumb
      className={styles.breadcrumb}
      items={[
        {
          title: <Link to="/dashboard/notes">Нотатки</Link>,
        },
        {
          title: 'Редагувати нотатку',
        },
      ]}
    />
  );
}
