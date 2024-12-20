import { Rule } from 'antd/es/form';

import { NOTE_RULES } from '@/common/rules.constants';
import { trimWhitespace } from '@/common/rules.validation';

interface Rules {
  title: Rule[];
  content: Rule[];
  tags: Rule[];
}

export const NOTE_ADD_RULES: Rules = {
  title: [
    {
      required: true,
    },
    {
      min: NOTE_RULES.title.min,
      max: NOTE_RULES.title.max,
    },
    trimWhitespace,
  ],
  content: [
    {
      required: true,
    },
  ],
  tags: [
    {
      type: 'array',
      defaultField: {
        type: 'string',
        ...trimWhitespace,
      },
    },
  ],
};
