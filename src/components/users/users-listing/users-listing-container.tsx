import type { TableQueryParams } from "@/types/table.types"
import UserTable from "./user-table"

const UsersListingContainer = () => {

    const onFetchUsers = (params: TableQueryParams) => {
        console.log('onFetchUsers', params)
    }

    return (
        <div>
            <UserTable onFetchUsers={onFetchUsers} isLoading={false} />
        </div>
    )
}

export default UsersListingContainer