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
  title: <FormattedMessage id="Student" defaultMessage={'Student'} />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="Dashboard" defaultMessage={'Dashboard'} />,
      type: 'item',
      url: '/student/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'assessment',
      title: <FormattedMessage id="Assessment" defaultMessage={'Assessment'} />,
      type: 'item',
      url: '/assessment',
      icon: icons.IconPencil,
      breadcrumbs: false
    }
    // {
    //   id: 'practice',
    //   title: <FormattedMessage id="Practice" defaultMessage={'Practice'} />,
    //   type: 'item',
    //   url: '/student/practice',
    //   icon: icons.IconPencil,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'sandbox',
    //   title: <FormattedMessage id="Sandbox" defaultMessage={'Sandbox'} />,
    //   type: 'item',
    //   url: '/student/sandbox',
    //   icon: icons.Icon3dCubeSphere,
    //   breadcrumbs: false
    // }
  ]
};

export default student;
