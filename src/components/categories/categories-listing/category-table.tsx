import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/lib/api/categories-api";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { formatDate } from "date-fns";
import { useState } from "react";
import Swal from 'sweetalert2';

const CategoryTable = ({ onFetchCategories, isLoading, categories, totalCount, onEdit }: { onFetchCategories: (params: TableQueryParams) => void, isLoading: boolean, categories: any[], totalCount: number, onEdit?: (category: any) => void }) => {
    const [deleteCategory] = useDeleteCategoryMutation()

    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: false,
        searchPlaceholder: 'Search by Name...'
    };

    const [searchTerm, setSearchTerm] = useState('');

    const onDelete = async (id: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Yes'
        });
        if (result.isConfirmed) {
            const response = await deleteCategory(id).unwrap();
            if (response?.status === 200) {
                Swal.fire('Deleted!', 'The category has been deleted.', 'success');
            }
        }
    }

    const handleEdit = async (category: any) => {
        if (onEdit) {
            onEdit(category);
        }
    }

    return (
        <DataTable
            data={categories}
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
                    cell: ({ row }) => (
                        <span className="text-sm font-medium text-gray-900">{row.original.name}</span>
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
                    cell: ({ row }) => (
                        <span className="text-sm font-medium text-gray-900">{formatDate(row.original.createdAt, 'MMM d, yyyy')}</span>
                    )
                },
                {
                    id: 'actions',
                    header: 'Actions',
                    accessorKey: 'actions',
                    cell: ({ row }) => (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(row?.original)}>
                                <IconPencil className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(row?.original?.id)}>
                                <IconTrash className="h-4 w-4 text-red-500" />
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
            fetchData={onFetchCategories}
            totalCount={totalCount}
            loading={isLoading}
            tableId="dashboard-categories"
        />
    )
}

export default CategoryTable