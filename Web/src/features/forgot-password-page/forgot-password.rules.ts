import { Rule } from 'antd/es/form';

interface Rules {
  email: Rule[];
}

export const FORGOT_PASSWORD_RULES: Rules = {
  email: [
    {
      required: true,
      type: 'email',
      message: 'Введіть дійсну адресу електронної пошти',
    },
  ],
};
