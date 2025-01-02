import { App, Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { CKEDITOR_UPLOAD_NOTE_IMAGE_URL } from '@/common/app.constants';
import { NOTE_RULES } from '@/common/rules.constants';
import { TextEditor } from '@/components/text-editor';

import { useGetNotesTagsQuery, useUpdateNoteMutation } from './note-edit.api';
import { NoteResponse } from './note-edit.models';
import { NOTE_EDIT_RULES } from './note-edit.rules';

interface FormValues {
  title: string;
  content: string;
  tags?: string[];
}

interface Props {
  note?: NoteResponse;
}

export default function NoteEditForm({ note }: Props) {
  const navigate = useNavigate();

  const { notification } = App.useApp();
  const [form] = Form.useForm<FormValues>();

  const { data, isFetching } = useGetNotesTagsQuery();
  const [updateNote, { isLoading }] = useUpdateNoteMutation();

  useEffect(() => {
    form.setFieldsValue({
      title: note?.title,
      content: note?.content,
      tags: note?.tags,
    });
  }, [form, note?.content, note?.tags, note?.title]);

  const handleSubmit = async (values: FormValues) => {
    await updateNote({ noteId: note?.id, ...values })
      .unwrap()
      .then(() => navigate('/dashboard/notes'))
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item hasFeedback name="title" label="Заголовок" rules={NOTE_EDIT_RULES.title}>
        <Input showCount maxLength={NOTE_RULES.title.max} />
      </Form.Item>

      <Form.Item hasFeedback name="content" label="Контент" rules={NOTE_EDIT_RULES.content}>
        <TextEditor imageUploadUrl={CKEDITOR_UPLOAD_NOTE_IMAGE_URL} />
      </Form.Item>

      <Form.Item hasFeedback name="tags" label="Теги" rules={NOTE_EDIT_RULES.tags}>
        <Select
          mode="tags"
          placeholder="Виберіть зі списку або введіть власні теги"
          loading={isFetching}
          options={data?.map((tag) => ({ label: tag, value: tag }))}
        />
      </Form.Item>

      <Form.Item>
        <Button block htmlType="submit" type="primary" loading={isLoading}>
          Зберегти зміни
        </Button>
      </Form.Item>
    </Form>
  );
}
