import { green, volcano } from '@ant-design/colors';
import { CaretRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { App, MenuProps } from 'antd';

import { useAppDispatch } from '@/hooks/redux-hooks';

import { useRunJobMutation } from './scheduler.api';
import { JobResponse } from './scheduler.models';
import { selectUpdateJobPeriod } from './scheduler.slice';

export default function useJobActions() {
  const { notification } = App.useApp();
  const appDispatch = useAppDispatch();

  const [runJob] = useRunJobMutation();

  const handleRunClick = (jobId: string) => {
    runJob({ id: jobId })
      .unwrap()
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  const handleUpdatePeriodClick = (job: JobResponse) => {
    appDispatch(selectUpdateJobPeriod(job));
  };

  const getJobActions = (job: JobResponse): MenuProps['items'] => [
    {
      key: 'run',
      icon: <CaretRightOutlined style={{ color: green.primary }} />,
      label: 'Запустити',
      onClick: () => handleRunClick(job.id),
    },
    {
      key: 'update-period',
      icon: <ClockCircleOutlined style={{ color: volcano.primary }} />,
      label: 'Змінити період',
      onClick: () => handleUpdatePeriodClick(job),
    },
  ];

  return { getJobActions };
}
