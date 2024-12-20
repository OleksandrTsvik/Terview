import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

import useLogin from '@/auth/use-login';

import { LOGIN_RULES } from './login.rules';

import styles from './login.module.scss';

export default function LoginForm() {
  const { login, isLoading } = useLogin();

  return (
    <Form className={styles.form} onFinish={login}>
      <Form.Item hasFeedback name="email" rules={LOGIN_RULES.email}>
        <Input prefix={<MailOutlined />} placeholder="Електронна пошта" />
      </Form.Item>

      <Form.Item hasFeedback name="password" rules={LOGIN_RULES.password}>
        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
      </Form.Item>

      <Form.Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>
          Увійти
        </Button>
      </Form.Item>
    </Form>
  );
}
