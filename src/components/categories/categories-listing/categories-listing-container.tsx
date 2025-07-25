import { Dialog, DialogType } from "@/components/custom/Dialog"
import { Button } from "@/components/ui/button"
import { useLazyGetCategoriesQuery } from "@/lib/api/categories-api"
import type { TableQueryParams } from "@/types/table.types"
import { IconPlus } from "@tabler/icons-react"
import { useCallback, useMemo, useState } from "react"
import CategoryForm from "../category-form"
import CategoryTable from "./category-table"

const CategoriesListingContainer = () => {
    const [getCategories, { data, isUninitialized, isFetching }] = useLazyGetCategoriesQuery()
    const [isOpen, setIsOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<any>(null)

    const categories = useMemo(() => Array.isArray(data?.data?.categories) ? data?.data?.categories : [], [data?.data?.categories])

    const onFetchCategories = useCallback(
        (params: TableQueryParams) => {
            const $params = {
                page: params?.page,
                limit: params?.limit,

            }
            if (params?.search_text) {
                Object.assign($params, {
                    search: params?.search_text
                })
            }
            if (params?.sort_column && params?.sort_order) {
                Object.assign($params, {
                    sortBy: params?.sort_column,
                    sortOrder: params?.sort_order
                })
            }
            getCategories($params)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )


    return (
        <div>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Categories</h1>
                    <p className='text-sm text-gray-500'>Here are the list of categories in the system.</p>
                </div>
                <Dialog
                    type={DialogType.DEFAULT}
                    icon={<IconPlus className="h-9 w-9 text-[#077D48]" />}
                    title="Add Category"
                    description="Add a new category to the system."
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    children={<CategoryForm onClose={() => setIsOpen(false)} />}
                />
                {/* Edit Category Dialog */}
                <Dialog
                    type={DialogType.DEFAULT}
                    icon={<IconPlus className="h-9 w-9 text-[#077D48]" />}
                    title="Edit Category"
                    description="Edit the selected category."
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    children={<CategoryForm onClose={() => setEditDialogOpen(false)} category={selectedCategory} />}
                />
                <Button onClick={() => setIsOpen(true)}>
                    <IconPlus />
                    Add Category
                </Button>
            </div>

            <CategoryTable
                onFetchCategories={onFetchCategories}
                isLoading={isUninitialized || isFetching}
                categories={categories}
                totalCount={data?.data?.totalCount}
                onEdit={(category: any) => {
                    setSelectedCategory(category);
                    setEditDialogOpen(true);
                }}
            />
        </div>
    )
}

export default CategoriesListingContainer