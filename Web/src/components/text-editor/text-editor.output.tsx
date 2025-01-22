import hljs from 'highlight.js';
import { useEffect } from 'react';

interface Props {
  text: string;
}

export default function TextEditorOutput({ text }: Props) {
  const highlightCode = () => {
    const nodes = document.querySelectorAll('pre code');

    nodes.forEach((node) => hljs.highlightElement(node as HTMLElement));
  };

  useEffect(() => {
    highlightCode();
  });

  return <div className="ck-content output" dangerouslySetInnerHTML={{ __html: text }} />;
}
