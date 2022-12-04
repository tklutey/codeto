// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Icon3dCubeSphere, IconDashboard, IconPencil } from '@tabler/icons';
import { OverrideIcon } from 'types';

// constant
const icons = {
  IconDashboard,
  IconPencil,
  Icon3dCubeSphere
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
      id: 'dashboard',
      title: <FormattedMessage id="Dashboard" />,
      type: 'item',
      url: '/student/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'practice',
      title: <FormattedMessage id="Practice" />,
      type: 'item',
      url: '/student/practice',
      icon: icons.IconPencil,
      breadcrumbs: false
    },
    {
      id: 'sandbox',
      title: <FormattedMessage id="Sandbox" />,
      type: 'item',
      url: '/student/sandbox',
      icon: icons.Icon3dCubeSphere,
      breadcrumbs: false
    }
  ]
};

export default student;
