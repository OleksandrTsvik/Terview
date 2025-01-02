import { App, Button, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router';

import { CKEDITOR_UPLOAD_NOTE_IMAGE_URL } from '@/common/app.constants';
import { NOTE_RULES } from '@/common/rules.constants';
import { TextEditor } from '@/components/text-editor';

import { useCreateNoteMutation, useGetNotesTagsQuery } from './note-add.api';
import { NOTE_ADD_RULES } from './note-add.rules';

interface FormValues {
  title: string;
  content: string;
  tags?: string[];
}

export default function NoteAddForm() {
  const navigate = useNavigate();

  const { notification } = App.useApp();

  const { data, isFetching } = useGetNotesTagsQuery();
  const [createNote, { isLoading }] = useCreateNoteMutation();

  const handleSubmit = async (values: FormValues) => {
    await createNote(values)
      .unwrap()
      .then(() => navigate('/dashboard/notes'))
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item hasFeedback name="title" label="Заголовок" rules={NOTE_ADD_RULES.title}>
        <Input showCount maxLength={NOTE_RULES.title.max} />
      </Form.Item>

      <Form.Item hasFeedback name="content" label="Контент" rules={NOTE_ADD_RULES.content}>
        <TextEditor imageUploadUrl={CKEDITOR_UPLOAD_NOTE_IMAGE_URL} />
      </Form.Item>

      <Form.Item hasFeedback name="tags" label="Теги" rules={NOTE_ADD_RULES.tags}>
        <Select
          mode="tags"
          placeholder="Виберіть зі списку або введіть власні теги"
          loading={isFetching}
          options={data?.map((tag) => ({ label: tag, value: tag }))}
        />
      </Form.Item>

      <Form.Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>
          Додати
        </Button>
      </Form.Item>
    </Form>
  );
}
