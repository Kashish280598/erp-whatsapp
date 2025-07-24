import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ManageAccountIcon from '@/assets/icons/manage-account.svg';
import UserManagementIcon from '@/assets/icons/manage-user.svg';
import AboutIcon from '@/assets/icons/info-circle.svg';
import LicenseIcon from '@/assets/icons/document-license.svg';

const navItems = [
    {
        icon: ManageAccountIcon,
        label: 'Manage Account',
        path: '/settings/manage-account',
    },
    {
        icon: UserManagementIcon,
        label: 'User Management',
        path: '/settings/user-management',
    },
    {
        icon: AboutIcon,
        label: 'About',
        path: '/settings/about',
    },
    {
        icon: LicenseIcon,
        label: 'License',
        path: '/settings/license',
    }
];

export default function Settings() {
    const location = useLocation();

    return (
        <>
            <h1 className="text-[24px] h-fit font-[600] leading-7.5 text-neutral font-inter pt-1 pb-5 !w-[100%] min-w-[100%] flex-1">Settings</h1>
            {/* <div className="flex gap-5 flex-1 min-h-[calc(100%-54px)]"> */}
            <div className="w-[200px] shrink-0 sticky top-[0px] h-fit">
                <nav className="flex flex-col gap-2 mb-5">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-3 rounded-lg text-[12px] leading-4 font-inter font-[400] transition-colors",
                                location.pathname.includes(item.path)
                                    ? "bg-primary-100 text-primary font-[600]"
                                    : "text-neutral-500 hover:bg-neutral-300"
                            )}
                        >
                            <img src={item.icon} alt={item.label} className={`w-4 h-4 ${location.pathname.includes(item.path) && "active-menu-icon"}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-[1px] w-[1px] sticky bg-[#E4E4E8] mx-5 top-0 min-h-[calc(100%-54px)]" />
            <div className="flex-1 w-0">
                <Outlet />
            </div>
            {/* </div> */}
        </>
    );
}