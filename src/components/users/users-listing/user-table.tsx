import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { ServerSidePaginationTable } from "@/components/custom/table/data-table/server-side-pagination-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDeleteUserMutation } from "@/lib/api/users-api";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconCalendar, IconCheck, IconEye, IconMail, IconPencil, IconPhone, IconShield, IconTrash, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// User Details Dialog Component
const UserDetailsDialog = ({ user, isOpen, onClose }: { user: any, isOpen: boolean, onClose: () => void }) => {
    if (!user) return null;

    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'super-admin':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'customer':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                {/* Header with gradient background */}
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-4 text-white">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-12 w-12 rounded-full border-3 border-white/20 shadow-lg">
                                <AvatarFallback className="rounded-full bg-white/20 text-white text-lg font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                                <IconCheck className="h-2.5 w-2.5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-lg font-bold text-white mb-1">
                                {user.name}
                            </DialogTitle>
                            <p className="text-blue-100 text-sm">
                                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                            </p>
                        </div>
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        >
                            <IconX className="h-4 w-4" />
                        </Button> */}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Contact Information */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Contact Information
                            </h3>

                            {user?.email && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <IconMail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-gray-500 mb-1">Email</div>
                                        <div className="text-sm font-medium text-gray-900 truncate">{user.email}</div>
                                    </div>
                                </div>
                            )}

                            {user?.mobileNo && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <IconPhone className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-gray-500 mb-1">Phone</div>
                                        <div className="text-sm font-medium text-gray-900">{user.mobileNo}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Account Information */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Account Information
                            </h3>

                            {user?.role && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconShield className="h-4 w-4 text-gray-500" />
                                        <div className="text-xs text-gray-500">Role</div>
                                    </div>
                                    <Badge className={`${getRoleColor(user.role)} border`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </Badge>
                                </div>
                            )}

                            {user?.status && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconUser className="h-4 w-4 text-gray-500" />
                                        <div className="text-xs text-gray-500">Status</div>
                                    </div>
                                    <Badge className={`${getStatusColor(user.status)} border`}>
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Account Details */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Account Details
                            </h3>

                            {user?.createdAt && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconCalendar className="h-4 w-4 text-gray-500" />
                                        <div className="text-xs text-gray-500">Member Since</div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(user.createdAt).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose} className="px-4 py-2">
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                onClose();
                                // Navigate to edit page
                                window.location.href = `/users/${user.id}/edit`;
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <IconPencil className="h-4 w-4 mr-2" />
                            Edit User
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const UserTable = ({ onFetchUsers, isLoading, users, totalCount }: { onFetchUsers: (params: TableQueryParams) => void, isLoading: boolean, users: any[], totalCount: number }) => {
    const navigate = useNavigate()
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: true,
        searchPlaceholder: 'Search by Name...',
        filterOptions: [
            {
                field: 'role',
                title: 'Role',
                options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'User', value: 'user' },
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

    const handleViewUser = (user: any) => {
        setSelectedUser(user);
        setShowUserDetails(true);
    };

    const handleCloseUserDetails = () => {
        setShowUserDetails(false);
        setSelectedUser(null);
    };

    return (
        <>
            <ServerSidePaginationTable
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
                                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">{row.original.name}</span>
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
                                <span className="text-sm text-neutral-400 dark:text-neutral-400">{row.original.email}</span>
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
                                <span className="text-sm text-neutral-400 dark:text-neutral-400">{row.original.mobileNo}</span>
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
                                    className="px-2 py-0.5 text-xs capitalize font-semibold bg-gray-100 text-neutral-700 dark:text-neutral-50"
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
                                <span className="text-sm text-neutral-400 dark:text-neutral-400">
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
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewUser(row?.original)}>
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

            {/* User Details Dialog */}
            <UserDetailsDialog
                user={selectedUser}
                isOpen={showUserDetails}
                onClose={handleCloseUserDetails}
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