import { App, Form, Modal, Select } from 'antd';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { useGetPermissionsQuery, useUpdateUserPermissionsMutation } from './users.api';
import { clearSelectedUpdateUserPermissions, selectUsersState } from './users.slice';

interface FormValues {
  permissions: string[];
}

export default function UpdatePermissionsModal() {
  const { notification } = App.useApp();

  const appDispatch = useAppDispatch();
  const { selectedUpdateUserPermissions } = useAppSelector(selectUsersState);

  const { data: allPermissions, isFetching } = useGetPermissionsQuery();
  const [updateUserPermissions, { isLoading }] = useUpdateUserPermissionsMutation();

  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    form.setFieldValue('permissions', selectedUpdateUserPermissions?.permissions ?? []);
  }, [form, selectedUpdateUserPermissions?.permissions]);

  const handleClose = () => {
    appDispatch(clearSelectedUpdateUserPermissions());
  };

  const handleSubmit = async (values: FormValues) => {
    if (!selectedUpdateUserPermissions) {
      notification.error({ message: 'Виникла помилка' });
      return;
    }

    await updateUserPermissions({ userId: selectedUpdateUserPermissions.id, permissions: values.permissions })
      .unwrap()
      .then(() => handleClose())
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  return (
    <Modal
      forceRender
      title={`Змінити дозволи для ${selectedUpdateUserPermissions?.email}`}
      okText="Зберегти зміни"
      open={!!selectedUpdateUserPermissions}
      confirmLoading={isLoading}
      onOk={form.submit}
      onCancel={handleClose}
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item hasFeedback name="permissions" label="Дозволи">
          <Select
            mode="multiple"
            loading={isFetching}
            options={allPermissions?.map((permission) => ({ label: permission, value: permission }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
