import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyGetCustomersQuery } from "@/lib/api/orders-api"
import { Field } from "formik"
import { useEffect, useMemo } from "react"

const CustomersDropdown = () => {
    const [getCustomers, { data, isUninitialized, isFetching }] = useLazyGetCustomersQuery()

    useEffect(() => {
        const params = { page: 1, limit: 20 }
        getCustomers(params)
    }, [])

    const customers = useMemo(() => Array.isArray(data?.data?.customers) ? data?.data?.customers : [], [data?.data?.customers])



    return (
        <Field name="customer">
            {({ field, form }: any) => (
                <div>
                    <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-700">Customer</label>
                    <Select
                        value={field.value}
                        onValueChange={value => form.setFieldValue('customer', value)}
                        disabled={isUninitialized || isFetching}
                    >
                        <SelectTrigger aria-label="Status" className="w-full text-left">
                            <SelectValue placeholder={isUninitialized || isFetching ? "Loading..." : "Select status"} />
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
                                customers?.map((customer: any) => (
                                    <SelectItem key={customer.id} value={customer.id}>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{customer.name}</span>
                                            <span className="text-xs text-gray-500">{customer.address}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {form.touched.customer && form.errors.customer && (
                        <div className="text-red-500 text-xs mt-1">{form.errors.customer}</div>
                    )}
                </div>
            )}
        </Field>
    )
}

export default CustomersDropdown