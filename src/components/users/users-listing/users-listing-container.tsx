import { useLazyGetUsersQuery } from "@/lib/api/users-api"
import type { TableQueryParams } from "@/types/table.types"
import { useCallback, useMemo } from "react"
import UserTable from "./user-table"

const UsersListingContainer = () => {
    const [getCategories, { data, isUninitialized, isFetching }] = useLazyGetUsersQuery()
    const users = useMemo(() => Array.isArray(data?.data?.users) ? data?.data?.users : [], [data?.data?.users])

    const onFetchUsers = useCallback(
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
            <UserTable onFetchUsers={onFetchUsers} isLoading={isUninitialized || isFetching} users={users} totalCount={data?.data?.totalCount} />
        </div>
    )
}

export default UsersListingContainer