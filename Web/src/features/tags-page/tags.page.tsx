import { Empty, Skeleton, Spin, Typography } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';
import RefetchButton from '@/components/refetch-button';

import { useGetNotesTagsEditQuery } from './tags.api';
import { QUERY_PARAMS } from './tags.constants';
import TagsList from './tags.list';
import TagsPagination from './tags.pagination';
import TagsSearch from './tags.search';
import UpdateTagModal from './update-tag.modal';

import styles from './tags.module.scss';

export default function TagsPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(QUERY_PARAMS.QUERY);
  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 30);

  const { data, isLoading, isFetching, refetch } = useGetNotesTagsEditQuery({ query, pageNumber, pageSize });

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Теги відсутні" />;
  }

  return (
    <>
      <Spin spinning={isFetching}>
        <TagsSearch />
        <Typography.Paragraph className={styles.total} type="secondary">
          <span>Усього тегів: {data.totalItems}</span>
          <RefetchButton onClick={refetch} />
        </Typography.Paragraph>
        {data.items.length ? (
          <>
            <TagsList tags={data.items} />
            <TagsPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Теги відсутні" />
        )}
      </Spin>
      <UpdateTagModal />
    </>
  );
}
