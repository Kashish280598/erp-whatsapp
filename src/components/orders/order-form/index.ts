import * as yup from 'yup';


export const getInitialValues = (order?: Order) => {
    return {
        name: order?.name || '',
        customer: order?.customer || '',
        status: order?.status || '',
        total: order?.total || '',
        items: order?.items || [{ product: '', quantity: 1 }],
    }
}

export const validationSchema = yup.object({
    customer: yup.string().required('Customer is required'),
    items: yup.array().of(
        yup.object({
            product: yup.string().required('Product is required').min(1, 'Please select a product'),
            quantity: yup.number()
                .required('Quantity is required')
                .min(1, 'Quantity must be at least 1')
                .positive('Quantity must be positive'),
        })
    ).min(1, 'At least one product is required').required('Items are required'),
})

export const getPayload = (values: any) => {
    return {
        userMobileNo: values?.customer,
        items: Array.isArray(values?.items) ? values?.items.map((item: any) => ({ ProductId: item?.product, quantity: item?.quantity })) : [],
    }
}

export type Order = {
    id: string;
    name: string;
    customer: string;
    status: string;
    total: number;
    items: { product: string; quantity: number }[];
    created_at?: string;
    updated_at?: string;
}


