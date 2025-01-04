import { Rule } from 'antd/es/form';

import { USER_RULES } from '@/common/rules.constants';

interface Rules {
  email: Rule[];
}

export const USERS_RULES: Rules = {
  email: [
    {
      required: true,
      type: 'email',
      max: USER_RULES.email.max,
      message: 'Введіть дійсну адресу електронної пошти',
    },
  ],
};
