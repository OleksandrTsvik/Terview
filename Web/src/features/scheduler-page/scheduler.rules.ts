import { Rule } from 'antd/es/form';

import { getCronDescription } from './scheduler.utils';

interface Rules {
  cronExpression: Rule[];
}

export const SCHEDULER_RULES: Rules = {
  cronExpression: [
    {
      required: true,
    },
    {
      validator: (_, value) =>
        getCronDescription(value) ? Promise.resolve() : Promise.reject(new Error('Невірний формат cron expression')),
    },
  ],
};
