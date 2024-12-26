import { App, Form, InputNumber, Modal, Select, SelectProps, Typography } from 'antd';
import { useEffect } from 'react';

import { convertTimeToSeconds, convertTimeToUnits } from '@/common/time.utils';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { useUpdateJobPeriodMutation } from './scheduler.api';
import { SCHEDULER_RULES } from './scheduler.rules';
import { clearSelectedUpdateJobPeriod, selectSchedulerState } from './scheduler.slice';

const hoursOptions: SelectProps['options'] = Array(24)
  .fill(null)
  .map((_, index) => ({ label: index, value: index }));

const minutesOptions: SelectProps['options'] = Array(60)
  .fill(null)
  .map((_, index) => ({ label: index, value: index }));

const secondsOptions: SelectProps['options'] = Array(60)
  .fill(null)
  .map((_, index) => ({ label: index, value: index }));

interface FormValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function UpdatePeriodModal() {
  const { notification } = App.useApp();

  const appDispatch = useAppDispatch();
  const { selectedUpdateJobPeriod } = useAppSelector(selectSchedulerState);

  const [updateJobPeriod, { isLoading }] = useUpdateJobPeriodMutation();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    const time = convertTimeToUnits(selectedUpdateJobPeriod?.periodInSeconds ?? 0);

    form.setFieldsValue(time);
  }, [form, selectedUpdateJobPeriod?.periodInSeconds]);

  const handleClose = () => {
    appDispatch(clearSelectedUpdateJobPeriod());
  };

  const handleSubmit = async (values: FormValues) => {
    if (!selectedUpdateJobPeriod) {
      notification.error({ message: 'Виникла помилка' });
      return;
    }

    const periodInSeconds = convertTimeToSeconds(values);

    await updateJobPeriod({ id: selectedUpdateJobPeriod.id, periodInSeconds })
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
        <Form.Item hasFeedback name="days" label="Дні" rules={SCHEDULER_RULES.days}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item hasFeedback name="hours" label="Години" rules={SCHEDULER_RULES.hours}>
          <Select options={hoursOptions} />
        </Form.Item>

        <Form.Item hasFeedback name="minutes" label="Хвилини" rules={SCHEDULER_RULES.minutes}>
          <Select options={minutesOptions} />
        </Form.Item>

        <Form.Item hasFeedback name="seconds" label="Секунди" rules={SCHEDULER_RULES.seconds}>
          <Select options={secondsOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
