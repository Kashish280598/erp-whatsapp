import * as yup from 'yup';


export const getInitialValues = (order?: Order) => {
    return {
        name: order?.name || '',
        customer: order?.customer || '',
        status: order?.status || '',
        total: order?.total || '',
        items: order?.items || [],
    }
}

export const validationSchema = yup.object({
    name: yup.string().required('Order name is required'),
    customer: yup.string().required('Customer is required'),
    status: yup.string().required('Status is required'),
    total: yup.number().required('Total is required'),
    items: yup.array().of(yup.string()).required('Items are required'),
})

export const getPayload = (values: any) => {
    return {
        name: values?.name,
        customer: values?.customer,
        status: values?.status,
        total: values?.total,
        items: values?.items,
    }
}

export type Order = {
    id: string;
    name: string;
    customer: string;
    status: string;
    total: number;
    items: string[];
    created_at?: string;
    updated_at?: string;
}


