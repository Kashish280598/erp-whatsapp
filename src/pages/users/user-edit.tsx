import { UserForm } from "@/components/users"

const UserEdit = () => {
    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Edit User</h1>
                    <p className='text-sm text-gray-500'>Edit the user in the system.</p>
                </div>
            </div>
            <UserForm />
        </div>
    )
}

export default UserEdit