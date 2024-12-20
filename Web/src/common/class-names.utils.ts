import { isString } from './type-guards.utils';

export function classnames(classNames: string | string[] | { [className: string]: boolean }): string {
  if (isString(classNames)) {
    return classNames;
  } else if (Array.isArray(classNames)) {
    return classNames.join(' ');
  }

  return Object.entries(classNames)
    .filter(([, condition]) => condition)
    .map(([className]) => className)
    .join(' ');
}
