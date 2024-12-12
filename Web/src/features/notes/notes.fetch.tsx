import { useSearchParams } from 'react-router';

import { useGetNotesQuery } from './notes.api';
import NotesEmpty from './notes.empty';
import NotesList from './notes.list';
import NotesSkeleton from './notes.skeleton';
import { stringToNumber } from '../../common/type-converters.utils';

export default function NotesFetch() {
  const [searchParams] = useSearchParams();

  const pageNumber = stringToNumber(searchParams.get('page'), 1);
  const pageSize = stringToNumber(searchParams.get('size'), 10);
  const tags = searchParams.getAll('tags');

  const { data, isFetching } = useGetNotesQuery({ pageNumber, pageSize, tags });

  if (isFetching) {
    return <NotesSkeleton />;
  }

  if (!data?.totalItems) {
    return <NotesEmpty />;
  }

  return <NotesList data={data} />;
}
