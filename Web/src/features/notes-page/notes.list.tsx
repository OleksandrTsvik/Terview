import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PagedList } from '@/common/pagination.models';
import { stringToBoolean } from '@/common/type-converters.utils';

import { QUERY_PARAMS } from './notes.constants';
import NotesItemContent from './notes.item-content';
import NotesItemLabel from './notes.item-label';
import { NoteResponse } from './notes.models';
import NotesPagination from './notes.pagination';
import NotesSort from './notes.sort';

import styles from './notes.module.scss';

function initStateExpandAll() {
  return stringToBoolean(localStorage.getItem('notes-expand-all'));
}

interface Props {
  data: PagedList<NoteResponse>;
}

export default function NotesList({ data }: Props) {
  const [searchParams] = useSearchParams();
  const selectedTags = searchParams.getAll(QUERY_PARAMS.TAGS);

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

  return (
    <section className={styles.notes}>
      <Flex className={styles.notes__total} align="center" justify="space-between" gap="small" wrap>
        <Typography.Text type="secondary" onClick={handleExpandAllToggle}>
          <CaretRightOutlined rotate={expandAll ? 90 : 0} /> {expandAll ? 'Згорнути все' : 'Розгорнути все'}
        </Typography.Text>
        <NotesSort />
      </Flex>
      <Collapse
        className={styles.notes__list}
        bordered={false}
        activeKey={activeKeys}
        items={data.items.map((note) => ({
          key: note.id,
          className: styles.list__item,
          label: <NotesItemLabel note={note} selectedTags={selectedTags} />,
          children: <NotesItemContent note={note} />,
        }))}
        onChange={handleCollapseNote}
      />
      <NotesPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
    </section>
  );
}
