import { Flex, Spin } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';

import NotesEditUser from './filters/notes-edit.user';
import { useGetNotesEditQuery } from './notes-edit.api';
import { DEFAULT_SORT, QUERY_PARAMS } from './notes-edit.constants';
import NotesEditEmpty from './notes-edit.empty';
import NotesEditList from './notes-edit.list';
import NotesEditSkeleton from './notes-edit.skeleton';

import styles from './notes-edit.module.scss';

export default function NotesEditFetch() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(QUERY_PARAMS.QUERY);
  const tags = searchParams.getAll(QUERY_PARAMS.TAGS);
  const createdBy = searchParams.get(QUERY_PARAMS.CREATED_BY);
  const sort = searchParams.get(QUERY_PARAMS.SORT) ?? DEFAULT_SORT;
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 10);

  const { data, isLoading, isFetching } = useGetNotesEditQuery({ query, tags, createdBy, sort, pageNumber, pageSize });

  if (isLoading) {
    return <NotesEditSkeleton />;
  }

  if (!data || !data.items.length) {
    return (
      <section className={styles.notes}>
        <Flex className={styles.notes__total} align="center" justify="flex-end">
          <NotesEditUser />
        </Flex>
        <NotesEditEmpty />
      </section>
    );
  }

  return (
    <Spin spinning={isFetching}>
      <NotesEditList data={data} />
    </Spin>
  );
}
