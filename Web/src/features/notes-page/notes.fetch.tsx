import { Spin } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import { useGetNotesQuery } from './notes.api';
import { DEFAULT_SORT, DEFAULT_TAG_SEARCH_MODE, QUERY_PARAMS } from './notes.constants';
import NotesEmpty from './notes.empty';
import NotesList from './notes.list';
import NotesSkeleton from './notes.skeleton';

export default function NotesFetch() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(QUERY_PARAMS.QUERY);
  const tags = searchParams.getAll(QUERY_PARAMS.TAGS);
  const tagSearchMode = searchParams.get(QUERY_PARAMS.TAG_SEARCH_MODE) ?? DEFAULT_TAG_SEARCH_MODE;
  const sort = searchParams.get(QUERY_PARAMS.SORT) ?? DEFAULT_SORT;
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 10);

  const { data, isLoading, isFetching } = useGetNotesQuery({ query, tags, tagSearchMode, sort, pageNumber, pageSize });

  if (isLoading) {
    return <NotesSkeleton />;
  }

  if (!data || !data.items.length) {
    return <NotesEmpty />;
  }

  return (
    <Spin spinning={isFetching}>
      <NotesList data={data} />
    </Spin>
  );
}
