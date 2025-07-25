import { DataTable } from "@/components/custom/table/data-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/lib/api/categories-api";
import type { TableQueryParams, TableToolbar } from "@/types/table.types";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { formatDate } from "date-fns";
import { useState } from "react";

const CategoryTable = ({ onFetchCategories, isLoading, categories, totalCount, onEdit }: { onFetchCategories: (params: TableQueryParams) => void, isLoading: boolean, categories: any[], totalCount: number, onEdit?: (category: any) => void }) => {
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

    const tableToolbar: TableToolbar = {
        enableSearch: true,
        enableFilter: false,
        searchPlaceholder: 'Search by Name...'
    };

    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteClick = (category: any) => {
        setCategoryToDelete(category);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete?.id) return;

        try {
            const response = await deleteCategory(categoryToDelete.id).unwrap();
            if (response?.status === 200) {
                setShowDeleteConfirm(false);
                setCategoryToDelete(null);
            }
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
    };

    const handleEdit = async (category: any) => {
        if (onEdit) {
            onEdit(category);
        }
    }

    return (
        <>
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
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(row?.original)}>
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

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <IconTrash className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Category</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete category <span className="font-semibold">{categoryToDelete?.name}</span>?
                            This will permanently remove the category and all its associated data.
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
                                {isDeleting ? 'Deleting...' : 'Delete Category'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CategoryTable