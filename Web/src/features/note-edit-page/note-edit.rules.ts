import { Rule } from 'antd/es/form';

import { NOTE_RULES } from '@/common/rules.constants';
import { isValidSlug, trimWhitespace } from '@/common/rules.validation';

interface Rules {
  slug: Rule[];
  title: Rule[];
  content: Rule[];
  tags: Rule[];
}

export const NOTE_EDIT_RULES: Rules = {
  slug: [
    {
      required: true,
    },
    {
      min: NOTE_RULES.slug.min,
      max: NOTE_RULES.slug.max,
    },
    trimWhitespace,
    isValidSlug,
  ],
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
