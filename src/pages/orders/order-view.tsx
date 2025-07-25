import Loader from '@/components/Loader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDeleteOrderMutation, useLazyGetOrderQuery } from '@/lib/api/orders-api';
import { IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OrderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [getOrder, { data, isLoading, error }] = useLazyGetOrderQuery();
    const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            getOrder(id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const order = data?.data?.order;

    const handleDeleteOrder = async () => {
        if (!order?.id) return;

        try {
            await deleteOrder(order.id).unwrap();
            navigate('/orders');
        } catch (error) {
            console.error('Failed to delete order:', error);
            // You can add toast notification here if you have a toast system
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 w-full my-8">
                <Loader />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center h-64 w-full my-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-4">The order you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate('/orders')}>
                    <IconArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                </Button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className='pb-5 w-full space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/orders')}
                        className="h-8 w-8"
                    >
                        <IconArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className='text-2xl font-bold'>Order #{order.id}</h1>
                        <p className='text-sm text-gray-500'>Order details and information</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/orders/${order.id}/edit`)}>
                        <IconEdit className="h-4 w-4 mr-2" />
                        Edit Order
                    </Button>
                    {/* <Button
                        variant="destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                    >
                        <IconTrash className="h-4 w-4 mr-2" />
                        {isDeleting ? 'Deleting...' : 'Delete Order'}
                    </Button> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Order Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Status Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Order Status
                                <div className="flex gap-2">
                                    <Badge className={`px-3 py-1 font-medium capitalize ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </Badge>
                                    <Badge className={`px-3 py-1 font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Order Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{order.amount?.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Items Count</p>
                                    <p className="text-2xl font-bold text-gray-900">{order.OrderItems?.length || 0}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Created On</p>
                                    <p className="text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                    <p className="text-sm text-gray-900">{formatDate(order.updatedAt)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.OrderItems?.map((item: any, index: number) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-lg font-semibold text-gray-600">#{index + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{item.Product?.name}</h4>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">₹{item.unitPrice?.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Total: ₹{item.totalPrice?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Information */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {order.Customer?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-medium text-gray-900">{order.Customer?.name}</h4>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">GST Number</p>
                                    <p className="text-sm text-gray-900">{order.Customer?.gstNo}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-sm text-gray-900">{order.Customer?.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* POC Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>POC Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-green-100 text-green-600">
                                        {order.User?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-medium text-gray-900">{order.User?.name}</h4>
                                    <p className="text-sm text-gray-500">Point of Contact</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-sm text-gray-900">{order.User?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-sm text-gray-900">{order.User?.mobileNo}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Subtotal</span>
                                    <span className="text-sm font-medium">₹{order.amount?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Tax</span>
                                    <span className="text-sm font-medium">₹0.00</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold text-lg">₹{order.amount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <IconTrash className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete order <span className="font-semibold">#{order.id}</span>?
                            This will permanently remove the order and all its associated data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteOrder}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Order'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderView;