import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Flex, Pagination, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PagedList } from '@/common/pagination.models';
import { stringToBoolean } from '@/common/type-converters.utils';

import { QUERY_PARAMS } from './notes-edit.constants';
import NotesEditItemContent from './notes-edit.item-content';
import NotesEditItemExtra from './notes-edit.item-extra';
import NotesEditItemLabel from './notes-edit.item-label';
import { NoteResponse } from './notes-edit.models';

import styles from './notes-edit.module.scss';

function initStateExpandAll() {
  return stringToBoolean(localStorage.getItem('dashboard-notes-expand-all'));
}

interface Props {
  data: PagedList<NoteResponse>;
}

export default function NotesEditList({ data }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.getAll(QUERY_PARAMS.TAGS);

  const [expandAll, setExpandAll] = useState(initStateExpandAll);
  const [activeKeys, setActiveKeys] = useState(expandAll ? data.items.map(({ id }) => id) : []);

  useEffect(() => {
    const expandAll = stringToBoolean(localStorage.getItem('dashboard-notes-expand-all'));

    setExpandAll(expandAll);
    setActiveKeys(expandAll ? data.items.map(({ id }) => id) : []);
  }, [data.items]);

  const handleExpandAllToggle = () => {
    setActiveKeys(expandAll ? [] : data.items.map(({ id }) => id));

    localStorage.setItem('dashboard-notes-expand-all', (!expandAll).toString());
    setExpandAll((prevState) => !prevState);
  };

  const handleCollapseNote = (keys: string[]) => {
    setExpandAll(!!keys.length);
    setActiveKeys(keys);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setSearchParams((prev) => {
      prev.set(QUERY_PARAMS.PAGE_NUMBER, page.toString());
      prev.set(QUERY_PARAMS.PAGE_SIZE, pageSize.toString());

      return prev;
    });
  };

  return (
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
          className: styles.list__item,
          label: <NotesEditItemLabel note={note} selectedTags={selectedTags} />,
          children: <NotesEditItemContent note={note} />,
          extra: <NotesEditItemExtra note={note} />,
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
  );
}
