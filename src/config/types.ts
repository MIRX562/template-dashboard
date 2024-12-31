import { LucideIcon } from "lucide-react";

export type App = {
  name: string;
  logo: LucideIcon;
  company: string;
  Description: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

export type NavItemProtected = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export type User = {
  id: string;
  name: string;
  email: string;

  // avatar: string;
};
