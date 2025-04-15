import cronstrue from 'cronstrue';

export function getCronDescription(cronExpression: string) {
  try {
    return cronstrue.toString(cronExpression, { use24HourTimeFormat: true });
  } catch {
    return '';
  }
}
