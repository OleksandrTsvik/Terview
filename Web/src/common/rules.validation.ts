import { Rule } from 'antd/es/form';

import { isString } from './type-guards.utils';

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
