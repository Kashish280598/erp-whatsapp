import { Outlet } from 'react-router-dom';

export default function Settings() {
    return (
        <>
            <h1 className="text-[24px] h-fit font-[600] leading-7.5 text-neutral font-inter pt-1 pb-5 !w-[100%] min-w-[100%] flex-1">Settings</h1>
            <div className="flex-1 w-0">
                <Outlet />
            </div>
        </>
    );
}