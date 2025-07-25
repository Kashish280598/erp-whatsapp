import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteUserMutation } from "@/lib/api/users-api";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserTable = ({ onFetchUsers, isLoading, users, totalCount }: { onFetchUsers: (params: TableQueryParams) => void, isLoading: boolean, users: any[], totalCount: number }) => {
    const navigate = useNavigate()
    const [deleteUser] = useDeleteUserMutation()

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



    const onDelete = (id: any) => {
        deleteUser(id).unwrap()
    }

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
                                        {row?.original?.name?.charAt(0)}
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
                    id: 'email',
                    accessorKey: 'email',
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Email" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            <span className="text-sm text-gray-600">{row.original.email}</span>
                        </div>
                    )
                },
                {
                    id: 'mobileNo',
                    accessorKey: 'mobileNo',
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Phone Number" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            <span className="text-sm text-gray-600">{row.original.mobileNo}</span>
                        </div>
                    )
                },
                {
                    id: 'role',
                    accessorKey: 'role',
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Role" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex gap-1.5">
                            <Badge
                                variant="secondary"
                                className="px-2 py-0.5 text-xs capitalize font-medium bg-gray-100 text-gray-600"
                            >
                                {row.original.role}
                            </Badge>
                        </div>
                    )
                },
                {
                    id: 'addedOn',
                    accessorKey: 'createdAt',
                    filterFn: 'arrIncludesSome',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Added On" />
                    ),
                    cell: ({ row }) => {
                        const date = new Date(row.original.createdAt);
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
                    cell: ({ row }) => (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/users/${row?.original?.id}`)}>
                                <IconEye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/users/${row?.original?.id}/edit`)}>
                                <IconPencil className="h-4 w-4 text-gray-500" />
                            </Button>
                            {
                                row?.original?.role !== 'admin' && row?.original?.role !== 'super-admin' && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <IconTrash className="h-4 w-4 text-red-500" onClick={() => onDelete(row?.original?.id)} />
                                    </Button>
                                )
                            }
                        </div>
                    )
                }
            ]}
            tableToolbar={{
                ...tableToolbar,
                searchTerm,
                setSearchTerm,
            }}
            fetchData={onFetchUsers}
            totalCount={totalCount}
            loading={isLoading}
            tableId="dashboard-integrations"
        />
    )
}

export default UserTable