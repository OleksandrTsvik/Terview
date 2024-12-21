import { orange } from '@ant-design/colors';
import { FileTextOutlined } from '@ant-design/icons';
import { Card, Col, Flex, Row, Typography } from 'antd';

import { useGetMongoDbDashboardQuery } from './mongodb.api';
import MongoDbSkeleton from './mongodb.skeleton';

import styles from './mongodb.module.scss';

export default function DashboardMongoDb() {
  const { data, isFetching } = useGetMongoDbDashboardQuery();

  if (isFetching) {
    return <MongoDbSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <Typography.Title className={styles.title} level={2}>
        MongoDB: {data.database}
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {data.collections.map((collection) => (
          <Col key={collection.name} lg={8} md={12} sm={12} xs={24}>
            <Card>
              <div className={styles.card__collection_name}>{collection.name}</div>
              <Flex justify="space-between" wrap>
                <span>
                  {collection.totalDocuments} <FileTextOutlined style={{ color: orange[3] }} />
                </span>
                <span>{collection.storageSizeInMegabytes} MB</span>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
