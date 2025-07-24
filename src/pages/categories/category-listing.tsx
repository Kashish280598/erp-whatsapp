import { CategoriesListingContainer } from "@/components/categories"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

const CategoryListing = () => {
    const navigate = useNavigate()

    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Categories</h1>
                    <p className='text-sm text-gray-500'>Here are the list of categories in the system.</p>
                </div>
                <Button onClick={() => navigate('/categories/create')}>
                    <IconPlus />
                    Add Category
                </Button>
            </div>
            <CategoriesListingContainer />
        </div>
    )
}

export default CategoryListing