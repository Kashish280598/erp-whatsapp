import type { TableQueryParams, TableToolbar } from '@/types/table.types';
import type { User } from '@/types/user.type';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableColumnHeader } from '@/components/custom/table/data-table/data-table-column-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UserDirectoryActionColumn from './columns/UserDirectoryActionColumn';
import type { Row } from '@tanstack/react-table';
import { getAllUser, openEditDrawer } from '@/lib/features/settings/settingsSlice';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';
import { parseFullName, USERS_ENUMS } from '@/lib/utils';
import { useCallback } from 'react';
import { UserDirectoryTabelId } from '@/utils/constant';


export default function UserDirectory() {
    const dispatch = useAppDispatch();
    const { isLoading } = useLoading(API_ENDPOINTS.users.all);
    const user = useAppSelector(state => state.auth.user);
    const { data, metadata } = useAppSelector(state => state.settings.users);
    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: true,
        searchPlaceholder: 'Search by name, email address...',
        filterOptions: [
            {
                field: 'role',
                title: 'Role',
                options: [
                    { label: 'Administrator', value: 'admin' },
                    { label: 'Read Only', value: 'read-only' },
                ],
            },
            {
                field: 'active',
                title: 'Status',
                options: [
                    { label: 'Active', value: true },
                    { label: 'In-Active', value: false },
                ],
            },
        ],
    };


    const fetchData = useCallback((params: TableQueryParams) => {
        dispatch(getAllUser(params));
    }, []);

    const handleRowClick = (row: Row<User>) => {
        dispatch(openEditDrawer(row.original));
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
                    enableHiding: false,
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
                                    <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.name}</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'email',
                    accessorKey: 'email',
                    enableSorting: true,
                    enableHiding: false,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Email" />
                    ),
                    cell: ({ row }) => {
                        return (
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.email}</span>
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
                            {USERS_ENUMS[row.original?.role]}
                        </Badge>
                    )
                },
                {
                    id: 'authMethod',
                    accessorKey: 'authMethod',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Auth Type" />
                    ),
                    cell: ({ row }) => (
                        <Badge
                            variant="secondary"
                            className="px-2 py-0.5 text-[13px] font-[400] leading-5 bg-primary-300 text-neutral"
                        >
                            {row.original.authMethod || '-'}
                        </Badge>
                    )
                },
                {
                    id: 'invitedBy',
                    accessorKey: 'invitedBy',
                    filterFn: 'arrIncludesSome',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Invited By" />
                    ),
                    cell: ({ row }) => {

                        if (!row.original.invitedBy) return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6.5 w-6.5 rounded-[8px] border-none p-0">
                                    <AvatarFallback className="rounded-[8px] bg-[#F2F3FC] text-[12px] font-[400] leading-5 text-primary">
                                        DU
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-[13px] font-[400] leading-5 text-neutral">Deleted User</span>
                            </div>
                        );

                        const { firstName, lastName } = parseFullName(row.original.invitedBy?.name || '');
                        const initials = firstName?.charAt(0)?.toUpperCase?.() + lastName?.charAt(0)?.toUpperCase?.();

                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6.5 w-6.5 rounded-[8px] border-none p-0">
                                    <AvatarFallback className="rounded-[8px] bg-[#F2F3FC] text-[12px] font-[400] leading-5 text-primary">
                                        {initials || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.invitedBy?.name || '-'}</span>
                                </div>
                            </div>
                        );
                    }
                },
                {
                    id: 'active',
                    accessorKey: 'active',
                    meta: {
                        isHidden: true,
                    },
                    enableHiding: false,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Status" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.active}</span>
                        </div>
                    )
                },
                {
                    id: 'lastActivity',
                    accessorKey: 'lastActivity',
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Last Active" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            <span className="text-[13px] font-[400] leading-5 text-neutral">{row.original.lastActivity ? moment(row.original.lastActivity).format('hh:mm A DD/MM/YYYY') : '-'}</span>
                        </div>
                    )
                },
                {
                    id: 'action',
                    header: 'Actions',
                    accessorKey: 'action',
                    maxSize: 50,
                    size: 50,
                    enableHiding: false,
                    minSize: 50,
                    meta: {
                        headerClassName: "rounded-tr-[10px]"
                    },
                    cell: UserDirectoryActionColumn
                }
            ]}
            tableToolbar={{
                ...tableToolbar,
            }}
            fetchData={fetchData}
            totalCount={metadata.total}
            loading={isLoading}
            tableId={`${user?.id}-${UserDirectoryTabelId}`}
            className="rounded-[10px]"
            onRowClick={handleRowClick}
            tableMainContainerClassName="custom-scrollbar"
        />
    )
}