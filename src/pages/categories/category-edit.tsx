import { CategoryForm } from "@/components/categories"
import { useLazyGetCategoryQuery } from "@/lib/api/categories-api"
import { Loader } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import NotFoundError from "../errors/not-found-error"

const CategoryEdit = () => {
    const { id } = useParams()

    const [getCategory, { data, isUninitialized, isFetching }] = useLazyGetCategoryQuery()

    useEffect(() => {
        if (id) {
            getCategory(id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const category = useMemo(() => data?.data?.category, [data?.data?.category])


    return (
        <div className='pb-5 w-full'>
            <div className='flex justify-between items-center mb-3'>
                <div>
                    <h1 className='text-2xl font-bold'>Edit Category</h1>
                    <p className='text-sm text-gray-500'>Edit the category in the system.</p>
                </div>
            </div>

            {
                isUninitialized || isFetching ? <div className='flex justify-center items-center h-full'>
                    <Loader className="animate-spin" />
                </div> : category ? <CategoryForm category={category} /> : <NotFoundError />
            }


        </div>
    )
}

export default CategoryEdit