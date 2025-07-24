import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Formik, type FormikHelpers } from "formik"
import { useMemo, type FC } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { getInitialValues, getPayload, validationSchema, type User } from "."
import { useCreateUserMutation, useUpdateUserMutation } from "../users-api"

const UserForm: FC<{ user?: User }> = ({ user }) => {
    const [createUser] = useCreateUserMutation()
    const [updateUser] = useUpdateUserMutation()
    const navigate = useNavigate()
    const initialValues = useMemo(() => getInitialValues(user), [user])

    const onSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
        try {
            let response
            const payload = getPayload(values)
            if (user) {
                response = await updateUser({ id: user?.id, payload }).unwrap()
            } else {
                response = await createUser(payload).unwrap()
            }
            if (response?.status === 200) {
                toast.success(response?.message)
                navigate('/users')
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
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Field name="name">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="name"
                                    type="text"
                                    label="Name"
                                    placeholder="Enter your name"
                                    error={touched.name && errors.name}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="email">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    label="Email"
                                    placeholder="Enter your email address"
                                    error={touched.email && errors.email}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="role">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="role"
                                    type="text"
                                    label="Role"
                                    placeholder="Enter your role"
                                    error={touched.role && errors.role}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting}
                            className="w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {isSubmitting ? 'Signing in...' : 'Continue'}
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    )
}

export default UserForm