import GetStartedDialog from "./GetStartedDialog";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmailPlusIcon from '@/assets/icons/email-plus.svg';
import TvPlayIcon from '@/assets/icons/tv-play-icon.svg';
import CardOverlayVisual from '@/assets/icons/Visual-1.svg';
import CardOverlayVisual2 from '@/assets/icons/transparent-visual-1.svg';
import CardOverlayVisual3 from '@/assets/icons/transparent-visual-2.svg';
import { BasicTable } from "@/components/custom/table/basic-table";
import type { TableToolbar } from "@/types/table.types";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table"
import CellularStatus from "@/components/charts/CellularStatus";
import LinkIcon from '@/assets/icons/Link-Icon.svg';
import { IconEye } from "@tabler/icons-react";
import DiscoveryTable from "./DiscoveryTable";
import NotCompatibleIntegrationSideDrawer from "./NotCompatibleIntegrationSideDrawer";
import { openNotCompatibleIntegrationSideDrawer, openSupportedIntegrationSideDrawer } from "@/lib/features/discovery/discoverySlice";
import SupportedIntegrationSideDrawer from "@/components/custom/SupportedIntegrationSideDrawer";
import { useNavigate } from "react-router-dom";
import { openInviteUserDrawer } from "@/lib/features/settings/settingsSlice";
import { isAdminUser } from "@/lib/utils";
import { useMemo } from "react";
import PlayDemoVideoDialog from "@/components/custom/PlayDemoVideoDialog";

const data = [
    {
        name: "Appian",
        logo: "https://appian.com/etc.clientlibs/appian-aem/clientlibs/clientlib-appianaem-all/resources/icon-192x192.png",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
    },
    {
        name: "Slack",
        logo: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png",
        riskCategory: "high",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
    },
    {
        name: "Google",
        logo: "https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-google-icon-PNG.png",
        riskCategory: "medium",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
    },
    {
        name: "Salesforce",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "low",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
    },
    {
        name: "Auth0",
        logo: "https://images.seeklogo.com/logo-png/42/1/auth0-logo-png_seeklogo-426699.png",
        riskCategory: "low",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
    },
    {
        name: "Okta",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "low",
        isSupported: false,
        description: "Okta is a low-risk integration that is supported by ERP.",
    },
    {
        name: "Microsoft",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "low",
        isSupported: true,
        description: "Microsoft is a low-risk integration that is supported by ERP.",
    },
    {
        name: "Salesforce",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "medium",
        isSupported: true,
        description: "Salesforce is a medium-risk integration that is supported by ERP.",
    },
    {
        name: "Salesforce",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a critical-risk integration that is supported by ERP.",
    },
    {
        name: "Salesforce",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "high",
        isSupported: true,
        description: "Salesforce is a high-risk integration that is supported by ERP.",
    },
    {
        name: "Salesforce",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "medium",
        isSupported: true,
        description: "Salesforce is a medium-risk integration that is supported by ERP.",
    },
    {
        name: "Salesforce",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
        riskCategory: "low",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
    },
];

