import { Rule } from 'antd/es/form';

import { SLUG_SEPARATOR } from './app.constants';
import { isString } from './type-guards.utils';

const SLUG_PATTERN = `^[a-z0-9-${SLUG_SEPARATOR}]+$`;
const SLUG_REGEX = new RegExp(SLUG_PATTERN);

export const trimWhitespace: Rule = {
  validator: (_, value) => {
    if (!isString(value)) {
      return Promise.resolve();
    }

    return value.length === value.trim().length
      ? Promise.resolve()
      : Promise.reject(new Error('Видаліть зайві пробіли на початку чи в кінці'));
  },
};

export const isValidSlug: Rule = {
  validator: (_, value) => {
    const errorMessage = 'Невірний формат slug';

    if (!isString(value)) {
      return Promise.reject(new Error(errorMessage));
    }

    return SLUG_REGEX.test(value) ? Promise.resolve() : Promise.reject(new Error(errorMessage));
  },
};
