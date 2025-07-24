import { Dialog, DialogType } from '@/components/custom/Dialog';
import { Input } from '@/components/ui/input';
import PSWDICON from '@/assets/icons/reset-pswd.svg';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { closeSetPasswordModal } from '@/lib/features/settings/settingsSlice';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import PasswordStrengthChecker from '@/components/custom/PasswordStrengthChecker';
import { useLoading } from '@/hooks/useAppState';
import { API_ENDPOINTS } from '@/lib/api/config';
import { changePassword } from '@/lib/features/auth/authSlice';

interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
};

const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Confirmed password does not match the password entered")
        .required("Please confirm your password"),
});


export default function SetPasswordModal() {
    const dispatch = useAppDispatch();
    const { isOpen } = useAppSelector((state) => state.settings.setPasswordModal);
    const { user } = useAppSelector(state => state.auth);
    const { verifiedPassword } = useAppSelector(state => state.auth);
    const { isLoading } = useLoading(API_ENDPOINTS.auth.changePassword);

    const handleClose = (callback?: () => void) => {
        if (callback) {
            callback();
        }
        dispatch(closeSetPasswordModal());
    };

    const onSubmit = async (values: ResetPasswordFormValues, callback?: () => void) => {
        await dispatch(changePassword({ email: user?.email || '', newPassword: values.password, currentPassword: verifiedPassword }));
        if (callback) {
            callback();
        };
    };

    const initialValues = {
        password: '',
        confirmPassword: ''
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={ResetPasswordSchema}
            onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
        >
            {({ errors, touched, values, isValid, handleSubmit, resetForm }) => (
                <Form className="space-y-5 lg:w-[480px]">
                    <Dialog
                        open={isOpen}
                        onOpenChange={(open) => {
                            if (!open) {
                                handleClose(resetForm);
                            }
                        }}
                        type={DialogType.DEFAULT}
                        icon={
                            <img src={PSWDICON} alt="pswd" className="h-9 w-9 text-primary" />
                        }
                        title="Set New Password"
                        description="Make it a password no one can guess… not even your cat."
                        actions={[
                            {
                                label: "Cancel",
                                variant: "ghost",
                                disabled: isLoading,
                                onClick: () => handleClose(resetForm)
                            },
                            {
                                label: isLoading ? "Verifying..." : "Set Password",
                                variant: "default",
                                isLoading: isLoading,
                                onClick: handleSubmit,
                                disabled: !isValid || isLoading
                            }
                        ]}
                    >
                        <div className="space-y-5 mt-5">
                            <Field name="password">
                                {({ field }: any) => (
                                    <Input
                                        {...field}
                                        label="Password"
                                        type="password"
                                        id="password"
                                        placeholder="Enter password"
                                        // error={touched.password && errors.password}
                                        autoComplete="new-password"
                                    />
                                )}
                            </Field>
                            <PasswordStrengthChecker
                                password={values.password}
                                className="w-[100%] border-none shadow-none bg-transparent p-0"
                            />

                            <Field name="confirmPassword">
                                {({ field }: any) => (
                                    <Input
                                        {...field}
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Enter password"
                                        error={touched.confirmPassword && errors.confirmPassword}
                                        autoComplete="new-password"
                                    />
                                )}
                            </Field>
                        </div>
                    </Dialog>
                </Form>
            )}
        </Formik>
    );
}