import hljs from 'highlight.js';
import { useEffect } from 'react';

import { classnames } from '@/common/class-names.utils';

interface Props {
  text: string;
  className?: string;
}

export default function TextEditorOutput({ text, className }: Props) {
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

  return (
    <div className={classnames(['ck-content', 'output', className ?? ''])} dangerouslySetInnerHTML={{ __html: text }} />
  );
}
