import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordStrengthChecker from "@/components/custom/PasswordStrengthChecker";
import { signupUser } from "@/lib/features/auth/authSlice";
import { useLoading } from "@/hooks/useAppState";
import { API_ENDPOINTS } from "@/lib/api/config";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import type { RootState } from "@/lib/store";
// Custom password validation function to match PasswordStrengthChecker
const validatePasswordStrength = (password: string) => {
    if (!password) return false;
    if (password.length < 8) return false;

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
};

// Validation Schema
const RegisterSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .test(
            "password-strength",
            "Password must meet all strength requirements",
            validatePasswordStrength
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Confirmed password does not match the password entered")
        .required("Please confirm your password"),
});

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    tenantId: string;
    name: string;
}

const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useLoading(API_ENDPOINTS.auth.register);
    const { formData } = useAppSelector((state: RootState) => state.auth.registration);
    const { user } = useAppSelector(state => state.auth);

    const initialValues: RegisterFormValues = {
        name: formData.name || "",
        email: formData.email || "",
        password: "",
        confirmPassword: "",
        tenantId: formData.tenantId || "",
    };

    const handleSubmit = async (values: RegisterFormValues) => {
        if (user?.id) return;
        // Save form data to Redux store
        dispatch(signupUser({ ...values, invitationToken: formData.token }));
    };

    return (
        <>
            {/* Header Text */}
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-[36px] font-[600] text-neutral leading-10">
                    Create your account
                </h1>
                <p className="text-[13px] text-[#5E5F6E] leading-5">
                    One account. Total SaaS protection
                </p>
            </div>

            {/* Form */}
            <Formik
                initialValues={initialValues}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
                enableReinitialize
            >
                {({ errors, touched, values, isSubmitting, isValid }) => (
                    <Form className="space-y-5 lg:w-[480px]">
                        <Field name="email">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    label="Email"
                                    type="email"
                                    id="email"
                                    // Todo: Add disabled to input
                                    disabled
                                    placeholder="Enter your email address"
                                    error={touched.email && errors.email}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                />
                            )}
                        </Field>

                        <div className="space-y-5">
                            <Field name="password">
                                {({ field }: any) => (
                                    <Input
                                        {...field}
                                        label="Password"
                                        type="password"
                                        id="password"
                                        placeholder="Enter password"
                                        autoComplete="off"
                                        error={!values.password ? touched.password && errors.password : ''}
                                        disabled={isLoading || Boolean(user?.id)}
                                    />
                                )}
                            </Field>
                            {values.password && (
                                <PasswordStrengthChecker
                                    password={values.password}
                                    className="w-[100%] border-none shadow-none bg-transparent p-0"
                                />
                            )}
                        </div>

                        <Field name="confirmPassword">
                            {({ field }: any) => (
                                <Input
                                    {...field}
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Enter password"
                                    autoComplete="off"
                                    error={touched.confirmPassword && errors.confirmPassword}
                                    disabled={isLoading || Boolean(user?.id)}
                                />
                            )}
                        </Field>

                        <Button
                            variant="default"
                            type="submit"
                            disabled={isSubmitting || !isValid || isLoading || Boolean(user?.id)}
                            className="cursor-pointer w-full mt-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create your Account'}
                        </Button>

                        {/* Terms and Privacy */}
                        <p className="text-center text-[13px] text-[#5E5F6E] font-[400]">
                            By continuing, you agree to ERP's{" "}
                            <Link to="/terms" className="text-[#5E5F6E] font-[600] underline underline-offset-2">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="text-[#5E5F6E] font-[600] underline underline-offset-2">
                                Privacy Policy
                            </Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default RegisterForm; 