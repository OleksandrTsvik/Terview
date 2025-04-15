import { HomeOutlined } from '@ant-design/icons';
import { Flex, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router';

import { TextEditorOutput } from '@/components/text-editor';
import useTitle from '@/hooks/use-title';

import { useGetNoteBySlugQuery } from './note.api';
import NoteNotFound from './note.not-found';
import NoteSkeleton from './note.skeleton';

import styles from './note.module.scss';

export default function NotePage() {
  const { noteSlug } = useParams();

  const { data, isFetching } = useGetNoteBySlugQuery({ noteSlug });

  useTitle(data?.title);

  if (isFetching) {
    return <NoteSkeleton />;
  }

  if (!data) {
    return <NoteNotFound />;
  }

  return (
    <>
      <Typography.Title className={styles.title}>{data.title}</Typography.Title>
      <Typography.Paragraph type="secondary">
        {data.updatedOnUtc
          ? dayjs(data.updatedOnUtc).format('DD.MM.YYYY')
          : dayjs(data.createdOnUtc).format('DD.MM.YYYY')}
      </Typography.Paragraph>
      <Flex className={styles.tags} wrap>
        <Link to="/">
          <Tag icon={<HomeOutlined />} />
        </Link>
        {data.tags.map((tag) => (
          <Link key={tag} to={`/?t=${tag}`}>
            <Tag>{tag}</Tag>
          </Link>
        ))}
      </Flex>
      <TextEditorOutput className={styles.content} text={data.content} />
    </>
  );
}
