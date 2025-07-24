import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Formik, type FormikHelpers } from "formik"
import { useMemo, type FC } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { getInitialValues, getPayload, validationSchema, type Category } from "."
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "../../../lib/api/categories-api"

const CategoryForm: FC<{ category?: Category }> = ({ category }) => {
    const [createCategory] = useCreateCategoryMutation()
    const [updateCategory] = useUpdateCategoryMutation()
    const navigate = useNavigate()
    const initialValues = useMemo(() => getInitialValues(category), [category])

    const onSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
        try {
            let response
            const payload = getPayload(values)
            if (category) {
                response = await updateCategory({ id: category?.id, payload }).unwrap()
            } else {
                response = await createCategory(payload).unwrap()
            }
            if (response?.status === 200) {
                toast.success(response?.message)
                navigate('/categories')
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize>
            {({ errors, touched, isSubmitting, handleSubmit }) => (
                <div className="grid grid-cols-1 gap-4 max-w-[500px] mx-auto">
                    <div>
                        <Field name="name">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="name"
                                    type="text"
                                    label="Name"
                                    placeholder="Enter category name"
                                    error={touched.name && errors.name}
                                />
                            )}
                        </Field>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button
                            type="button"
                            onClick={() => navigate('/categories')}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    )
}

export default CategoryForm