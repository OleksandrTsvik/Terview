import { CopyOutlined } from '@ant-design/icons';
import { App, Badge, Card, Col, Image, Row } from 'antd';

import { DeleteIcon } from '@/components/icons';

import { useDeleteNoteImageMutation } from './images.api';
import { NoteImageResponse } from './images.models';

import styles from './images.module.scss';

interface Props {
  images: NoteImageResponse[];
}

export default function ImagesList({ images }: Props) {
  const { modal, notification } = App.useApp();

  const [deleteImage] = useDeleteNoteImageMutation();

  const handleCopyClick = (imageUrl: string) => {
    navigator.clipboard
      .writeText(imageUrl)
      .then(() => notification.success({ message: 'Посилання скопійовано' }))
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  const handleDeleteClick = (uniqueImageName: string) => {
    modal.confirm({
      title: 'Ви дійсно бажаєте видалити зображення?',
      content: 'Перед видаленням переконайтеся, що дане зображення ніде не використовується.',
      okButtonProps: { danger: true },
      onOk: () =>
        deleteImage({ uniqueImageName })
          .unwrap()
          .catch(() => notification.error({ message: 'Виникла помилка' })),
    });
  };

  return (
    <Row gutter={[16, 16]}>
      {images.map((image) => (
        <Col key={image.id} lg={8} md={12} sm={12} xs={24}>
          <Badge.Ribbon text={image.noteCount} color={image.noteCount > 0 ? 'red' : 'green'}>
            <Card
              className={styles.card}
              cover={<Image src={image.url} />}
              actions={[
                <CopyOutlined key="copy" onClick={() => handleCopyClick(image.url)} />,
                <DeleteIcon key="delete" onClick={() => handleDeleteClick(image.uniqueName)} />,
              ]}
            />
          </Badge.Ribbon>
        </Col>
      ))}
    </Row>
  );
}
