export function classnames(classNames: string | string[] | { [key: string]: boolean }): string {
  if (typeof classNames === 'string') {
    return classNames;
  } else if (Array.isArray(classNames)) {
    return classNames.join(' ');
  }

  return Object.entries(classNames)
    .filter(([, condition]) => condition)
    .map(([className]) => className)
    .join(' ');
}
