import { Card, Col, Row, Skeleton } from 'antd';

import styles from './mongodb.module.scss';

export default function MongoDbSkeleton() {
  return (
    <>
      <Skeleton.Input rootClassName={styles.title} active />
      <Row gutter={[16, 16]}>
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <Col key={index} lg={8} md={12} sm={12} xs={24}>
              <Card loading>Card content</Card>
            </Col>
          ))}
      </Row>
    </>
  );
}
