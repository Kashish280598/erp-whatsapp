import { useLazyGetCategoriesQuery } from "@/lib/api/categories-api"
import type { TableQueryParams } from "@/types/table.types"
import { useCallback, useMemo } from "react"
import CategoryTable from "./category-table"

const CategoriesListingContainer = () => {
    const [getCategories, { data, isUninitialized, isFetching }] = useLazyGetCategoriesQuery()

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
            <CategoryTable onFetchCategories={onFetchCategories} isLoading={isUninitialized || isFetching} categories={categories} totalCount={data?.data?.totalCount} />
        </div>
    )
}

export default CategoriesListingContainer