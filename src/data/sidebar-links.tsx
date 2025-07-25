import DashboardIcon from "@/assets/icons/dashboard-icon.svg";
import SettingsIcon from "@/assets/icons/settings-icon.svg";
import UsersIcon from "@/assets/icons/manage-user.svg";
import ChatIcon from "@/assets/icons/tv-play-icon.svg";
import FindingIcon from "@/assets/icons/finding-icon.svg";
import CustomersIcon from "@/assets/icons/invite-user.svg";

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
    icon: CustomersIcon,
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
];
