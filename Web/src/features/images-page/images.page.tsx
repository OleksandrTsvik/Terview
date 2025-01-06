import { Empty, Skeleton, Spin, Typography } from 'antd';
import { useSearchParams } from 'react-router';

import { stringToNumber } from '@/common/type-converters.utils';
import RefetchButton from '@/components/refetch-button';

import { useGetNotesImagesQuery } from './images.api';
import { QUERY_PARAMS } from './images.constants';
import ImagesList from './images.list';
import ImagesPagination from './images.pagination';

import styles from './images.module.scss';

export default function ImagesPage() {
  const [searchParams] = useSearchParams();

  const pageNumber = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_NUMBER), 1);
  const pageSize = stringToNumber(searchParams.get(QUERY_PARAMS.PAGE_SIZE), 20);

  const { data, isLoading, isFetching, refetch } = useGetNotesImagesQuery(
    { pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!data || !data.items.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Зображення відсутні" />;
  }

  return (
    <>
      <Typography.Paragraph className={styles.total} type="secondary">
        <span>Усього зображень: {data.totalItems}</span>
        <RefetchButton loading={isFetching} onClick={refetch} />
      </Typography.Paragraph>
      <Spin spinning={isFetching}>
        <ImagesList images={data.items} />
        <ImagesPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
      </Spin>
    </>
  );
}
