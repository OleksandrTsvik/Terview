import { classnames } from '@/common/class-names.utils';

interface Props {
  text: string;
}

export default function TextEditorOutput({ text }: Props) {
  return <div className={classnames(['ck-content', 'output'])} dangerouslySetInnerHTML={{ __html: text }} />;
}
