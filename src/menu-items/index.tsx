import { NavItemType } from 'types';
import student from 'menu-items/student';
import admin from './admin';
import useAuth from '../hooks/useAuth';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [student, admin]
};

export default menuItems;
