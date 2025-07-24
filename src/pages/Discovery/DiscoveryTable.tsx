// import { useAppDispatch } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { TableToolbar } from "@/types/table.types";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table"
import CellularStatus from "@/components/charts/CellularStatus";
import LinkIcon from '@/assets/icons/Link-Icon.svg';
import { IconEye } from "@tabler/icons-react";
import { BasicTable } from "@/components/custom/table/basic-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainDiscoveryTable } from "@/utils/constant";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect, useMemo } from "react";
import { openNotCompatibleIntegrationSideDrawer, openSupportedIntegrationSideDrawer, setIsShowAll } from "@/lib/features/discovery/discoverySlice";


const data = [
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://appian.com/etc.clientlibs/appian-aem/clientlibs/clientlib-appianaem-all/resources/icon-192x192.png",
    },
    {
        name: "Appian",
        riskCategory: "high",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/306_Slack_logo-1024.png",
    },
    {
        name: "Appian",
        riskCategory: "medium",
        isSupported: false,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-google-icon-PNG.png",
    },
    {
        name: "Appian",
        riskCategory: "low",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
    },
    {
        name: "Appian",
        riskCategory: "low",
        isSupported: false,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://images.seeklogo.com/logo-png/42/1/auth0-logo-png_seeklogo-426699.png",
    },
    {
        name: "Appian",
        riskCategory: "low",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "low",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "medium",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Auth0 is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Appian is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Slack is a high-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "Appian",
        riskCategory: "critical",
        isSupported: true,
        description: "Google is a medium-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",

    },
    {
        name: "OneLogin",
        riskCategory: "critical",
        isSupported: true,
        description: "Salesforce is a low-risk integration that is supported by ERP.",
        logo: "https://a.slack-edge.com/80588/img/icons/app-512.png",
    },
];

export default function DiscoveryTable() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    const columns: ColumnDef<any>[] = useMemo(() => {
        return ([
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
                meta: {
                    headerClassName: "rounded-tl-[8px]"
                },
                accessorKey: "name",
                cell: ({ row }) => {
                    return <div className="flex items-center gap-2">
                        <Avatar className="rounded-[6px] w-6 h-6 bg-[#FFFFFF] border-[0.6px] border-neutral-200 flex items-center justify-center">
                            <AvatarImage src={"https://a.slack-edge.com/80588/img/icons/app-512.png"} alt={row.original.name} className="rounded-[4px] h-4.5 w-4.5" />
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
                },
                filterFn: 'arrIncludesSome'
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
                },
                meta: {
                    headerClassName: "rounded-tr-[8px]"
                },
            },

        ])
    }, []);

    const tableToolbar: TableToolbar = {
        enableFilter: true,
        enableSearch: true,
        enableCustomizeColumns: false,
        searchPlaceholder: 'Search by name...',
        filterOptions: [
            {
                column: "riskCategory",
                title: "Risk Category",
                options: [
                    {
                        label: "Critical",
                        value: "critical"
                    },
                    {
                        label: "High",
                        value: "high"
                    },
                    {
                        label: "Medium",
                        value: "medium"
                    },
                    {
                        label: "Low",
                        value: "low"
                    }
                ]
            },
        ]
    };

    useEffect(() => {
        return () => {
            dispatch(setIsShowAll(false));
        };
    }, []);

    const handleViewDetails = (integration: any) => {
        if (integration.isSupported) {
            dispatch(openSupportedIntegrationSideDrawer(integration));
            return;
        }
        dispatch(openNotCompatibleIntegrationSideDrawer(integration));
    };


    return (
        <div className="w-full mt-7 mb-5">
            <BasicTable
                tableToolbar={tableToolbar}
                tableId={`${user?.id}-${MainDiscoveryTable}`}
                columns={columns}
                data={data}
                loading={false}
                tableMainContainerClassName="custom-scrollbar" // overflow-unset
                className="w-full"
                headerClassName="[&>tr]:!border-none sticky -top-4 bg-white z-1"
            // showPagination={false}
            />
        </div>
    )
}
