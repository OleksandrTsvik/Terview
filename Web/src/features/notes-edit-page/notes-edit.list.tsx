import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { classnames } from '@/common/class-names.utils';
import { PagedList } from '@/common/pagination.models';
import { stringToBoolean } from '@/common/type-converters.utils';

import NotesEditFilters from './filters/notes-edit.filters';
import { QUERY_PARAMS } from './notes-edit.constants';
import NotesEditItemContent from './notes-edit.item-content';
import NotesEditItemExtra from './notes-edit.item-extra';
import NotesEditItemLabel from './notes-edit.item-label';
import { NoteResponse } from './notes-edit.models';
import NotesEditPagination from './notes-edit.pagination';

import styles from './notes-edit.module.scss';

function initStateExpandAll() {
  return stringToBoolean(localStorage.getItem('dashboard-notes-expand-all'));
}

interface Props {
  data: PagedList<NoteResponse>;
}

export default function NotesEditList({ data }: Props) {
  const [searchParams] = useSearchParams();
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

  return (
    <section className={styles.notes}>
      <Flex className={styles.notes__total} align="center" justify="space-between" gap="small" wrap>
        <Typography.Text className={styles.total__collapsible} type="secondary" onClick={handleExpandAllToggle}>
          <CaretRightOutlined rotate={expandAll ? 90 : 0} /> {expandAll ? 'Згорнути все' : 'Розгорнути все'}
        </Typography.Text>
        <NotesEditFilters />
      </Flex>
      <Collapse
        className={styles.notes__list}
        bordered={false}
        activeKey={activeKeys}
        items={data.items.map((note) => ({
          key: note.id,
          className: classnames({ [styles.list__item]: true, [styles.list__item_deleted]: note.isDeleted }),
          label: <NotesEditItemLabel note={note} selectedTags={selectedTags} />,
          children: <NotesEditItemContent note={note} />,
          extra: <NotesEditItemExtra note={note} />,
        }))}
        onChange={handleCollapseNote}
      />
      <NotesEditPagination current={data.currentPage} total={data.totalItems} pageSize={data.pageSize} />
    </section>
  );
}
