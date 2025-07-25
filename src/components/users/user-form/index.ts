import * as yup from 'yup';
import UserForm from "./user-form";


export const getInitialValues = (user?: User) => {
    return {
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        mobileNo: user?.mobileNo || '',
        password: user?.password || '',
    }
}

export const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    role: yup.string().required('Role is required'),
    mobileNo: yup.string().required('Phone number is required'),
    password: yup.string().required('Password is required'),
})

export const getPayload = (values: any) => {
    return {
        name: values?.name,
        email: values?.email,
        role: values?.role,
        mobileNo: values?.mobileNo,
        password: values?.password,
    }
}

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    password: string;
    created_at: string;
    updated_at: string;
    mobileNo: string;
}

export default UserForm;