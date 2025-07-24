import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconDotsVertical } from "@tabler/icons-react";
import { useMemo, useState } from "react";

const UserTable = ({ onFetchUsers, isLoading }: { onFetchUsers: (params: TableQueryParams) => void, isLoading: boolean }) => {

    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: true,
        searchPlaceholder: 'Search by Name...',
        filterOptions: [
            {
                field: 'roles',
                title: 'Roles',
                options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'Customer', value: 'customer' },
                ],
            },

        ],
    };

    const [searchTerm, setSearchTerm] = useState('');

    const users = useMemo(() => [
        {
            id: 1,
            name: 'John Doe',
            service: {
                name: 'Appian',
                logo: 'https://placehold.co/150',
            },
            openIssues: 10,
            scanFrequency: 'Daily',
            severity: 'Critical',
            riskScore: 78,
            roles: ['Admin'],
            lastScan: '2025-03-15 09:30:00',
            status: 'active',
        },
        {
            id: 2,
            name: 'Jane Doe',
            service: {
                name: 'Auth0',
                logo: 'https://placehold.co/150',
            },
            openIssues: 8,
            scanFrequency: 'Daily',
            severity: 'High',
            riskScore: 75,
            roles: ['Customer'],
            lastScan: '2025-03-15 08:45:00',
            status: 'active',
        },
    ], [])

    return (
        <DataTable
            data={users}
            columns={[
                {
                    id: 'name',
                    accessorKey: 'name',
                    filterFn: 'arrIncludesSome',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Name" />
                    ),
                    cell: ({ row }) => {
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 rounded-full border-1 border-[#E4E4E8]">
                                    <AvatarFallback className="rounded-[2px] bg-gray-100 text-gray-600">
                                        {row.original.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{row.original.name}</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'roles',
                    accessorKey: 'roles',
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Roles" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            {row.original.roles.map((tag: string) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )
                },
                {
                    id: 'addedOn',
                    accessorKey: 'addedOn',
                    filterFn: 'arrIncludesSome',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Added On" />
                    ),
                    cell: ({ row }) => {
                        const date = new Date(row.original.lastScan);
                        return (
                            <span className="text-sm text-gray-600">
                                {date.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                        )
                    }
                },
                {
                    id: 'actions',
                    header: 'Actions',
                    accessorKey: 'actions',
                    cell: () => (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <IconDotsVertical className="h-4 w-4 text-gray-500" />
                        </Button>
                    )
                }
            ]}
            tableToolbar={{
                ...tableToolbar,
                searchTerm,
                setSearchTerm,
            }}
            fetchData={onFetchUsers}
            totalCount={200}
            loading={isLoading}
            tableId="dashboard-integrations"
        />
    )
}

export default UserTable