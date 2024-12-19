import { Rule } from 'antd/es/form';

import { USER_RULES } from '@/common/rules.constants';

interface Rules {
  email: Rule[];
  password: Rule[];
}

export const LOGIN_RULES: Rules = {
  email: [
    {
      required: true,
      type: 'email',
      max: USER_RULES.email.max,
      message: 'Введіть дійсну адресу електронної пошти',
    },
  ],
  password: [
    {
      required: true,
      message: 'Введіть пароль',
    },
    {
      min: USER_RULES.password.min,
      max: USER_RULES.password.max,
      message: `Довжина пароля має бути від ${USER_RULES.password.min} до ${USER_RULES.password.max} символів`,
    },
  ],
};
