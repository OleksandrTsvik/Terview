import { Typography } from 'antd';
import { Link } from 'react-router';

import LoginForm from './login.form';

import styles from './login.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <Link to="/">
        <Typography.Title className={styles.title}>Terview</Typography.Title>
      </Link>
      <LoginForm />
    </div>
  );
}
