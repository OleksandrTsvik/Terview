import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router';

import useLogin from '@/auth/use-login';

import { LOGIN_RULES } from './login.rules';

import styles from './login.module.scss';

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login, isLoading } = useLogin();

  const [form] = Form.useForm<FormValues>();
  const email = Form.useWatch('email', form);

  return (
    <Form className={styles.form} form={form} onFinish={login}>
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

      <Form.Item className={styles.forgot_password}>
        <Link to="/forgot-password" state={{ email }}>
          Забули пароль?
        </Link>
      </Form.Item>
    </Form>
  );
}
