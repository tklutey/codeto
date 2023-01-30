import { NavItemType } from 'types';
import student from 'menu-items/student';
import admin from './admin';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [student, admin]
};

export default menuItems;
