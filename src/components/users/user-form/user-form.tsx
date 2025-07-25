import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, Formik, type FormikHelpers } from "formik"
import { useMemo, type FC } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { getInitialValues, getPayload, validationSchema, type User } from "."
import { useCreateUserMutation, useUpdateUserMutation } from "../../../lib/api/users-api"

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
                <div className="grid grid-cols-1 gap-4 max-w-[500px] mx-auto">
                    <div>
                        <Field name="name">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="name"
                                    type="text"
                                    label="Name"
                                    placeholder="Enter name"
                                    error={touched.name && errors.name}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="mobileNo">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="mobileNo"
                                    type="text"
                                    label="Phone Number"
                                    placeholder="Enter phone number"
                                    error={touched.mobileNo && errors.mobileNo}
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
                                    placeholder="Enter email address"
                                    error={touched.email && errors.email}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="password">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    label="Password"
                                    placeholder="Enter password"
                                    error={touched.password && errors.password}
                                />
                            )}
                        </Field>
                    </div>

                    <div>
                        <Field name="role">
                            {({ field }: any) => (
                                <div>
                                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange(field.name)}
                                    >
                                        <SelectTrigger aria-label="Role" className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="sales">Sales</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </Field>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button
                            type="button"
                            onClick={() => navigate('/users')}
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

export default UserForm