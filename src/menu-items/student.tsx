// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';
import { OverrideIcon } from 'types';

// constant
const icons = {
  IconDashboard,
  IconDeviceAnalytics
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

interface StudentMenuProps {
  id: string;
  title: React.ReactNode | string;
  type: string;
  children: {
    id: string;
    title: React.ReactNode | string;
    type: string;
    url: string;
    icon: OverrideIcon;
    breadcrumbs: boolean;
  }[];
}

const student: StudentMenuProps = {
  id: 'student',
  title: <FormattedMessage id="Student" />,
  type: 'group',
  children: [
    {
      id: 'practice',
      title: <FormattedMessage id="Practice" />,
      type: 'item',
      url: '/student/practice',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default student;
