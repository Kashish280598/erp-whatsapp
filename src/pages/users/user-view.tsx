import { useLazyGetUserQuery } from "@/lib/api/users-api"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import NotFoundError from "../errors/not-found-error"

const UserView = () => {
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
                    <h1 className='text-2xl font-bold'>View User</h1>
                    <p className='text-sm text-gray-500'>View the user in the system.</p>
                </div>
            </div>
            {isUninitialized || isFetching ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
            ) : !user ? (
                <NotFoundError />
            ) : (
                <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Name</div>
                        <div className="text-lg font-semibold">{user.name}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Email</div>
                        <div className="text-base">{user.email}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Phone Number</div>
                        <div className="text-base">{user.mobileNo || '-'}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Role</div>
                        <div className="text-base capitalize">{user.role}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Status</div>
                        <div className="text-base capitalize">{user.status}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-1">Created At</div>
                        <div className="text-base">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserView