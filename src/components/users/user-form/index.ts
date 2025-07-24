import * as yup from 'yup';
import UserForm from "./user-form";


export const getInitialValues = (user?: User) => {
    return {
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
    }
}

export const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    role: yup.string().required('Role is required'),
})

export const getPayload = (values: any) => {
    return {
        name: values?.name,
        email: values?.email,
        role: values?.role,
    }
}

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export default UserForm;