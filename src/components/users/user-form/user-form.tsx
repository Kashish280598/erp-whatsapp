import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, Formik, type FormikHelpers } from "formik"
import { ArrowLeft, Loader2, Lock, Mail, Phone, Save, Shield, User as UserIcon } from "lucide-react"
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
        <div className=" mx-auto">
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/users')}
                        className="hover:bg-white/80 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Button>
                </div>

            </div>
            <div className="flex justify-between gap-8">
                {/* Header Section */}
                <div className="py-8">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {user ? 'Edit User' : 'Create New User'}
                        </h1>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {user
                                ? 'Update user information and permissions'
                                : 'Add a new user to your system with appropriate roles and permissions'
                            }
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            User Information
                        </h2>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize>
                        {({ errors, touched, isSubmitting, handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Personal Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-blue-500" />
                                        Personal Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field name="name">
                                            {({ field }: any) => (
                                                <Input
                                                    {...field}
                                                    id="name"
                                                    type="text"
                                                    label="Full Name"
                                                    placeholder="Enter full name"
                                                    error={touched.name && errors.name}
                                                    startIcon={<UserIcon className="h-4 w-4" />}
                                                />
                                            )}
                                        </Field>

                                        <Field name="mobileNo">
                                            {({ field }: any) => (
                                                <Input
                                                    {...field}
                                                    id="mobileNo"
                                                    type="text"
                                                    label="Phone Number"
                                                    placeholder="Enter phone number"
                                                    error={touched.mobileNo && errors.mobileNo}
                                                    startIcon={<Phone className="h-4 w-4" />}
                                                />
                                            )}
                                        </Field>
                                    </div>

                                    <Field name="email">
                                        {({ field }: any) => (
                                            <Input
                                                {...field}
                                                id="email"
                                                type="email"
                                                label="Email Address"
                                                placeholder="Enter email address"
                                                error={touched.email && errors.email}
                                                startIcon={<Mail className="h-4 w-4" />}
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Security Section */}
                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-green-500" />
                                        Security & Access
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field name="password">
                                            {({ field }: any) => (
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    label="Password"
                                                    placeholder="Enter password"
                                                    error={touched.password && errors.password}
                                                    startIcon={<Lock className="h-4 w-4" />}
                                                />
                                            )}
                                        </Field>

                                        <Field name="role">
                                            {({ field }: any) => (
                                                <div>
                                                    <label htmlFor="role" className="text-[13px] font-[600] text-neutral-500 leading-5 mb-2 flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        User Role
                                                    </label>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange(field.name)}
                                                    >
                                                        <SelectTrigger aria-label="Role" className="w-full h-9 border-neutral-200 focus:ring-1 focus:ring-primary focus:border-primary">
                                                            <SelectValue placeholder="Select user role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin" className="flex items-center gap-2">
                                                                <Shield className="h-4 w-4 text-red-500" />
                                                                Admin
                                                            </SelectItem>
                                                            <SelectItem value="user" className="flex items-center gap-2">
                                                                <UserIcon className="h-4 w-4 text-blue-500" />
                                                                User
                                                            </SelectItem>
                                                            <SelectItem value="sales" className="flex items-center gap-2">
                                                                <UserIcon className="h-4 w-4 text-green-500" />
                                                                Sales
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                    <Button
                                        type="button"
                                        onClick={() => navigate('/users')}
                                        variant="outline"
                                        className="flex-1 h-11 text-gray-700 hover:bg-gray-50 border-gray-200"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 h-11"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                {user ? 'Update User' : 'Create User'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>


        </div>
    )
}

export default UserForm