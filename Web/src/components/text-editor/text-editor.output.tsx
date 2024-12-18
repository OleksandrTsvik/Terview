interface Props {
  text: string;
}

export default function TextEditorOutput({ text }: Props) {
  return <p style={{ margin: 0 }}>{text}</p>;
}
