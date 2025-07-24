import ComplianceIcon from "@/assets/icons/compliance-icon.svg";
import DashboardIcon from "@/assets/icons/dashboard-icon.svg";
import DiscoverIcon from "@/assets/icons/discover-icon.svg";
import FindingsIcon from "@/assets/icons/finding-icon.svg";
import IdentitiesIcon from "@/assets/icons/identity-icon.svg";
import IntegrationsIcon from "@/assets/icons/integration-icon.svg";
import ReportsIcon from "@/assets/icons/reports-icon.svg";
import RulesIcon from "@/assets/icons/rule-icon.svg";
import AlertsIcon from "@/assets/icons/security-alert-icon.svg";
import SettingsIcon from "@/assets/icons/settings-icon.svg";
import ThreatsIcon from "@/assets/icons/threat-icon.svg";
import UsersIcon from "@/assets/icons/user-contact-icon.svg";


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
    title: "Integrations",
    label: "",
    href: "/integrations",
    icon: IntegrationsIcon,
    sidebarIdentifier: "integrations",
  },
  {
    title: "Findings",
    label: "",
    href: "/findings",
    icon: FindingsIcon,
    sidebarIdentifier: "findings",
  },
  {
    title: "Rules",
    label: "",
    href: "/rules",
    icon: RulesIcon,
    sidebarIdentifier: "rules",
  },
  {
    title: "Threat Intel Zone",
    label: "",
    href: "/threats",
    icon: ThreatsIcon,
    sidebarIdentifier: "threats",
  },
  {
    title: "Identities",
    label: "",
    href: "/identities",
    icon: IdentitiesIcon,
    sidebarIdentifier: "identities",
  },

  {
    title: "Discover",
    label: "",
    href: "/discover",
    icon: DiscoverIcon,
    sidebarIdentifier: "discover",
  },
  {
    title: "Compliance",
    label: "",
    href: "/compliance",
    icon: ComplianceIcon,
    sidebarIdentifier: "compliance",
  },
  {
    title: "Security Alerts",
    label: "",
    href: "/alerts",
    icon: AlertsIcon,
    sidebarIdentifier: "alerts",
  },
  {
    title: "Reports",
    label: "",
    href: "/reports",
    icon: ReportsIcon,
    sidebarIdentifier: "reports",
  },
  {
    title: "",
    label: "",
    href: "",
    saperator: true,
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
