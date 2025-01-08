import { green, volcano } from '@ant-design/colors';
import { CaretRightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { App, MenuProps } from 'antd';

import { PermissionType } from '@/auth/permission-type.enum';
import useAuth from '@/auth/use-auth';
import { useAppDispatch } from '@/hooks/redux-hooks';

import { useRunJobMutation } from './scheduler.api';
import { JobResponse } from './scheduler.models';
import { selectUpdateJobPeriod } from './scheduler.slice';

export default function useJobActions() {
  const { notification } = App.useApp();
  const appDispatch = useAppDispatch();

  const { filterAuthItems } = useAuth();
  const [runJob] = useRunJobMutation();

  const handleRunClick = (jobId: string) => {
    runJob({ id: jobId })
      .unwrap()
      .catch(() => notification.error({ message: 'Виникла помилка' }));
  };

  const handleUpdatePeriodClick = (job: JobResponse) => {
    appDispatch(selectUpdateJobPeriod(job));
  };

  const getJobActions = (job: JobResponse): MenuProps['items'] =>
    filterAuthItems([
      {
        permissions: [PermissionType.RunJob],
        value: {
          key: 'run',
          icon: <CaretRightOutlined style={{ color: green.primary }} />,
          label: 'Запустити',
          onClick: () => handleRunClick(job.id),
        },
      },
      {
        permissions: [PermissionType.UpdateJobPeriod],
        value: {
          key: 'update-period',
          icon: <ClockCircleOutlined style={{ color: volcano.primary }} />,
          label: 'Змінити період',
          onClick: () => handleUpdatePeriodClick(job),
        },
      },
    ]);

  return { getJobActions };
}
