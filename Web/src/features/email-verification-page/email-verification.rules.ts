import { Rule } from 'antd/es/form';

import { USER_RULES } from '@/common/rules.constants';

interface Rules {
  password: Rule[];
  confirmPassword: Rule[];
}

export const EMAIL_VERIFICATION_RULES: Rules = {
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
  confirmPassword: [
    {
      required: true,
      message: 'Повторіть пароль',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }

        return Promise.reject(new Error('Паролі не співпадають'));
      },
    }),
  ],
};
