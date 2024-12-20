import { Breakpoint, Grid } from 'antd';

export type BreakpointValues<T> = { [key in Breakpoint]?: T };

/**
 * Breakpoints:
 * xs: 480px,
 * sm: 576px,
 * md: 768px,
 * lg: 992px,
 * xl: 1200px,
 * xxl: 1600px.
 */
export default function useBreakpointValue<T>(
  values: BreakpointValues<T>,
): T | undefined {
  const breakpoints = Grid.useBreakpoint();

  if (breakpoints.xxl && values.xxl) {
    return values.xxl;
  } else if (breakpoints.xl && values.xl) {
    return values.xl;
  } else if (breakpoints.lg && values.lg) {
    return values.lg;
  } else if (breakpoints.md && values.md) {
    return values.md;
  } else if (breakpoints.sm && values.sm) {
    return values.sm;
  }

  return values.xs;
}
