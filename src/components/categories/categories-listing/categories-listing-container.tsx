import { useLazyGetCategoriesQuery } from "@/lib/api/categories-api"
import type { TableQueryParams } from "@/types/table.types"
import CategoryTable from "./category-table"

const CategoriesListingContainer = () => {
    const [getCategories, { isUninitialized, isFetching }] = useLazyGetCategoriesQuery()


    const onFetchCategories = (params: TableQueryParams) => {
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
    }

    return (
        <div>
            <CategoryTable onFetchCategories={onFetchCategories} isLoading={isUninitialized || isFetching} />
        </div>
    )
}

export default CategoriesListingContainer