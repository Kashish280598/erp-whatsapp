// Create React components for each icon
const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 2H7V7H2V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 2H14V7H9V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 9H7V14H2V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H14V14H9V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 3H6L7 5H14L12 9H5L4 7H2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 9C6 10.1046 5.10457 11 4 11C2.89543 11 2 10.1046 2 9C2 7.89543 2.89543 7 4 7C5.10457 7 6 7.89543 6 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9C12 10.1046 11.1046 11 10 11C8.89543 11 8 10.1046 8 9C8 7.89543 8.89543 7 10 7C11.1046 7 12 7.89543 12 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FindingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Building structure */}
    <rect x="2" y="6" width="12" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    
    {/* Triangular roof */}
    <path d="M2 6L8 2L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Large garage door with horizontal lines */}
    <rect x="4" y="8" width="8" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="4" y1="9.5" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="4" y1="11" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="4" y1="12.5" x2="12" y2="12.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CustomersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Central figure */}
    <circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M6 12C6 10.8954 6.89543 10 8 10C9.10457 10 10 10.8954 10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Left figure */}
    <circle cx="4" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M2.5 12C2.5 11.1716 3.17157 10.5 4 10.5C4.82843 10.5 5.5 11.1716 5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    
    {/* Right figure */}
    <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 14C2 11.7909 3.79086 10 6 10H10C12.2091 10 14 11.7909 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrdersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 2H4L5 6H13L14 10H6L5 6H2V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10C6 11.1046 5.10457 12 4 12C2.89543 12 2 11.1046 2 10C2 8.89543 2.89543 8 4 8C5.10457 8 6 8.89543 6 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.6667 8C14.6667 7.33333 14 6.66667 14 6.66667L12.6667 6C12.6667 5.33333 12.3333 4.66667 12.3333 4.66667L12.6667 3.33333C12.6667 2.66667 12 2 12 2L10.6667 2.33333C10.6667 1.66667 10.3333 1 10.3333 1L9.33333 0C9.33333 0 8.66667 0 8.66667 0.666667L7.66667 1C7.66667 1.66667 7.33333 2.33333 7.33333 2.33333L6 2C6 2 5.33333 2.66667 5.33333 3.33333L5.66667 4.66667C5.66667 5.33333 5.33333 6 5.33333 6L4 6.66667C4 6.66667 3.33333 7.33333 3.33333 8C3.33333 8.66667 4 9.33333 4 9.33333L5.33333 10C5.33333 10.6667 5.66667 11.3333 5.66667 11.3333L5.33333 12.6667C5.33333 13.3333 6 14 6 14L7.33333 13.6667C7.33333 14.3333 7.66667 15 7.66667 15L8.66667 16C8.66667 16 9.33333 16 9.33333 15.3333L10.3333 15C10.3333 14.3333 10.6667 13.6667 10.6667 13.6667L12 14C12 14 12.6667 13.3333 12.6667 12.6667L12.3333 11.3333C12.3333 10.6667 12.6667 10 12.6667 10L14 9.33333C14 9.33333 14.6667 8.66667 14.6667 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Speech bubble with tail */}
    <path d="M2 4C2 2.89543 2.89543 2 4 2H10C11.1046 2 12 2.89543 12 4V8C12 9.10457 11.1046 10 10 10H6L4 12V10H4C2.89543 10 2 9.10457 2 8V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Message lines inside bubble */}
    <path d="M4 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 8H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
    title: "Orders",
    label: "",
    href: "/orders",
    icon: OrdersIcon,
  },
  {
    title: "Inventory Manager",
    label: "",
    href: "/inventory",
    icon: FindingIcon,
  },
  {
    title: "Categories",
    label: "",
    href: "/categories",
    icon: CategoryIcon,
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
    title: "Profile",
    label: "",
    href: "/profile",
    icon: SettingsIcon,
    sidebarIdentifier: "settings",
  },
];
