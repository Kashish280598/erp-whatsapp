import logo from "@/assets/logo.svg";
import PasswordStrengthChecker from "@/components/custom/PasswordStrengthChecker";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import { useSearchParams } from "react-router-dom";
import type { RootState } from "@/lib/store";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useEffect } from "react";
import { useLoading } from "@/hooks/useAppState";
import { API_ENDPOINTS } from "@/lib/api/config";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useResetPasswordMutation } from '@/lib/api/auth/auth-api';

// Validation Schema
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

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const { isLoading: isResetPasswordLoading } = useLoading(API_ENDPOINTS.auth.resetPassword);
  const { user } = useAppSelector(state => state.auth);
  const [resetPassword, { isLoading: isResetPasswordApiLoading }] = useResetPasswordMutation();

  const { isLoading, error, formData } = useAppSelector(
    (state: RootState) => state.auth.resetPassword
  );

  const initialValues: ResetPasswordFormValues = {
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };

  useEffect(() => {
    if (!resetToken) {
      navigate('/404');
    }
  }, [resetToken, navigate]);


  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!resetToken) {
      toast.error('Invalid reset password link');
      return;
    }
    try {
      const result = await resetPassword({ token: resetToken, newPassword: values.password }).unwrap();
      if (result?.status === 200) {
        toast.success('Your password has been successfully reset!');
        navigate('/login');
      } else {
        toast.error(result?.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className={`custom-scrollbar h-screen pb-10 flex flex-col items-center bg-linear-270 from-[#FFFFFF] to-primary-200 relative ${isLoading ? "overflow-hidden" : "overflow-auto"}`}>
      {/* Background Shapes */}
      <div className="fixed -top-5 -right-10 w-[296px] h-[296px] rounded-full opacity-10 rotate-[30deg] z-999">
        <img src={logo} alt="logo" className="w-full h-full object-cover" />
      </div>
      <div className="fixed -bottom-15 -left-10 w-[296px] h-[296px] rounded-full opacity-10 -rotate-[30deg] z-999">
        <img src={logo} alt="logo" className="w-full h-full object-cover" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md space-y-8 relative z-10 mt-32">
        {/* Header Text */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-[36px] font-[600] text-neutral leading-10">
            Set New Password
          </h1>
          <p className="text-[13px] text-[#5E5F6E] leading-5">
            Make it a password no one can guess
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ errors, touched, values, isSubmitting, isValid }) => (
            <Form className="space-y-5 lg:w-[480px]">
              {error && (
                <div className="text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <Field name="password">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      label="Password"
                      type="password"
                      id="password"
                      placeholder="Enter password"
                      error={!values.password && touched.password && errors.password}
                      autoComplete="new-password"
                      disabled={Boolean(user?.id)}
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
                    error={touched.confirmPassword && errors.confirmPassword}
                    autoComplete="new-password"
                    disabled={Boolean(user?.id)}
                  />
                )}
              </Field>

              <Button
                variant="default"
                type="submit"
                disabled={isSubmitting || !isValid || isLoading || isResetPasswordApiLoading || Boolean(user?.id)}
                className="cursor-pointer w-full mt-2"
              >
                {isResetPasswordApiLoading ? 'Setting...' : 'Set Password'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      {(isLoading || isResetPasswordLoading || isResetPasswordApiLoading) && <Loader
        className={`fixed top-0 left-0 z-998 backdrop-blur-[3px]`}
        title={isResetPasswordLoading || isResetPasswordApiLoading ? "Redirecting you to Sign-in" : "Loading..."}
        description={isResetPasswordLoading || isResetPasswordApiLoading ? "We'll update your password and re-direct you to sign-in your account." : "Please wait..."} />}
    </div>
  );
};

export default ResetPassword;