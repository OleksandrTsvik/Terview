import { App, Form, Input, Modal } from 'antd';

import { useCreateUserMutation } from './users.api';
import { USERS_RULES } from './users.rules';

interface FormValues {
  email: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ open, onClose }: Props) {
  const { notification } = App.useApp();

  const [form] = Form.useForm();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (values: FormValues) => {
    await createUser(values)
      .unwrap()
      .then(() => onClose())
      .catch(() =>
        notification.error({
          message: 'Виникла помилка',
          description: 'Переконайтеся, що введений email не використовується.',
        }),
      );
  };

  return (
    <Modal
      title="Зареєструвати користувача"
      okText="Зареєструвати"
      open={open}
      confirmLoading={isLoading}
      onOk={form.submit}
      onCancel={onClose}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item hasFeedback name="email" label="Email" rules={USERS_RULES.email}>
          <Input placeholder="email" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
