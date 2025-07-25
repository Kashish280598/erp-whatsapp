import * as yup from 'yup';
import CategoryForm from "./category-form";

export const getInitialValues = (category?: Category) => {
    return {
        name: category?.name || '',
    }
}

export const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
})

export const getPayload = (values: any) => {
    return {
        name: values?.name,
    }
}

export type Category = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export default CategoryForm;