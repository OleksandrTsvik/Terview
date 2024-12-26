import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { classnames } from '@/common/class-names.utils';

import styles from './table-container.module.scss';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function TableContainer({ className, children, ...props }: Props) {
  return (
    <div className={classnames([styles.table_responsive, className ?? ''])} {...props}>
      {children}
    </div>
  );
}
