import styles from './logo.module.scss';

import logo from '@/assets/logo.svg';

interface Props {
  size?: number;
}

export default function Logo({ size = 30 }: Props) {
  return (
    <span className={styles.logo} style={{ width: size, height: size }}>
      <img src={logo} alt="logo" />
    </span>
  );
}
