import { Button } from "@/components/ui/button"
import { UsersListingContainer } from "@/components/users"
import { IconPlus } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

const UserListing = () => {
    const navigate = useNavigate()


    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Users</h1>
                    <p className='text-sm text-gray-500'>Here are the list of users in the system.</p>
                </div>
                <Button onClick={() => navigate('/users/create')}>
                    <IconPlus />
                    Add User
                </Button>
            </div>
            <UsersListingContainer />
        </div>
    )
}

export default UserListing