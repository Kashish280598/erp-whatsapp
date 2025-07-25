import { Field, Formik, type FormikHelpers } from "formik"
import { useMemo, type FC } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import CategoryDropdown from "@/components/categories/category-dropdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateOrderMutation, useUpdateOrderMutation } from "@/lib/api/orders-api"
import { getInitialValues, getPayload, validationSchema, type Order } from "."
import CustomersDropdown from "./customers-dropdown"


const OrderForm: FC<{ order?: Order }> = ({ order }) => {
    const [createOrder] = useCreateOrderMutation()
    const [updateOrder] = useUpdateOrderMutation()
    const navigate = useNavigate()
    const initialValues = useMemo(() => getInitialValues(order), [order])

    const onSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
        try {
            let response
            const payload = getPayload(values)
            if (order) {
                response = await updateOrder({ id: order?.id, payload }).unwrap()
            } else {
                response = await createOrder(payload).unwrap()
            }
            if (response?.status === 200) {
                toast.success(response?.message)
                navigate('/orders')
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
            {({ errors, touched, isSubmitting, handleSubmit, values, setFieldValue }) => (
                <div className="grid grid-cols-1 gap-4 max-w-[500px] mx-auto">
                    <div>
                        <CustomersDropdown />
                    </div>
                    <div>
                        <CategoryDropdown />
                    </div>
                    <div>
                        <Field name="name">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="name"
                                    type="text"
                                    label="Order Name"
                                    placeholder="Enter order name"
                                    error={touched.name && errors.name}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="customer">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="customer"
                                    type="text"
                                    label="Customer"
                                    placeholder="Enter customer name"
                                    error={touched.customer && errors.customer}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="status">
                            {({ field }: any) => (
                                <div>
                                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                                    <Select
                                        value={field.value}
                                        onValueChange={value => setFieldValue('status', value)}
                                    >
                                        <SelectTrigger aria-label="Status" className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {touched.status && errors.status && (
                                        <div className="text-red-500 text-xs mt-1">{errors.status}</div>
                                    )}
                                </div>
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="total">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="total"
                                    type="number"
                                    label="Total Amount"
                                    placeholder="Enter total amount"
                                    error={touched.total && errors.total}
                                />
                            )}
                        </Field>
                    </div>
                    <div>
                        <Field name="items">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    id="items"
                                    type="text"
                                    label="Items (comma separated)"
                                    placeholder="Enter items, separated by commas"
                                    value={values.items.join(', ')}
                                    onChange={e => setFieldValue('items', e.target.value.split(',').map((item: string) => item.trim()))}
                                    error={touched.items && errors.items}
                                />
                            )}
                        </Field>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button
                            type="button"
                            onClick={() => navigate('/orders')}
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

export default OrderForm