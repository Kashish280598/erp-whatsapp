/* eslint-disable react-hooks/exhaustive-deps */
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLazyGetCustomerPOCsQuery } from "@/lib/api/orders-api"
import { Field } from "formik"
import { useEffect, useMemo } from "react"

const UsersDropdown = ({ customerId }: { customerId: string }) => {
    const [getCustomers, { data, isFetching }] = useLazyGetCustomerPOCsQuery()
    useEffect(() => {
        if (customerId) {
            const params = { page: 1, limit: 20 }
            getCustomers({ params, id: customerId })
        }
    }, [customerId])

    const customers = useMemo(() => Array.isArray(data?.data?.users) ? data?.data?.users : [], [data?.data?.users])

    return (
        <Field name="user">
            {({ field, form }: any) => {
                return (
                    <div>
                        <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-700">Point of Contact</label>
                        <Select
                            value={field.value}
                            onValueChange={value => form.setFieldValue('user', value)}
                            disabled={isFetching}
                        >
                            <SelectTrigger aria-label="Status" className="w-full text-left">
                                {(() => {
                                    if (!field.value) {
                                        return <SelectValue placeholder={isFetching ? "Loading..." : "Select status"} />;
                                    }
                                    const selected = customers.find((c: any) => c.mobileNo?.toString() === field.value?.toString());

                                    return <span>{selected?.name || "No Name"}</span>;
                                })()}
                            </SelectTrigger>
                            <SelectContent>
                                {isFetching ? (
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
                        {form.touched.user && form.errors.user && (
                            <div className="text-red-500 text-xs mt-1">{form.errors.user}</div>
                        )}
                    </div>
                )
            }}
        </Field>
    )
}

export default UsersDropdown