const Discovery = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const { isShowAll } = useAppSelector((state) => state.discovery);
    const navigate = useNavigate();
    const isAdmin = isAdminUser();

    const handleViewDetails = (integration: any) => {
        if (integration.isSupported) {
            dispatch(openSupportedIntegrationSideDrawer(integration));
            return;
        }
        dispatch(openNotCompatibleIntegrationSideDrawer(integration));
    };

    const columns: ColumnDef<any>[] = useMemo(() => {
        return [
            {
                id: "name",
                header: ({ column }) => {
                    return (
                        <>
                            <DataTableColumnHeader column={column} title="Integration" />
                            <div className="border-b-2 border-neutral-200 absolute w-full bottom-0 left-0" />
                        </>
                    )
                },
                accessorKey: "name",
                cell: ({ row }) => {
                    return <div className="flex items-center gap-2">
                        <Avatar className="rounded-[6px] w-6 h-6 bg-[#FFFFFF] border-[0.6px] border-neutral-200 flex items-center justify-center">
                            <AvatarImage src={row.original.logo} alt={row.original.name} className="rounded-[4px] h-4.5 w-4.5" />
                            <AvatarFallback className="rounded-[4px] text-[13px] uppercase bg-secondary text-primary !h-4.5 !w-4.5">
                                {row.original.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        {row.original.name}
                    </div>
                }
            },
            {
                id: "riskCategory",
                header: () => {
                    return (
                        <>
                            Risk Category
                            <div className="border-b-2 border-neutral-200 absolute w-full bottom-0 left-0" />
                        </>
                    )
                },
                accessorKey: "riskCategory",
                cell: ({ row }) => {
                    return <div className="flex items-center gap-2 pl-1.5">
                        <CellularStatus status={row.original.riskCategory} />
                    </div>
                }
            },
            {
                id: "action",
                header: () => {
                    return (
                        <>
                            Action
                            <div className="border-b-2 border-neutral-200 absolute w-full bottom-0 left-0" />
                        </>
                    )
                },
                accessorKey: "Action",
                size: 130,
                cell: ({ row }) => {
                    const isSupported = row.original.isSupported;
                    return (
                        <Button
                            variant="ghost"
                            className={`bg-white px-1.5 py-1 rounded-[8px] ${isSupported ? 'text-primary' : 'text-neutral-500'} gap-1 h-auto`}
                            onClick={() => handleViewDetails(row.original)}
                        >
                            {isSupported ? <img src={LinkIcon} alt="Link" className="w-4 h-4" /> : <IconEye className="w-4 h-4" stroke={1.5} strokeWidth={1.5} />}
                            {isSupported ? 'Connect' : 'View Details'}
                        </Button >
                    )
                }
            },
        ]
    }, []);

    const tableToolbar: TableToolbar = {
        enableFilter: false,
        enableSearch: true,
        searchContainerClassName: 'flex-1 mx-4',
        searchPlaceholder: 'Search by name...'
    };

    const handleInviteCTA = () => {
        dispatch(openInviteUserDrawer());
        navigate('/settings/user-management?tab=invites-sent');
    };

    const handleLetsConnectCTA = () => {
        dispatch(openInviteUserDrawer());
        navigate('/integrations');
    };

    return (
        <>
            {isShowAll ? (
                <>
                    {/* Main View */}
                    <h1 className="text-[24px] h-fit font-[600] leading-7.5 text-neutral font-inter pt-1 pb-5 !w-[100%] min-w-[100%] flex-1">
                        Discover
                    </h1>
                    <h2 className="text-[16px] font-[600] leading-5 text-neutral-500 font-inter">We found 30 apps associated with your organisation!</h2>
                    <DiscoveryTable />
                </>
            ) : (
                <div className="flex flex-col items-center w-full h-full gap-10">
                    <h1 className="mt-6 text-[24px] font-[600] leading-[36px] text-center text-neutral">
                        Welcome {user?.name && (
                            <span className="text-primary">{user.name}</span>
                        )}, let's get started!
                    </h1>
                    <div className="flex gap-7 pb-5">
                        {Boolean(data.length) && (
                            <div className="felx gap-5 flex-col overflow-hidden rounded-[12px] border border-neutral-200 shadow-[0px_1px_2px_0px_#1018280D] relative max-w-[464px]">
                                <div className="p-4">
                                    <h1 className="text-[16px] leading-5 font-[600] text-neutral-500">We found 30 apps associated with your organisation!</h1>
                                </div>
                                <div className="flex h-full custom-discovery-table">
                                    <BasicTable
                                        tableToolbar={tableToolbar}
                                        tableId="get-started-discovery-table"
                                        columns={columns}
                                        data={data}
                                        loading={false}
                                        tableMainContainerClassName="max-h-[460px] border-none custom-scrollbar rounded-none"
                                        className="w-full"
                                        headerClassName="[&>tr]:!border-none sticky top-0 bg-white z-1"
                                        showPagination={false}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col items-center h-full gap-5">
                            <div className="overflow-hidden px-5 py-[17.33px] bg-neutral-300 rounded-[12px] border border-primary-400 shadow-[0px_1px_2px_0px_#1018280D] relative max-w-[562px]">
                                <img src={CardOverlayVisual} alt="Download" className="absolute top-0 right-0" />
                                <div className="flex items-center">
                                    <div className="pl-[3px] relative bg-white rounded-[12px] z-1">
                                        <Avatar className="h-11 w-11 bg-white rounded-[12px] border-1 border-[#E4E4E8] p-[3px]">
                                            <AvatarImage src={"https://a.slack-edge.com/80588/img/icons/app-512.png"} className='rounded-[10px] bg-[#F4F4F6]' />
                                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                                D
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="pl-[3px] relative bg-white rounded-[12px] -left-3 z-1">
                                        <Avatar className="h-11 w-11 bg-white rounded-[12px] border-1 border-[#E4E4E8] p-1">
                                            <AvatarImage src={"https://a.slack-edge.com/80588/img/icons/app-512.png"} className='rounded-[10px] bg-[#F4F4F6]' />
                                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                                D
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="pl-[3px] relative bg-white rounded-[12px] -left-6 z-1">
                                        <Avatar className="h-11 w-11 bg-white rounded-[12px] border-1 border-[#E4E4E8] p-1">
                                            <AvatarImage src={"https://a.slack-edge.com/80588/img/icons/app-512.png"} className='rounded-[10px] bg-[#F4F4F6]' />
                                            <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                                D
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="pl-[3px] relative bg-white rounded-[12px] -left-9 z-1">
                                        <Avatar className="h-11 w-11 bg-white rounded-[12px] border-1 border-[#E4E4E8] p-1">
                                            <AvatarFallback className="rounded-[10px] bg-white text-neutral text-[16px] font-[400] leading-6">
                                                50+
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-5 mt-7 z-1">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter">Connect your first integration</h4>
                                        <p className="text-[13px] leading-5 text-[#5E5F6E] font-[400] font-inter">
                                            Start securing your SaaS apps. Connect Appian, Auth-0, or 50+ other integrations.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleLetsConnectCTA}
                                        variant="default"
                                        className="px-3 py-2 text-[13px] leading-5 font-inter font-[600] z-1">
                                        Let's Connect
                                    </Button>
                                </div>
                            </div>

                            {isAdmin && (
                                <div className="overflow-hidden px-5 py-[17.33px] rounded-[12px] border border-neutral-200 shadow-[0px_1px_2px_0px_#1018280D] relative max-w-[562px]">
                                    <img src={CardOverlayVisual2} alt="Download" className="absolute top-0 right-0" />
                                    <Avatar className="h-11 w-11 rounded-[12px] border-1 border-[#E4E4E8] p-1 z-1">
                                        <AvatarImage src={EmailPlusIcon} className='rounded-[10px] bg-[#F4F4F6] p-2' />
                                        <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                            E
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center justify-between gap-5 mt-7 z-1">
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter">Invite a new user</h4>
                                            <p className="text-[13px] leading-5 text-[#5E5F6E] font-[400] font-inter">
                                                Collaborate seamlessly. Invite team members and configure their roles.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleInviteCTA}
                                            variant="outline"
                                            className="px-3 py-2 text-[13px] leading-5 font-inter font-[600] text-neutral z-1">
                                            Let's Invite
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-hidden px-5 py-[17.33px] rounded-[12px] border border-neutral-200 shadow-[0px_1px_2px_0px_#1018280D] relative max-w-[562px]">
                                <img src={CardOverlayVisual3} alt="Download" className="absolute top-0 right-0" />
                                <Avatar className="h-11 w-11 rounded-[12px] border-1 border-[#E4E4E8] p-1 z-1">
                                    <AvatarImage src={TvPlayIcon} className='rounded-[10px] bg-[#F4F4F6] p-2' />
                                    <AvatarFallback className="rounded-[10px] bg-[#F4F4F6] text-white">
                                        T
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center justify-between gap-5 mt-7 z-1">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-[16px] font-[600] leading-6 text-neutral font-inter">Watch a Quick Demo</h4>
                                        <p className="text-[13px] leading-5 text-[#5E5F6E] font-[400] font-inter">
                                            See ERP in action. Learn how to maximize protection in 2 minutes.
                                        </p>
                                    </div>
                                    <PlayDemoVideoDialog />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <GetStartedDialog />
            <NotCompatibleIntegrationSideDrawer />
            <SupportedIntegrationSideDrawer />
        </>
    );
};

export default Discovery;
