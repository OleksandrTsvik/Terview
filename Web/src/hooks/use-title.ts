import { useEffect } from 'react';

export default function useTitle(title?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title || prevTitle;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
