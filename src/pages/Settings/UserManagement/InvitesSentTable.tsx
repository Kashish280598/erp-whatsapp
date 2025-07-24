import type { TableQueryParams, TableToolbar } from '@/types/table.types';
import type { User } from '@/types/user.type';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableColumnHeader } from '@/components/custom/table/data-table/data-table-column-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import InvitesSentActionColumn from './columns/InvitesSentActionColumn';
import type { Row } from '@tanstack/react-table';
import { allInvitations, openEditDrawer } from '@/lib/features/settings/settingsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import moment from 'moment';
import { useCallback } from 'react';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';
import { InvitesSentTabelId } from '@/utils/constant';
import { parseFullName, USERS_ENUMS } from '@/lib/utils';


export default function InvitesSentTable() {
    const dispatch = useAppDispatch();
    const { isLoading } = useLoading(API_ENDPOINTS.users.allInvitations);
    const { data, metadata } = useAppSelector(state => state.settings.invitations);
    const user = useAppSelector(state => state.auth.user);

    const tableToolbar: TableToolbar = {
        enableSearch: false,
        enableFilter: false,
    };

    const fetchData = useCallback((params: TableQueryParams) => {
        dispatch(allInvitations(params));
    }, []);

    const handleRowClick = (row: Row<User>) => {
        dispatch(openEditDrawer({ ...row.original, isInviteTab: true }));
    };


    return (
        <DataTable
            data={data}
            columns={[
                {
                    id: 'name',
                    accessorKey: 'name',
                    filterFn: 'arrIncludesSome',
                    enableSorting: true,
                    enableHiding: true,
                    meta: {
                        headerClassName: "rounded-tl-[10px]"
                    },
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Name" />
                    ),
                    cell: ({ row }) => {
                        const { firstName, lastName } = parseFullName(row.original.name);
                        const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6.5 w-6.5 rounded-[8px] border-none p-0">
                                    <AvatarFallback className="rounded-[8px] bg-[#F2F3FC] text-[12px] font-[400] leading-5 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.name || '-'}</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'email',
                    accessorKey: 'email',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Email" />
                    ),
                    cell: ({ row }) => {
                        return (
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.email || '-'}</span>
                            </div>
                        )
                    }
                },
                {
                    id: 'role',
                    accessorKey: 'role',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Role" />
                    ),
                    cell: ({ row }) => (
                        <Badge
                            variant="secondary"
                            className="px-2 py-0.5 text-[13px] font-[400] leading-5 bg-primary-300 text-neutral"
                        >
                            {USERS_ENUMS[row.original?.role] || '-'}
                        </Badge>
                    )
                },
                {
                    id: 'inviterName',
                    accessorKey: 'inviterName',
                    filterFn: 'arrIncludesSome',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Invited By" />
                    ),
                    cell: ({ row }) => {

                        if (!row.original.inviterName) return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6.5 w-6.5 rounded-[8px] border-none p-0">
                                    <AvatarFallback className="rounded-[8px] bg-[#F2F3FC] text-[12px] font-[400] leading-5 text-primary">
                                        DU
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-[13px] font-[400] leading-5 text-neutral">Deleted User</span>
                            </div>
                        );

                        const { firstName, lastName } = parseFullName(row.original.inviterName || '');
                        const initials = firstName?.charAt(0)?.toUpperCase?.() + lastName?.charAt(0)?.toUpperCase?.();
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6.5 w-6.5 rounded-[8px] border-none p-0">
                                    <AvatarFallback className="rounded-[8px] bg-[#F2F3FC] text-[12px] font-[400] leading-5 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.inviterName || '-'}</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'createdAt',
                    accessorKey: 'createdAt',
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Sent On" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.createdAt ? moment(row.original.createdAt).format('hh:mm A DD/MM/YYYY') : '-'}</span>
                        </div>
                    )
                },
                {
                    id: 'action',
                    accessorKey: 'action',
                    maxSize: 50,
                    size: 50,
                    minSize: 50,
                    meta: {
                        headerClassName: "rounded-tr-[10px]"
                    },
                    header: () => (
                        <div className="flex items-center justify-center">
                            Actions
                        </div>
                    ),
                    cell: InvitesSentActionColumn
                }
            ]}
            tableToolbar={{
                ...tableToolbar,
            }}
            fetchData={fetchData}
            totalCount={metadata.total}
            loading={isLoading}
            tableId={`${user?.id}-${InvitesSentTabelId}`}
            className="rounded-[10px]"
            onRowClick={handleRowClick}
        // headerClassName="bg-white z-10 sticky -top-4 shadow-[0px_1px_2px_0px_#1018280D] rounded-[10px]"
        // tableMainContainerClassName="overflow-unset rounded-[10px]"
        />
    )
}