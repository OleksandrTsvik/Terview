import hljs from 'highlight.js';
import { useEffect } from 'react';

interface Props {
  text: string;
}

export default function TextEditorOutput({ text }: Props) {
  const highlightCode = () => {
    const nodes = document.querySelectorAll('pre code');

    nodes.forEach((node) => {
      if (node.hasAttribute('data-highlighted')) {
        return;
      }

      hljs.highlightElement(node as HTMLElement);
    });
  };

  useEffect(() => {
    highlightCode();
  });

  return <div className="ck-content output" dangerouslySetInnerHTML={{ __html: text }} />;
}
