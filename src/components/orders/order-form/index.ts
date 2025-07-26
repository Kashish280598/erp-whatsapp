import * as yup from 'yup';

export const getInitialValues = (order?: Order) => {
    if (!order) {
        return {
            customer: '',
            status: 'pending',
            paymentStatus: 'pending',
            items: [{ product: '', quantity: 1 }],
        }
    }

    // Transform the order data structure to form values
    return {
        customer: order.Customer?.id?.toString() || '',
        status: order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        items: order.OrderItems?.map((item: any) => ({
            product: item.ProductId?.toString() || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0,
        })) || [{ product: '', quantity: 1 }],
    }
}

export const validationSchema = yup.object({
    customer: yup.string().when('$isEditMode', {
        is: false,
        then: (schema) => schema.required('Customer is required'),
        otherwise: (schema) => schema.optional(),
    }),
    status: yup.string().required('Status is required'),
    paymentStatus: yup.string().required('Payment status is required'),
    items: yup.array().when('$isEditMode', {
        is: false,
        then: (schema) => schema.of(
            yup.object({
                product: yup.string().required('Product is required').min(1, 'Please select a product'),
                quantity: yup.number()
                    .required('Quantity is required')
                    .min(1, 'Quantity must be at least 1')
                    .positive('Quantity must be positive'),
                unitPrice: yup.number().optional(),
                totalPrice: yup.number().optional(),
            })
        ).min(1, 'At least one product is required').required('Items are required'),
        otherwise: (schema) => schema.optional(),
    }),
})

export const getPayload = (values: any, isEdit: boolean = false) => {
    if (isEdit) {

        return {
            status: values.status,
            paymentStatus: values.paymentStatus,
        }
    }

    return {
        mobileNo: values?.user,
        items: Array.isArray(values?.items) ? values?.items.map((item: any) => ({
            ProductId: item?.product,
            quantity: item?.quantity,

        })) : [],
    }
}

export type Order = {
    id: number;
    amount: number;
    status: string;
    paymentStatus: string;
    UserId: number;
    CustomerId: number;
    createdAt: string;
    updatedAt: string;
    User: {
        id: number;
        name: string;
        email: string;
        mobileNo: string;
    };
    Customer: {
        id: number;
        name: string;
        gstNo: string;
        address: string;
    };
    OrderItems: Array<{
        id: number;
        OrderId: number;
        ProductId: number;
        StockId: number;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        createdAt: string;
        updatedAt: string;
        Product: {
            id: number;
            name: string;
            unitPrice: number;
        };
        Stock: {
            id: number;
            buyPrice: number;
        };
    }>;
}


