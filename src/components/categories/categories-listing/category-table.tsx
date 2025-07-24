import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/lib/api/categories-api";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryTable = ({ onFetchCategories, isLoading }: { onFetchCategories: (params: TableQueryParams) => void, isLoading: boolean }) => {
    const navigate = useNavigate()
    const [deleteCategory] = useDeleteCategoryMutation()

    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: false,
        searchPlaceholder: 'Search by Name...'
    };

    const [searchTerm, setSearchTerm] = useState('');

    const categories = useMemo(() => [
        {
            id: 1,
            name: 'Category A',
            description: 'Description for Category A',
            created_at: '2025-03-15 09:30:00',
            updated_at: '2025-03-15 09:30:00',
        },
        {
            id: 2,
            name: 'Category B',
            description: 'Description for Category B',
            created_at: '2025-03-15 08:45:00',
            updated_at: '2025-03-15 08:45:00',
        },
    ], [])

    const onDelete = (id: any) => {
        deleteCategory(id).unwrap()
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
                    id: 'actions',
                    header: 'Actions',
                    accessorKey: 'actions',
                    cell: ({ row }) => (
                        <div className="flex gap-2">

                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/categories/${row?.original?.id}/edit`)}>
                                <IconPencil className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <IconTrash className="h-4 w-4 text-red-500" onClick={() => onDelete(row?.original?.id)} />
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
            totalCount={200}
            loading={isLoading}
            tableId="dashboard-categories"
        />
    )
}

export default CategoryTable