import { App, Form, Input, Modal, Typography } from 'antd';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { useUpdateJobPeriodMutation } from './scheduler.api';
import { SCHEDULER_RULES } from './scheduler.rules';
import { clearSelectedUpdateJobPeriod, selectSchedulerState } from './scheduler.slice';
import { getCronDescription } from './scheduler.utils';

interface FormValues {
  cronExpression: string;
}

export default function UpdatePeriodModal() {
  const { notification } = App.useApp();

  const appDispatch = useAppDispatch();
  const { selectedUpdateJobPeriod } = useAppSelector(selectSchedulerState);

  const [updateJobPeriod, { isLoading }] = useUpdateJobPeriodMutation();
  const [form] = Form.useForm<FormValues>();

  const cronDescription = Form.useWatch((values) => getCronDescription(values.cronExpression), form);

  useEffect(() => {
    form.setFieldValue('cronExpression', selectedUpdateJobPeriod?.cronExpression);
  }, [form, selectedUpdateJobPeriod?.cronExpression]);

  const handleClose = () => {
    appDispatch(clearSelectedUpdateJobPeriod());
  };

  const handleSubmit = async (values: FormValues) => {
    if (!selectedUpdateJobPeriod) {
      notification.error({ message: 'Виникла помилка' });
      return;
    }

    await updateJobPeriod({ id: selectedUpdateJobPeriod.id, cronExpression: values.cronExpression })
      .unwrap()
      .then(() => handleClose())
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  return (
    <Modal
      forceRender
      title="Змінити період запуску джоби"
      okText="Зберегти зміни"
      open={!!selectedUpdateJobPeriod}
      confirmLoading={isLoading}
      onOk={form.submit}
      onCancel={handleClose}
    >
      <Typography.Paragraph strong>{selectedUpdateJobPeriod?.name}</Typography.Paragraph>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          hasFeedback
          name="cronExpression"
          label="Cron expression"
          rules={SCHEDULER_RULES.cronExpression}
          style={{ margin: 0 }}
        >
          <Input />
        </Form.Item>
        {cronDescription && <p>{cronDescription}</p>}
      </Form>
    </Modal>
  );
}
