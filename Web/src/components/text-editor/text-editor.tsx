import { TokenProvider } from '@/auth/token.provider';

import Ckeditor from '../ckeditor';

interface Props {
  value?: string;
  onChange?: (text: string) => void;
}

export default function TextEditor({ value, onChange, ...props }: Props) {
  return (
    <Ckeditor
      {...props}
      config={{
        simpleUpload: {
          uploadUrl: '/images',
          withCredentials: false,
          headers: {
            Authorization: `Bearer ${TokenProvider.getAccessToken()}`,
          },
        },
      }}
      data={value}
      onChange={(_, editor) => onChange && onChange(editor.getData())}
    />
  );
}
