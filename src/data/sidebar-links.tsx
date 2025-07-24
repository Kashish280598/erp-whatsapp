import DashboardIcon from "@/assets/icons/dashboard-icon.svg";
import SettingsIcon from "@/assets/icons/settings-icon.svg";
import { default as ChatIcon, default as UsersIcon } from "@/assets/icons/user-contact-icon.svg";



export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon?: string;
  saperator?: boolean;
}

export interface SidebarLink extends NavLink {
  sub?: NavLink[];
  parent?: string;
  sidebarIdentifier?: string;
}

export const sidebarlinks: SidebarLink[] = [
  {
    title: "Dashboard",
    label: "",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Chat",
    label: "",
    href: "/chat",
    icon: ChatIcon,
  },
  {
    title: "Settings",
    label: "",
    href: "/settings",
    icon: SettingsIcon,
    sidebarIdentifier: "settings",
  },
  {
    title: "Users",
    label: "",
    href: "/users",
    icon: UsersIcon,
    sidebarIdentifier: "settings",
  },
  {
    title: "Categories",
    label: "",
    href: "/categories",
    icon: UsersIcon,
  },

];
