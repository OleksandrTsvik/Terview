import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Flex, Pagination, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { NoteResponse } from './notes.models';
import { PagedList } from '../../common/pagination.models';
import { stringToBoolean } from '../../common/type-converters.utils';

import styles from './notes.module.scss';

function initStateExpandAll() {
  return stringToBoolean(localStorage.getItem('notes-expand-all'));
}

interface Props {
  data: PagedList<NoteResponse>;
}

export default function NotesList({ data }: Props) {
  const [, setSearchParams] = useSearchParams();

  const [expandAll, setExpandAll] = useState(initStateExpandAll);
  const [activeKeys, setActiveKeys] = useState(expandAll ? data.items.map(({ id }) => id) : []);

  useEffect(() => {
    const expandAll = stringToBoolean(localStorage.getItem('notes-expand-all'));

    setExpandAll(expandAll);
    setActiveKeys(expandAll ? data.items.map(({ id }) => id) : []);
  }, [data.items]);

  const handleExpandAllToggle = () => {
    setActiveKeys(expandAll ? [] : data.items.map(({ id }) => id));

    localStorage.setItem('notes-expand-all', (!expandAll).toString());
    setExpandAll((prevState) => !prevState);
  };

  const handleCollapseNote = (keys: string[]) => {
    setExpandAll(!!keys.length);
    setActiveKeys(keys);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setSearchParams((prevState) => {
      prevState.set('page', page.toString());
      prevState.set('size', pageSize.toString());

      return prevState;
    });
  };

  return (
    <>
      <section className={styles.notes}>
        <Flex className={styles.notes__total} justify="space-between" wrap>
          <Typography.Text type="secondary" onClick={handleExpandAllToggle}>
            <CaretRightOutlined rotate={expandAll ? 90 : 0} /> {expandAll ? 'Згорнути все' : 'Розгорнути все'}
          </Typography.Text>
          <Typography.Text type="secondary">Усього записів: {data.totalItems}</Typography.Text>
        </Flex>
        <Collapse
          className={styles.notes__list}
          bordered={false}
          activeKey={activeKeys}
          items={data.items.map((note) => ({
            key: note.id,
            label: note.title,
            children: <p style={{ margin: 0 }}>{note.content}</p>,
            className: styles.list__item,
          }))}
          onChange={handleCollapseNote}
        />
        <Pagination
          className={styles.notes__pagination}
          showSizeChanger
          responsive
          current={data.currentPage}
          total={data.totalItems}
          pageSize={data.pageSize}
          pageSizeOptions={[5, 10, 15, 20, 30]}
          onChange={handlePaginationChange}
        />
      </section>
    </>
  );
}
