import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';

import { ckeditorConfig } from './ckeditor.config';

type Props = Omit<CKEditor<ClassicEditor>['props'], 'editor'>;

export default function Ckeditor({ config, ...props }: Props) {
  return <CKEditor {...props} editor={ClassicEditor} config={{ ...ckeditorConfig, ...config }} />;
}
