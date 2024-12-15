import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout } from 'antd';
import { Link } from 'react-router';

import styles from './footer.module.scss';

import logo from '@/assets/logo.svg';

export default function Footer() {
  const email = 'oleksandr.zwick@gmail.com';

  return (
    <Layout.Footer className={styles.footer}>
      <Flex align="center" gap="large" wrap="wrap">
        <Link to="/">
          <Avatar src={logo} size={30} />
        </Link>
        <Link to="/dashboard">Dashboard</Link>
      </Flex>
      <span className={styles.copyright}>
        © 2024. Copyright: <Link to={`mailto:${email}`}>{email}</Link>
      </span>
      <Flex className={styles.socialLinks} component="nav" gap="large" wrap="wrap">
        <Link to="https://linkedin.com/in/oleksandr-tsvik" target="_blank">
          <LinkedinOutlined />
        </Link>
        <Link to="https://github.com/OleksandrTsvik" target="_blank">
          <GithubOutlined />
        </Link>
        <Link to={`mailto:${email}`}>
          <MailOutlined />
        </Link>
      </Flex>
    </Layout.Footer>
  );
}
