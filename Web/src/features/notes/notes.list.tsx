import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Flex, Pagination, Result, Typography } from 'antd';
import { useState } from 'react';

import { Note } from './notes.model';

import styles from './notes.module.scss';

export default function NotesList() {
  const notes: Note[] = [
    {
      id: 'n1',
      title: 'Title 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 'n2',
      title: 'Title 2',
      content: 'Nam non diam rhoncus, fermentum sapien quis, luctus quam.',
    },
    {
      id: 'n3',
      title: 'Title 3',
      content: 'Praesent eget turpis sagittis, convallis urna sit amet, ornare dolor.',
    },
  ];

  const [expandAll, setExpandAll] = useState(localStorage.getItem('notes-expand-all') === 'true');
  const [activeKeys, setActiveKeys] = useState(expandAll ? notes.map(({ id }) => id) : []);

  const handleExpandAll = () => {
    setActiveKeys(expandAll ? [] : notes.map(({ id }) => id));

    localStorage.setItem('notes-expand-all', (!expandAll).toString());
    setExpandAll((prevState) => !prevState);
  };

  const handleCollapseNote = (keys: string[]) => {
    setExpandAll(!!keys.length);
    setActiveKeys(keys);
  };

  return (
    <>
      {notes.length ? (
        <section className={styles.notes}>
          <Flex className={styles.notes__total} justify="space-between" wrap>
            <Typography.Text type="secondary" onClick={handleExpandAll}>
              <CaretRightOutlined rotate={expandAll ? 90 : 0} /> {expandAll ? 'Згорнути все' : 'Розгорнути все'}
            </Typography.Text>
            <Typography.Text type="secondary">Усього записів: {notes.length}</Typography.Text>
          </Flex>
          <Collapse
            className={styles.notes__list}
            bordered={false}
            activeKey={activeKeys}
            items={notes.map((note) => ({
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
            hideOnSinglePage
            total={500}
            pageSize={10}
            pageSizeOptions={[10, 20, 30]}
          />
        </section>
      ) : (
        <Result title="Не знайдено" subTitle="Не вдалося знайти записи, які б відповідали критеріям пошуку" />
      )}
    </>
  );
}
