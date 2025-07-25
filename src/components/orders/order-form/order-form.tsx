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
import { AlertCircle, ArrowLeft, CheckCircle, CreditCard, Loader2, Package, Plus, Save, ShoppingCart, Trash2, Truck, User, XCircle } from "lucide-react"
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
            <div className="mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/orders')}
                        className="hover:bg-white/80 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Orders
                    </Button>
                </div>

                <div className="flex justify-between gap-8">
                    <div className="py-8">
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {order ? 'Edit Order' : 'Create New Order'}
                            </h1>
                            <p className="text-gray-600 max-w-md mx-auto">
                                {order
                                    ? 'Update order status and payment information'
                                    : 'Create a new order with customer details and products'
                                }
                            </p>
                        </div>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        validationContext={{ isEditMode }}
                        onSubmit={onSubmit}
                        enableReinitialize>
                        {({ errors, touched, isSubmitting, values, }) => {
                            // Calculate total price (not a hook)
                            const totalPrice = values.items.reduce((sum: number, item: any) => {
                                const product = productsList.find((p: any) => p.id === item.product);
                                if (!product) return sum;
                                return sum + (Number(item.quantity) * Number(product.unitPrice || 0));
                            }, 0);
                            return (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
                                    <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4">
                                        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                                            <ShoppingCart className="h-5 w-5" />
                                            Order Information
                                        </h2>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Status Fields - Always Editable in Edit Mode */}
                                        {isEditMode && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-blue-500" />
                                                    Order Status
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[13px] font-[600] text-neutral-500 leading-5 mb-2 flex items-center gap-2">
                                                            <Package className="h-4 w-4" />
                                                            Order Status
                                                        </label>
                                                        <Field name="status">
                                                            {({ field, form }: any) => (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={(value) => form.setFieldValue('status', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-9 border-neutral-200 focus:ring-1 focus:ring-primary focus:border-primary">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="pending" className="flex items-center gap-2">
                                                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                                            Pending
                                                                        </SelectItem>
                                                                        <SelectItem value="confirmed" className="flex items-center gap-2">
                                                                            <CheckCircle className="h-4 w-4 text-blue-500" />
                                                                            Confirmed
                                                                        </SelectItem>
                                                                        <SelectItem value="shipped" className="flex items-center gap-2">
                                                                            <Truck className="h-4 w-4 text-purple-500" />
                                                                            Shipped
                                                                        </SelectItem>
                                                                        <SelectItem value="delivered" className="flex items-center gap-2">
                                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                                            Delivered
                                                                        </SelectItem>
                                                                        <SelectItem value="cancelled" className="flex items-center gap-2">
                                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                                            Cancelled
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <div>
                                                        <label className="text-[13px] font-[600] text-neutral-500 leading-5 mb-2 flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" />
                                                            Payment Status
                                                        </label>
                                                        <Field name="paymentStatus">
                                                            {({ field, form }: any) => (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={(value) => form.setFieldValue('paymentStatus', value)}
                                                                >
                                                                    <SelectTrigger className="w-full h-9 border-neutral-200 focus:ring-1 focus:ring-primary focus:border-primary">
                                                                        <SelectValue placeholder="Select payment status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="pending" className="flex items-center gap-2">
                                                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                                            Pending
                                                                        </SelectItem>
                                                                        <SelectItem value="paid" className="flex items-center gap-2">
                                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                                            Paid
                                                                        </SelectItem>
                                                                        <SelectItem value="failed" className="flex items-center gap-2">
                                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                                            Failed
                                                                        </SelectItem>
                                                                        <SelectItem value="refunded" className="flex items-center gap-2">
                                                                            <ArrowLeft className="h-4 w-4 text-orange-500" />
                                                                            Refunded
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        </Field>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Customer and Products Section */}
                                        {!isEditMode ? (
                                            <div className="space-y-6">
                                                {/* Customer Section */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                        <User className="h-5 w-5 text-blue-500" />
                                                        Customer Information
                                                    </h3>
                                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                        <CustomersDropdown />
                                                    </div>
                                                </div>

                                                {/* Products Section */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                        <Package className="h-5 w-5 text-green-500" />
                                                        Products & Items
                                                    </h3>
                                                    <FieldArray name="items">
                                                        {({ push, remove }) => (
                                                            <div className="space-y-4">
                                                                {values.items && values.items.length > 0 ? (
                                                                    values.items.map((_: any, index: number) => (
                                                                        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
                                                                            <div className="flex flex-col md:flex-row gap-4 items-end">
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
                                                                                <div className="w-auto">
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="destructive"
                                                                                        onClick={() => remove(index)}
                                                                                        disabled={values.items.length === 1}
                                                                                        className="h-9 px-3"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : null}
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => push({ product: '', quantity: 1 })}
                                                                    className="w-full h-11 border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Add Product
                                                                </Button>
                                                                {touched.items && typeof errors.items === 'string' && (
                                                                    <div className="text-red-500 text-xs mt-1">{errors.items}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                </div>

                                                {/* Total Price */}
                                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                                    <div className="text-right">
                                                        <span className="text-lg font-semibold text-gray-700">Total Price: </span>
                                                        <span className="text-2xl font-bold text-blue-700">₹{totalPrice.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Read-only display for edit mode */
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                        <User className="h-5 w-5 text-blue-500" />
                                                        Customer Information
                                                    </h3>
                                                    <p className="text-gray-700 font-medium">{order?.Customer?.name}</p>
                                                    <p className="text-sm text-gray-500">GST: {order?.Customer?.gstNo}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                        <Package className="h-5 w-5 text-green-500" />
                                                        Order Items
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {order?.OrderItems?.map((item: any) => (
                                                            <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                                                <div>
                                                                    <p className="font-medium text-gray-800">{item.Product?.name}</p>
                                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-medium text-gray-800">₹{item.unitPrice?.toFixed(2)}</p>
                                                                    <p className="text-sm text-gray-500">Total: ₹{item.totalPrice?.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <div className="text-right">
                                                            <span className="text-lg font-semibold text-gray-700">Total Amount: </span>
                                                            <span className="text-2xl font-bold text-blue-700">₹{order?.amount?.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                            <Button
                                                type="button"
                                                onClick={() => navigate('/orders')}
                                                variant="outline"
                                                disabled={isSubmitting}
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
                                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        {isEditMode ? 'Update Order' : 'Create Order'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }}
                    </Formik>
                </div>




            </div>

            {/* Order Summary Dialog - Only for Create Mode */}
            {!isEditMode && (
                <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-blue-500" />
                                Order Summary
                            </DialogTitle>
                            <DialogDescription>
                                Please review your order details before confirming.
                            </DialogDescription>
                        </DialogHeader>
                        {pendingValues && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Order Details
                                    </h4>
                                    <p><strong>Customer:</strong> {getCustomerName(pendingValues.customer)}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Products
                                    </h4>
                                    <div className="space-y-3">
                                        {pendingValues.items.map((item: any, index: number) => {
                                            const product = getProductDetails(item.product);
                                            return (
                                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{product?.name || 'Unknown Product'}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-800">₹{product?.unitPrice || 0}</p>
                                                        <p className="text-sm text-gray-600">Total: ₹{(product?.unitPrice || 0) * item.quantity}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span className="text-gray-700">Total Amount:</span>
                                        <span className="text-blue-700">₹{pendingValues.items.reduce((sum: number, item: any) => {
                                            const product = productsList.find((p: any) => p.id === item.product);
                                            if (!product) return sum;
                                            return sum + (Number(item.quantity) * Number(product.unitPrice || 0));
                                        }, 0).toFixed(2)}</span>
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
                                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                            >
                                {isCreatingOrder ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirm Order
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default OrderForm