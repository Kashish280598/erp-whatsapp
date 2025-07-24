import { CategoryForm } from "@/components/categories"

const CategoryEdit = () => {
    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Edit Category</h1>
                    <p className='text-sm text-gray-500'>Edit the category in the system.</p>
                </div>
            </div>
            <CategoryForm />
        </div>
    )
}

export default CategoryEdit