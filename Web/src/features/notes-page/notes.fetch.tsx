import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import { useGetNotesQuery } from './notes.api';
import { QUERY_PARAMS } from './notes.constants';
import NotesEmpty from './notes.empty';
import NotesList from './notes.list';
import NotesSkeleton from './notes.skeleton';

export default function NotesFetch() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(QUERY_PARAMS.QUERY) ?? '';
  const tags = searchParams.getAll(QUERY_PARAMS.TAGS);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 10);

  const { data, isFetching } = useGetNotesQuery({ query, tags, pageNumber, pageSize });

  if (isFetching) {
    return <NotesSkeleton />;
  }

  if (!data?.totalItems) {
    return <NotesEmpty />;
  }

  return <NotesList data={data} />;
}
