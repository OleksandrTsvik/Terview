import { App, Button, Form, Input, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router';

import { useForgotPasswordMutation } from './forgot-password.api';
import { FORGOT_PASSWORD_RULES } from './forgot-password.rules';

import styles from './forgot-password.module.scss';

interface FormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { notification } = App.useApp();

  const email = location.state?.email;
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values: FormValues) => {
    await forgotPassword({ email: values.email })
      .unwrap()
      .then(() => {
        notification.success({ message: 'Перевірте вхідні повідомлення' });
        navigate('/', { replace: true });
      })
      .catch(() => notification.error({ message: 'Виникла помилка, повторіть спробу пізніше' }));
  };

  return (
    <>
      <Typography.Title level={1}>Скидання пароля</Typography.Title>

      <Typography.Title level={3}>Введіть адресу електронної пошти, щоб отримати лист</Typography.Title>

      <Form className={styles.form} layout="vertical" initialValues={{ email }} onFinish={handleSubmit}>
        <Form.Item hasFeedback label="Електронна пошта" name="email" rules={FORGOT_PASSWORD_RULES.email}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Надіслати посилання
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
