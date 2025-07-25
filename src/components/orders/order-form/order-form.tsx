import { Field, FieldArray, Formik, type FormikHelpers } from "formik"
import { useEffect, useMemo, useState, type FC } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateOrderMutation, useUpdateOrderMutation } from "@/lib/api/orders-api"
import { useLazyGetUsersQuery } from "@/lib/api/users-api"
import { getInitialValues, getPayload, validationSchema, type Order } from "."
import CustomersDropdown from "./customers-dropdown"
import ProductsDropdown from "./products-dropdown"

const OrderForm: FC<{ order?: Order }> = ({ order }) => {
    const [createOrder] = useCreateOrderMutation()
    const [updateOrder] = useUpdateOrderMutation()
    const navigate = useNavigate()
    const initialValues = useMemo(() => getInitialValues(order), [order])
    const [productsList, setProductsList] = useState<any[]>([]);
    const [customersList, setCustomersList] = useState<any[]>([]);
    const [showSummaryDialog, setShowSummaryDialog] = useState(false);
    const [pendingValues, setPendingValues] = useState<any>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    const isEditMode = !!order;

    const [getCustomers, { data: customersData }] = useLazyGetUsersQuery();

    useEffect(() => {
        const params = { page: 1, limit: 20, role: 'user' }
        getCustomers(params)
    }, [getCustomers])

    useEffect(() => {
        if (customersData?.data?.users) {
            const customers = Array.isArray(customersData.data.users)
                ? customersData.data.users.filter((user: any) => !!user?.mobileNo)
                : [];
            setCustomersList(customers);
        }
    }, [customersData])

    // Helper to update productsList from dropdown
    const handleProductsLoaded = (products: any[]) => {
        setProductsList(products);
    };

    const onSubmit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
        if (isEditMode) {
            // In edit mode, directly submit without showing summary dialog
            setSubmitting(true);
            try {
                const payload = getPayload(values, isEditMode);
                const response = await updateOrder({ id: order!.id, payload }).unwrap();

                if (response?.status === 200 || response?.status === 201) {
                    toast.success(response?.message || 'Order updated successfully');
                    navigate('/orders');
                }
            } catch (error: any) {
                toast.error(error?.data?.message || 'Something went wrong');
            } finally {
                setSubmitting(false);
            }
        } else {
            // In create mode, show summary dialog first
            setPendingValues(values);
            setShowSummaryDialog(true);
            setSubmitting(false);
        }
    };

    const handleConfirmOrder = async () => {
        if (!pendingValues) return;

        setIsCreatingOrder(true);
        try {
            let response
            const payload = getPayload(pendingValues, isEditMode)

            if (isEditMode && order) {
                response = await updateOrder({ id: order.id, payload }).unwrap()
            } else {
                response = await createOrder(payload).unwrap()
            }
            if (response?.status === 200 || response?.status === 201) {
                toast.success(response?.message || (isEditMode ? 'Order updated successfully' : 'Order created successfully'))
                navigate('/orders')
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong')
        } finally {
            setIsCreatingOrder(false);
            setShowSummaryDialog(false);
            setPendingValues(null);
        }
    };

    const handleCancelOrder = () => {
        if (isCreatingOrder) return; // Prevent cancellation while creating
        setShowSummaryDialog(false);
        setPendingValues(null);
    };

    // Get customer name for summary
    const getCustomerName = (customerId: string) => {
        if (isEditMode) {
            return order?.Customer?.name || 'Unknown Customer';
        }
        const customer = customersList.find((c: any) => c.mobileNo === customerId);
        return customer?.name || 'Unknown Customer';
    };

    // Get product details for summary
    const getProductDetails = (productId: string) => {
        return productsList.find((p: any) => p.id === productId);
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validationContext={{ isEditMode }}
                onSubmit={onSubmit}
                enableReinitialize>
                {({ errors, touched, isSubmitting, handleSubmit, values, }) => {
                    // Calculate total price (not a hook)
                    const totalPrice = values.items.reduce((sum: number, item: any) => {
                        const product = productsList.find((p: any) => p.id === item.product);
                        if (!product) return sum;
                        return sum + (Number(item.quantity) * Number(product.unitPrice || 0));
                    }, 0);
                    return (
                        <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl p-8 my-3 border border-gray-200">
                            <h2 className="text-2xl font-bold mb-2 text-center text-blue-900">{order ? 'Edit Order' : 'Create Order'}</h2>
                            <p className="text-gray-500 text-center mb-6">
                                {order ? 'Update the order status and payment status.' : 'Fill in the details to create an order.'}
                            </p>

                            {/* Status Fields - Always Editable */}

                            {
                                isEditMode ? (
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <h4 className="font-semibold mb-2 text-blue-800">Order Status</h4>
                                            <Field name="status">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => form.setFieldValue('status', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                                            <SelectItem value="shipped">Shipped</SelectItem>
                                                            <SelectItem value="delivered">Delivered</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </Field>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 text-blue-800">Payment Status</h4>
                                            <Field name="paymentStatus">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => form.setFieldValue('paymentStatus', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select payment status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="paid">Paid</SelectItem>
                                                            <SelectItem value="failed">Failed</SelectItem>
                                                            <SelectItem value="refunded">Refunded</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                ) : undefined
                            }



                            {/* Customer and Products - Read Only in Edit Mode */}
                            {!isEditMode ? (
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-3 md:col-span-1">
                                        <h4 className="font-semibold mb-2 text-blue-800">Customer</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                            <CustomersDropdown />
                                        </div>
                                    </div>
                                    <div className="col-span-3 md:col-span-2">
                                        <div className="">
                                            <h4 className="font-semibold mb-2 text-blue-800">Products</h4>
                                            <FieldArray name="items">
                                                {({ push, remove }) => (
                                                    <div>
                                                        {values.items && values.items.length > 0 ? (
                                                            values.items.map((_: any, index: number) => (
                                                                <div key={index} className="flex flex-col md:flex-row gap-2 items-end mb-3 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
                                                                    <div className="flex-1">
                                                                        <Field name={`items.${index}.product`}>
                                                                            {({ field, form }: any) => (
                                                                                <ProductsDropdown
                                                                                    value={field.value}
                                                                                    onChange={(value: string) => form.setFieldValue(`items.${index}.product`, value)}
                                                                                    error={
                                                                                        touched.items && Array.isArray(touched.items) && touched.items[index]?.product &&
                                                                                        errors.items && Array.isArray(errors.items) &&
                                                                                        errors.items[index] && typeof errors.items[index] === 'object' && !Array.isArray(errors.items[index]) && 'product' in errors.items[index] && (errors.items[index] as any).product
                                                                                    }
                                                                                    touched={!!(touched.items && Array.isArray(touched.items) && touched.items[index]?.product)}
                                                                                    selectedProductIds={values.items.filter((_: any, i: number) => i !== index).map((item: any) => item.product)}
                                                                                    onProductsLoaded={index === 0 ? handleProductsLoaded : undefined}
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                    </div>
                                                                    <div className="w-32">
                                                                        <Field name={`items.${index}.quantity`}>
                                                                            {({ field }: any) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    id={`items.${index}.quantity`}
                                                                                    type="number"
                                                                                    label="Quantity"
                                                                                    placeholder="Qty"
                                                                                    min={1}
                                                                                    error={
                                                                                        touched.items && Array.isArray(touched.items) && touched.items[index]?.quantity &&
                                                                                        errors.items && Array.isArray(errors.items) &&
                                                                                        errors.items[index] && typeof errors.items[index] === 'object' && !Array.isArray(errors.items[index]) && 'quantity' in errors.items[index] && (errors.items[index] as any).quantity
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                    </div>
                                                                    <div className="w-24 flex justify-end">
                                                                        <Button type="button" variant="destructive" onClick={() => remove(index)} disabled={values.items.length === 1} className="w-full md:w-auto">
                                                                            Remove
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : null}
                                                        <Button type="button" variant="outline" onClick={() => push({ product: '', quantity: 1 })} className="mt-2">
                                                            Add Product
                                                        </Button>
                                                        {touched.items && typeof errors.items === 'string' && (
                                                            <div className="text-red-500 text-xs mt-1">{errors.items}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </FieldArray>
                                            <div className="mt-4 text-right font-semibold text-lg">
                                                Total Price: <span className="text-blue-700">₹{totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Read-only display for edit mode */
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2 text-blue-800">Customer Information</h4>
                                        <p className="text-gray-700">{order?.Customer?.name}</p>
                                        <p className="text-sm text-gray-500">GST: {order?.Customer?.gstNo}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-2 text-blue-800">Order Items</h4>
                                        <div className="space-y-2">
                                            {order?.OrderItems?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                                                    <div>
                                                        <p className="font-medium">{item.Product?.name}</p>
                                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">₹{item.unitPrice?.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-500">Total: ₹{item.totalPrice?.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 text-right font-semibold text-lg">
                                            Total Amount: <span className="text-blue-700">₹{order?.amount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/orders')}
                                    variant="outline"
                                    disabled={isSubmitting}
                                    className="px-8 py-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={() => handleSubmit()}
                                    disabled={isSubmitting}
                                    className="px-8 py-2"
                                >
                                    {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Create')}
                                </Button>
                            </div>
                        </div>
                    )
                }}
            </Formik>

            {/* Order Summary Dialog - Only for Create Mode */}
            {!isEditMode && (
                <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Order Summary</DialogTitle>
                            <DialogDescription>
                                Please review your order details before confirming.
                            </DialogDescription>
                        </DialogHeader>
                        {pendingValues && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold">Order Details</h4>
                                        <p><strong>Customer:</strong> {getCustomerName(pendingValues.customer)}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Products</h4>
                                    <div className="space-y-2">
                                        {pendingValues.items.map((item: any, index: number) => {
                                            const product = getProductDetails(item.product);
                                            return (
                                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="font-medium">{product?.name || 'Unknown Product'}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">₹{product?.unitPrice || 0}</p>
                                                        <p className="text-sm text-gray-600">Total: ₹{(product?.unitPrice || 0) * item.quantity}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total Amount:</span>
                                        <span className="text-blue-700">₹{pendingValues.items.reduce((sum: number, item: any) => {
                                            const product = productsList.find((p: any) => p.id === item.product);
                                            if (!product) return sum;
                                            return sum + (Number(item.quantity) * Number(product.unitPrice || 0));
                                        }, 0)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleCancelOrder}
                                disabled={isCreatingOrder}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleConfirmOrder}
                                disabled={isCreatingOrder}
                            >
                                {isCreatingOrder ? 'Creating...' : 'Confirm Order'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default OrderForm