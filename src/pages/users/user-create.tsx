import { UserForm } from "@/components/users"

const UserCreate = () => {

    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Create User</h1>
                    <p className='text-sm text-gray-500'>Create a new user in the system.</p>
                </div>
            </div>
            <UserForm />
        </div>
    )
}

export default UserCreate