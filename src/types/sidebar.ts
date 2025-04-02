import { ReactNode } from 'react';

export interface SidebarItem {
  title: string;
  href: string;
  icon?: ReactNode;
  children?: SidebarItem[];
} 