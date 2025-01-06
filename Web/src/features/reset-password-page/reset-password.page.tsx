import { App, Button, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';

import { useResetPasswordMutation } from './reset-password.api';
import { RESET_PASSWORD_RULES } from './reset-password.rules';

import styles from './reset-password.module.scss';

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { notification } = App.useApp();

  const passwordResetToken = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (values: FormValues) => {
    if (!passwordResetToken) {
      notification.error({ message: 'Відсутній токен для скидання пароля' });
      return;
    }

    await resetPassword({ token: passwordResetToken, password: values.password })
      .unwrap()
      .then(() => {
        notification.success({ message: 'Пароль змінено' });
        navigate('/login', { replace: true });
      })
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  useEffect(() => {
    if (!passwordResetToken) {
      notification.error({ message: 'Відсутній токен для скидання пароля' });
    }
  }, [passwordResetToken, notification]);

  if (!passwordResetToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Typography.Title level={1}>Створення нового пароля</Typography.Title>

      <Form className={styles.form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item hasFeedback label="Новий пароль" name="password" rules={RESET_PASSWORD_RULES.password}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Підтвердьте новий пароль"
          name="confirmPassword"
          rules={RESET_PASSWORD_RULES.confirmPassword}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Скинути пароль
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
