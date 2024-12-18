import { Input } from 'antd';

interface Props {
  value?: string;
  onChange?: (text: string) => void;
}

export default function TextEditor({ value, onChange, ...props }: Props) {
  return (
    <Input.TextArea
      {...props}
      autoSize={{ minRows: 3, maxRows: 16 }}
      value={value}
      onChange={(event) => onChange && onChange(event.target.value)}
    />
  );
}
