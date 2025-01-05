import { LockOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';

import { useVerifyEmailMutation } from './email-verification.api';
import { EMAIL_VERIFICATION_RULES } from './email-verification.rules';

import styles from './email-verification.module.scss';

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { notification } = App.useApp();

  const emailVerificationToken = searchParams.get('token');
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleSubmit = async (values: FormValues) => {
    if (!emailVerificationToken) {
      notification.error({ message: 'Відсутній токен для підтвердження пошти' });
      return;
    }

    await verifyEmail({ token: emailVerificationToken, password: values.password })
      .unwrap()
      .then(() => {
        notification.success({ message: 'Пошту підтверджено' });
        navigate('/login');
      })
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  useEffect(() => {
    if (!emailVerificationToken) {
      notification.error({ message: 'Відсутній токен для підтвердження пошти' });
    }
  }, [emailVerificationToken, notification]);

  if (!emailVerificationToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Typography.Title level={1} type="secondary">
        Підтвердження електронної пошти
      </Typography.Title>

      <Typography.Title level={3}>Придумайте пароль і завершіть реєстрацію</Typography.Title>

      <Form className={styles.form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item hasFeedback label="Пароль" name="password" rules={EMAIL_VERIFICATION_RULES.password}>
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Повторіть пароль"
          name="confirmPassword"
          rules={EMAIL_VERIFICATION_RULES.confirmPassword}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Завершити реєстрацію
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
