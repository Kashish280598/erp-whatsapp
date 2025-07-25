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
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

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

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete?.id) return;

        try {
            await deleteUser(userToDelete.id).unwrap();
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    };


    return (
        <>
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(row?.original)} >
                                            <IconTrash className="h-4 w-4 text-red-500" />
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

            {/* Delete Confirmation Dialog */}
            {
                showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <IconTrash className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete user <span className="font-semibold">{userToDelete?.name}</span>?
                                This will permanently remove the user and all their associated data.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={handleDeleteCancel}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete User'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default UserTable