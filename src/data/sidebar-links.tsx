import DashboardIcon from "@/assets/icons/dashboard-icon.svg";
import FindingIcon from "@/assets/icons/finding-icon.svg";
import ManageUserIcon from "@/assets/icons/manage-user.svg";
import SettingsIcon from "@/assets/icons/settings-icon.svg";
import UserIcon from '@/assets/icons/user-contact-icon.svg';
import { IconChartTreemap } from "@tabler/icons-react";


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
    title: "Inventory Manager",
    label: "",
    href: "/inventory",
    icon: FindingIcon,
  },
  {
    title: "Customers",
    label: "",
    href: "/customers",
    icon: ManageUserIcon,
  },
  {
    title: "Chat",
    label: "",
    href: "/chat",
    icon: IconChartTreemap,
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
    icon: UserIcon,
    sidebarIdentifier: "settings",
  },
  {
    title: "Categories",
    label: "",
    href: "/categories",
    icon: IconChartTreemap,
    sidebarIdentifier: "settings",
  },
];
