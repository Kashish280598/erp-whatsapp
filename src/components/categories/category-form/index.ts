import * as yup from 'yup';
import CategoryForm from "./category-form";

export const getInitialValues = (category?: Category) => {
    return {
        name: category?.name || '',
        description: category?.description || '',
    }
}

export const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
})

export const getPayload = (values: any) => {
    return {
        name: values?.name,
        description: values?.description,
    }
}

export type Category = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export default CategoryForm;