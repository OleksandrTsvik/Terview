import { Spin } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import { useGetNotesEditQuery } from './notes-edit.api';
import { QUERY_PARAMS } from './notes-edit.constants';
import NotesEditEmpty from './notes-edit.empty';
import NotesEditList from './notes-edit.list';
import NotesEditSkeleton from './notes-edit.skeleton';

export default function NotesEditFetch() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(QUERY_PARAMS.QUERY) ?? '';
  const tags = searchParams.getAll(QUERY_PARAMS.TAGS);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 10);

  const { data, isLoading, isFetching } = useGetNotesEditQuery({ query, tags, pageNumber, pageSize });

  if (isLoading) {
    return <NotesEditSkeleton />;
  }

  if (!data?.totalItems) {
    return <NotesEditEmpty />;
  }

  return (
    <Spin spinning={isFetching}>
      <NotesEditList data={data} />
    </Spin>
  );
}
