import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyGetCategoriesQuery } from "@/lib/api/categories-api"
import { Field } from "formik"
import { useEffect, useMemo } from "react"

const CategoryDropdown = () => {
    const [getCategories, { data, isUninitialized, isFetching }] = useLazyGetCategoriesQuery()

    useEffect(() => {
        const params = { page: 1, limit: 20 }
        getCategories(params)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const categories = useMemo(() => Array.isArray(data?.data?.categories) ? data?.data?.categories : [], [data?.data?.categories])

    return (
        <Field name="category">
            {({ field, form }: any) => (
                <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                    <Select
                        value={field.value}
                        onValueChange={value => form.setFieldValue('category', value)}
                        disabled={isUninitialized || isFetching}
                    >
                        <SelectTrigger aria-label="Category" className="w-full text-left">
                            <SelectValue placeholder={isUninitialized || isFetching ? "Loading..." : "Select category"} />
                        </SelectTrigger>
                        <SelectContent>
                            {isUninitialized || isFetching ? (
                                // @ts-ignore
                                <SelectItem value={null} disabled>
                                    <div className="flex items-center justify-center">
                                        Loading...
                                    </div>
                                </SelectItem>
                            ) : (
                                categories?.map((category: any) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{category.name}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {form.touched.category && form.errors.category && (
                        <div className="text-red-500 text-xs mt-1">{form.errors.category}</div>
                    )}
                </div>
            )}
        </Field>
    )
}

export default CategoryDropdown