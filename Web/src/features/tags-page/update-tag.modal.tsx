import { App, Form, Input, Modal, Typography } from 'antd';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { useUpdateNotesTagMutation } from './tags.api';
import { clearSelectedUpdateTag, selectTagsState } from './tags.slice';

interface FormValues {
  tag: string;
}

export default function UpdateTagModal() {
  const { notification } = App.useApp();

  const appDispatch = useAppDispatch();
  const { selectedUpdateTag } = useAppSelector(selectTagsState);

  const [updateTag, { isLoading }] = useUpdateNotesTagMutation();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    form.setFieldValue('tag', selectedUpdateTag);
  }, [form, selectedUpdateTag]);

  const handleClose = () => {
    appDispatch(clearSelectedUpdateTag());
  };

  const handleSubmit = async (values: FormValues) => {
    if (!selectedUpdateTag) {
      notification.error({ message: 'Виникла помилка' });
      return;
    }

    await updateTag({ currentTag: selectedUpdateTag, newTag: values.tag })
      .unwrap()
      .then(() => handleClose())
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  return (
    <Modal
      forceRender
      title="Змінити тег"
      okText="Зберегти зміни"
      open={!!selectedUpdateTag}
      confirmLoading={isLoading}
      onOk={form.submit}
      onCancel={handleClose}
    >
      <Typography.Paragraph strong>{selectedUpdateTag}</Typography.Paragraph>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item hasFeedback name="tag">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
