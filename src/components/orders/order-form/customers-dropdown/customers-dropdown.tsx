/* eslint-disable react-hooks/exhaustive-deps */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyGetUsersQuery } from "@/lib/api/users-api"
import { Field } from "formik"
import { useEffect, useMemo } from "react"

const CustomersDropdown = () => {
    const [getCustomers, { data, isUninitialized, isFetching }] = useLazyGetUsersQuery()
    useEffect(() => {
        const params = { page: 1, limit: 20, role: 'user' }
        getCustomers(params)
    }, [])

    const customers = useMemo(() => Array.isArray(data?.data?.users) ? data?.data?.users.filter((user: any) => !!user?.mobileNo) : [], [data?.data?.users])

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
                            {(() => {
                                if (!field.value) {
                                    return <SelectValue placeholder={isUninitialized || isFetching ? "Loading..." : "Select status"} />;
                                }
                                const selected = customers.find((c: any) => c.mobileNo === field.value);
                                return <span>{selected?.name || "No Name"}</span>;
                            })()}
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
                                    <SelectItem key={customer?.mobileNo} value={customer?.mobileNo}>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{customer?.name || 'No Name'}</span>
                                            <span className="text-xs text-gray-500">{customer?.email}</span>
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