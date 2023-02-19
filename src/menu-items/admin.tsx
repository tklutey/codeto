// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Icon3dCubeSphere, IconDashboard, IconPencil } from '@tabler/icons';
import { OverrideIcon } from 'types';
import { UserProfile } from 'types/user-profile';

// constant
const icons = {
  IconDashboard,
  IconPencil,
  Icon3dCubeSphere
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

interface AdminMenuProps {
  id: string;
  title: React.ReactNode | string;
  type: string;
  whitelistFunction: (user: UserProfile) => boolean;
  children: {
    id: string;
    title: React.ReactNode | string;
    type: string;
    url: string;
    icon: OverrideIcon;
    breadcrumbs: boolean;
  }[];
}

const admin: AdminMenuProps = {
  id: 'admin',
  title: <FormattedMessage id="Admin" defaultMessage={'Admin'} />,
  type: 'group',
  whitelistFunction: (user: UserProfile) => user.email === 'kluteyt@gmail.com',
  children: [
    {
      id: 'read_problem',
      title: <FormattedMessage id="View Problem" defaultMessage={'View Problem'} />,
      type: 'item',
      url: '/admin/problem/1',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'new_problem',
      title: <FormattedMessage id="New Problem" defaultMessage={'New Problem'} />,
      type: 'item',
      url: '/admin/problem/new',
      icon: icons.IconPencil,
      breadcrumbs: false
    },
    {
      id: 'manage_standards',
      title: <FormattedMessage id="Manage Standards" defaultMessage={'Manage Standards'} />,
      type: 'item',
      url: '/admin/standard/manage',
      icon: icons.Icon3dCubeSphere,
      breadcrumbs: false
    }
  ]
};

export default admin;
