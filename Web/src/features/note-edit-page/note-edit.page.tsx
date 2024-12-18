import { App, Spin } from 'antd';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router';

import { useGetNoteEditByIdQuery } from './note-edit.api';
import NoteEditBreadcrumb from './note-edit.breadcrumb';
import NoteEditForm from './note-edit.form';

export default function NoteEditPage() {
  const { noteId } = useParams();
  const { notification } = App.useApp();

  const { data, isFetching } = useGetNoteEditByIdQuery({ noteId });

  useEffect(() => {
    if (!isFetching && !data) {
      notification.error({ message: 'Нотатку не знайдено' });
    }
  }, [data, isFetching, notification]);

  if (!isFetching && !data) {
    return <Navigate to="/dashboard/notes" replace />;
  }

  return (
    <Spin spinning={isFetching}>
      <NoteEditBreadcrumb />
      <NoteEditForm note={data} />
    </Spin>
  );
}
