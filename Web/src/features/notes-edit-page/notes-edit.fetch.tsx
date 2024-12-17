import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import { useGetEditNotesQuery } from './notes-edit.api';
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

  const { data, isFetching } = useGetEditNotesQuery({ query, tags, pageNumber, pageSize });

  if (isFetching) {
    return <NotesEditSkeleton />;
  }

  if (!data?.totalItems) {
    return <NotesEditEmpty />;
  }

  return <NotesEditList data={data} />;
}
