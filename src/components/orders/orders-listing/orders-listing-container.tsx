import { useLazyGetOrdersQuery } from "@/lib/api/orders-api"
import type { TableQueryParams } from "@/types/table.types"
import { useCallback, useMemo } from "react"
import OrderTable from "./order-table"

const OrdersListingContainer = () => {
    const [getOrders, { data, isUninitialized, isFetching }] = useLazyGetOrdersQuery()
    const orders = useMemo(() => Array.isArray(data?.data?.orders) ? data?.data?.orders : [], [data?.data?.orders])

    const onFetchOrders = useCallback(
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

            // Handle filters
            if (params?.filters && params.filters.length > 0) {
                params.filters.forEach((filter: any) => {
                    if (filter.id && filter.value && Array.isArray(filter.value)) {
                        console.log('filter', filter)
                        Object.assign($params, {
                            [filter.id]: filter.value.join(',')
                        })
                    }
                })
            }
            getOrders($params)
        },
        [getOrders],
    )

    return (
        <div>
            <OrderTable
                onFetchOrders={onFetchOrders}
                isLoading={isUninitialized || isFetching}
                orders={orders}
                totalCount={data?.data?.totalCount}
            />
        </div>
    )
}

export default OrdersListingContainer