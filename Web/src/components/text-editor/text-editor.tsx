import { EditorConfig } from 'ckeditor5';

import Ckeditor from '../ckeditor';

interface Props {
  value?: string;
  imageUploadUrl?: string;
  onChange?: (text: string) => void;
}

export default function TextEditor({ value, imageUploadUrl, onChange, ...props }: Props) {
  const config: EditorConfig = {};

  if (imageUploadUrl) {
    config.simpleUpload = {
      uploadUrl: imageUploadUrl,
      withCredentials: false,
    };
  }

  return (
    <Ckeditor
      {...props}
      config={config}
      data={value}
      onChange={(_, editor) => onChange && onChange(editor.getData())}
    />
  );
}
