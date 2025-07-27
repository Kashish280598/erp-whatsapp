import { UserForm } from "@/components/users"
import { useLazyGetUserQuery } from "@/lib/api/users-api"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import NotFoundError from "../errors/not-found-error"

const UserEdit = () => {
    const { id } = useParams()
    const [getUser, { data, isUninitialized, isFetching }] = useLazyGetUserQuery()

    useEffect(() => {
        getUser(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const user = useMemo(() => data?.data, [data])

    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold text-neutral-800 dark:text-primary-400'>Edit User</h1>
                    <p className='text-sm text-gray-500'>Edit the user in the system.</p>
                </div>
            </div>

            {isUninitialized || isFetching ? <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div> : user ? <UserForm user={user} /> : <NotFoundError />}
        </div>
    )
}

export default UserEdit