import { Field, FieldArray, Formik, type FormikHelpers } from "formik"
import { useEffect, useMemo, useState, type FC } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCreateOrderMutation, useUpdateOrderMutation } from "@/lib/api/orders-api"
import { useLazyGetUsersQuery } from "@/lib/api/users-api"
import { getInitialValues, getPayload, type Order } from "."
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
        // Show summary dialog first
        setPendingValues(values);
        setShowSummaryDialog(true);
        setSubmitting(false);
    };

    const handleConfirmOrder = async () => {
        if (!pendingValues) return;

        setIsCreatingOrder(true);
        try {
            let response
            const payload = getPayload(pendingValues)

            if (order) {
                response = await updateOrder({ id: order?.id, payload }).unwrap()
            } else {
                response = await createOrder(payload).unwrap()
            }
            if (response?.status === 200 || response?.status === 201) {
                toast.success(response?.message)
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
                // validationSchema={validationSchema}
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
                        <div className="grid grid-cols-3 gap-4 mx-auto">
                            <div>
                                <CustomersDropdown />
                            </div>
                            <div className="col-span-3">
                                <FieldArray name="items">
                                    {({ push, remove }) => (
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Products</label>
                                            {values.items && values.items.length > 0 ? (
                                                values.items.map((_: any, index: number) => (
                                                    <div key={index} className="flex gap-2 items-end mb-2">
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
                                                                    touched={touched.items && Array.isArray(touched.items) && touched.items[index]?.product}
                                                                    selectedProductIds={values.items.filter((_: any, i: number) => i !== index).map((item: any) => item.product)}
                                                                    onProductsLoaded={index === 0 ? handleProductsLoaded : undefined}
                                                                />
                                                            )}
                                                        </Field>
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
                                                        <Button type="button" variant="destructive" onClick={() => remove(index)} disabled={values.items.length === 1}>
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : null}
                                            <Button type="button" variant="outline" onClick={() => push({ product: '', quantity: 1 })}>
                                                Add Product
                                            </Button>
                                            {touched.items && typeof errors.items === 'string' && (
                                                <div className="text-red-500 text-xs mt-1">{errors.items}</div>
                                            )}
                                        </div>
                                    )}
                                </FieldArray>
                                <div className="mt-4 col-span-3 text-right font-semibold text-lg">
                                    Total Price: ₹{totalPrice}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/orders')}
                                    variant="outline"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={() => handleSubmit()}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create'}
                                </Button>
                            </div>

                            {/* Order Summary Dialog */}
                            <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Order Summary</DialogTitle>
                                        <DialogDescription>
                                            Please review your order details before confirming.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {pendingValues && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-semibold">Order Details</h4>
                                                    {/* <p><strong>Order Name:</strong> {pendingValues.name}</p> */}
                                                    <p><strong>Customer:</strong> {getCustomerName(pendingValues.customer)}</p>
                                                    {/* <p><strong>Status:</strong> {pendingValues.status}</p> */}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Products</h4>
                                                <div className="space-y-2">
                                                    {pendingValues.items.map((item: any, index: number) => {
                                                        const product = getProductDetails(item.product);
                                                        return (
                                                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
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
                                                    <span>₹{pendingValues.items.reduce((sum: number, item: any) => {
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
                        </div>
                    )
                }}
            </Formik>


        </>
    )
}

export default OrderForm