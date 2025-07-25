import { CategoryForm } from "@/components/categories"

const CategoryCreate = () => {
    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Create Category</h1>
                    <p className='text-sm text-gray-500'>Create a new category in the system.</p>
                </div>
            </div>
            <CategoryForm />
        </div>
    )
}

export default CategoryCreate