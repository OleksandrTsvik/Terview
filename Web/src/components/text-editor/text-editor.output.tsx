interface Props {
  text: string;
}

export default function TextEditorOutput({ text }: Props) {
  return <div className="ck-content" dangerouslySetInnerHTML={{ __html: text }} />;
}
