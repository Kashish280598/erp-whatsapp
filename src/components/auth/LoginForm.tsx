import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { initiateSSO, loginUser, setLoginType, verifyEmailForSSO_OR_PasswordLogin } from '@/lib/features/auth/authSlice';
import { useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useLoading } from '@/hooks/useAppState';
import SSOIcon from "@/assets/icons/cloud-key.svg";
import { AUTH_METHODS } from '@/utils/constant';

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { type } = useAppSelector(state => state.auth.login);
  const { isLoading: isLoadingForEmail } = useLoading(API_ENDPOINTS.auth.verifyEmailForSSO_OR_PasswordLogin);
  const { isLoading } = useLoading(API_ENDPOINTS.auth.login);
  const { isLoading: initiateSSOLoading } = useLoading(API_ENDPOINTS.auth.initiateSSO);
  const { email: loginEmail, tenantId } = useAppSelector(state => state.auth.login.formData);
  const navigate = useNavigate();

  const initialValues = {
    email: loginEmail,
    password: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const callback = () => {
      navigate('/2fa-setup');
    };
    dispatch(loginUser({ payload: { email: values.email, password: values.password, tenantId: tenantId || '' }, callback }) as any);
  };

  useEffect(() => {
    return () => {
      dispatch(setLoginType(null));
    };
  }, []);

  const handleVerifyEmail = async (values: any) => {
    if (type?.trim()?.length) {
      // TODO: Implement SSO login
      dispatch(initiateSSO({ tenantId: tenantId || '', provider: type }));
      return;
    }
    dispatch(verifyEmailForSSO_OR_PasswordLogin(values.email) as any);
  };

  return (
    <>
      {/* Welcome Text */}
      <div className="text-center">
        <h2 className="text-[36px] font-[600] text-neutral leading-10">Welcome Back</h2>
        <p className="text-[13px] font-[400] text-[#5E5F6E] mt-2 leading-5">Sign In. Secure. Simplify.</p>
      </div>

      {/* Login Form */}
      {type?.toLowerCase()?.includes(AUTH_METHODS.Password.toLowerCase()) ? (
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-11 space-y-5">
              <div>
                <Field name="email">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      label="Email"
                      disabled
                      placeholder="Enter your email address"
                      error={touched.email && errors.email}
                    />
                  )}
                </Field>
              </div>

              <div className="space-y-5">
                <Field name="password">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type="password"
                      label="Password"
                      id="password"
                      placeholder="Enter password"
                      error={touched.password && errors.password}
                      endLabel={
                        <Link
                          to="/forgot-password"
                          className="block text-[13px] font-[600] mb-2 text-primary hover:underline"
                        >
                          Forgot?
                        </Link>
                      }
                    />
                  )}
                </Field>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? 'Signing in...' : 'Continue'}
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
      ) : (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Please enter a valid email address')
              .required('Email is required'),
          })}
          onSubmit={handleVerifyEmail}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, isValid, values }) => (
            <Form className="mt-11 space-y-4">
              <div>
                <Field name="email">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      autoFocus
                      id="email"
                      type="email"
                      label="Email"
                      placeholder="Enter your email address"
                      disabled={type?.trim()?.length}
                      error={touched.email && errors.email}
                    />
                  )}
                </Field>
              </div>
              <Button
                type={"submit"}
                disabled={!isValid || isSubmitting || isLoadingForEmail || initiateSSOLoading || !values.email}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {type?.trim()?.length && <img src={SSOIcon} alt="SSO" className="w-5 h-5 mr-3" />}
                {(isLoadingForEmail || initiateSSOLoading) ? 'Verifying...' : type?.trim()?.length ? 'Login with SSO' : 'Continue'}
              </Button>
              {/* Terms and Privacy */}
              {type?.trim()?.length && <p className="text-center text-[13px] text-[#5E5F6E] font-[400]">
                By continuing, you agree to ERP's{" "}
                <Link to="/terms" className="text-[#5E5F6E] font-[600] underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#5E5F6E] font-[600] underline underline-offset-2">
                  Privacy Policy
                </Link>
              </p>}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default LoginForm; 