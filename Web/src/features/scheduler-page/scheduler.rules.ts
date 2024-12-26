import { Rule } from 'antd/es/form';

interface Rules {
  days: Rule[];
  hours: Rule[];
  minutes: Rule[];
  seconds: Rule[];
}

export const SCHEDULER_RULES: Rules = {
  days: [
    {
      required: true,
    },
    {
      type: 'integer',
      min: 0,
    },
  ],
  hours: [
    {
      required: true,
    },
    {
      type: 'integer',
      min: 0,
      max: 23,
    },
  ],
  minutes: [
    {
      required: true,
    },
    {
      type: 'integer',
      min: 0,
      max: 59,
    },
  ],
  seconds: [
    {
      required: true,
    },
    {
      type: 'integer',
      min: 0,
      max: 59,
    },
  ],
};
