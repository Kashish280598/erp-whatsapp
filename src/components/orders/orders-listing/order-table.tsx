import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { ServerSidePaginationTable } from "@/components/custom/table/data-table/server-side-pagination-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderTable = ({ onFetchOrders, isLoading, orders, totalCount }: { onFetchOrders: (params: TableQueryParams) => void, isLoading: boolean, orders: any[], totalCount: number }) => {
    const navigate = useNavigate()


    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: true,
        searchPlaceholder: 'Search by Order ID or Customer...',
        filterOptions: [
            {
                field: 'status',
                title: 'Status',
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Cancelled', value: 'cancelled' },
                ],
            },
            {
                field: 'paymentStatus',
                title: 'Payment Status',
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Paid', value: 'paid' },
                    { label: 'Failed', value: 'failed' },
                    { label: 'Refunded', value: 'refunded' },
                ],
            },
        ],
    };

    const [searchTerm, setSearchTerm] = useState('');



    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    }

    return (
        <ServerSidePaginationTable
            data={orders}
            columns={[
                {
                    id: 'orderId',
                    accessorKey: 'id',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Order ID" />
                    ),
                    cell: ({ row }) => {
                        return (
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">#{row.original.id}</span>
                                    <span className="text-xs text-neutral-400 dark:text-neutral-400">{row.original.OrderItems?.length || 0} items</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'customer',
                    accessorKey: 'Customer.name',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Customer" />
                    ),
                    cell: ({ row }) => {
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 rounded-full border-1 border-[#E4E4E8]">
                                    <AvatarFallback className="rounded-[2px] bg-gray-100 text-gray-600">
                                        {row?.original?.Customer?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">{row.original.Customer?.name}</span>
                                    <span className="text-xs text-neutral-400 dark:text-neutral-400">{row.original.Customer?.gstNo}</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'user',
                    accessorKey: 'User.name',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="POC" />
                    ),
                    cell: ({ row }) => {
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6 rounded-full border-1 border-[#E4E4E8]">
                                    <AvatarFallback className="rounded-[2px] bg-blue-100 text-blue-600">
                                        {row?.original?.User?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">{row.original.User?.name}</span>
                                    <span className="text-xs text-neutral-400 dark:text-neutral-400">{row.original.User?.email}</span>
                                </div>
                            </div>
                        )
                    }
                },
                {
                    id: 'amount',
                    accessorKey: 'amount',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Amount" />
                    ),
                    cell: ({ row }) => (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-200">₹{row.original.amount?.toFixed(2)}</span>
                            <span className="text-xs text-neutral-400 dark:text-neutral-400">{row.original.OrderItems?.length || 0} items</span>
                        </div>
                    )
                },
                {
                    id: 'status',
                    accessorKey: 'status',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Status" />
                    ),
                    cell: ({ row }) => (
                        <Badge
                            variant="secondary"
                            className={`px-2 py-1 text-xs font-medium capitalize ${getStatusColor(row.original.status)}`}
                        >
                            {row.original.status}
                        </Badge>
                    )
                },
                {
                    id: 'paymentStatus',
                    accessorKey: 'paymentStatus',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Payment" />
                    ),
                    cell: ({ row }) => (
                        <Badge
                            variant="secondary"
                            className={`px-2 py-1 text-xs font-medium capitalize ${getPaymentStatusColor(row.original.paymentStatus)}`}
                        >
                            {row.original.paymentStatus}
                        </Badge>
                    )
                },
                {
                    id: 'createdAt',
                    accessorKey: 'createdAt',
                    enableSorting: true,
                    enableHiding: true,
                    header: ({ column }) => (
                        <DataTableColumnHeader column={column} title="Order Date" />
                    ),
                    cell: ({ row }) => {
                        const date = new Date(row.original.createdAt);
                        return (
                            <div className="flex flex-col">
                                <span className="text-sm text-neutral-500 dark:text-neutral-200">
                                    {date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                                <span className="text-xs text-neutral-400 dark:text-neutral-400">
                                    {date.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                        )
                    }
                },
                {
                    id: 'actions',
                    header: 'Actions',
                    accessorKey: 'actions',
                    cell: ({ row }) => (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/orders/${row?.original?.id}`)}>
                                <IconEye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/orders/${row?.original?.id}/edit`)}>
                                <IconPencil className="h-4 w-4 text-gray-500" />
                            </Button>
                        </div>
                    )
                }
            ]}
            tableToolbar={{
                ...tableToolbar,
                searchTerm,
                setSearchTerm,
            }}
            fetchData={onFetchOrders}
            totalCount={totalCount}
            loading={isLoading}
            tableId="orders-table"
        />
    )
}

export default OrderTable