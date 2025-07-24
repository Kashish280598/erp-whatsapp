import type { SidebarLink } from '@/data/sidebar-links';
import Settings from './DynamicSidebars/Settings';
import { Discovery } from './DynamicSidebars/Discovery';

interface NavLinkProps extends SidebarLink {
    subLink?: boolean;
    closeNav: () => void;
}

const dynamicSidebar = {
    settings: Settings,
    discover: Discovery
};

export default function DynamicSidebar(props: NavLinkProps) {
    const { sidebarIdentifier } = props;
    const DynamicSidebarComponent = dynamicSidebar[sidebarIdentifier as keyof typeof dynamicSidebar];
    if (!DynamicSidebarComponent) return null;
    return (
        <div>
            <DynamicSidebarComponent />
        </div>
    )
};