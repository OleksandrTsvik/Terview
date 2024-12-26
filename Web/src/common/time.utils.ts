const UNIT_TYPE_LONG_PLURAL = ['days', 'hours', 'minutes', 'seconds'] as const;
type UnitTypeLongPlural = (typeof UNIT_TYPE_LONG_PLURAL)[number];

const SECONDS_IN_UNIT = {
  DAY: 86_400,
  HOUR: 3600,
  MINUTE: 60,
};

const UNIT_TO_SECONDS_MULTIPLIER: { [unit in UnitTypeLongPlural]: number } = {
  days: SECONDS_IN_UNIT.DAY,
  hours: SECONDS_IN_UNIT.HOUR,
  minutes: SECONDS_IN_UNIT.MINUTE,
  seconds: 1,
};

const TIME_UNIT_DURATIONS = [
  { secondsInUnit: SECONDS_IN_UNIT.DAY, unit: 'd' },
  { secondsInUnit: SECONDS_IN_UNIT.HOUR, unit: 'h' },
  { secondsInUnit: SECONDS_IN_UNIT.MINUTE, unit: 'm' },
  { secondsInUnit: 1, unit: 's' },
];

function isUnitTypeLongPlural(value: unknown): value is UnitTypeLongPlural {
  return UNIT_TYPE_LONG_PLURAL.includes(value as UnitTypeLongPlural);
}

export function formatDuration(time: number, unit: UnitTypeLongPlural = 'seconds'): string {
  let timeSeconds = time * UNIT_TO_SECONDS_MULTIPLIER[unit];
  const duration: string[] = [];

  TIME_UNIT_DURATIONS.forEach(({ secondsInUnit, unit }) => {
    if (timeSeconds >= secondsInUnit) {
      duration.push(`${Math.floor(timeSeconds / secondsInUnit)}${unit}`);
      timeSeconds %= secondsInUnit;
    }
  });

  return duration.join(' ');
}

export function convertTimeToUnits(
  time: number,
  unit: UnitTypeLongPlural = 'seconds',
): { [unit in UnitTypeLongPlural]: number } {
  let timeSeconds = time * UNIT_TO_SECONDS_MULTIPLIER[unit];

  const timeUnits: { [unit in UnitTypeLongPlural]: number } = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  for (const [unit, secondsInUnit] of Object.entries(UNIT_TO_SECONDS_MULTIPLIER)) {
    if (isUnitTypeLongPlural(unit) && timeSeconds >= secondsInUnit) {
      timeUnits[unit] = Math.floor(timeSeconds / secondsInUnit);
      timeSeconds %= secondsInUnit;
    }
  }

  return timeUnits;
}

export function convertTimeToSeconds(time: { [unit in UnitTypeLongPlural]?: number }): number {
  let seconds = 0;

  for (const [unit, value] of Object.entries(time)) {
    if (isUnitTypeLongPlural(unit)) {
      seconds += value * UNIT_TO_SECONDS_MULTIPLIER[unit];
    }
  }

  return seconds;
}
