import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/hooks/useAppState';
import { storeAuthToken, useLoginMutation } from '@/lib/api/auth/auth-api';
import { API_ENDPOINTS } from '@/lib/api/config';
import { setAuthToken, setCredentials, setLoginType } from '@/lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { Field, Form, Formik } from 'formik';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

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
  const { isLoading } = useLoading(API_ENDPOINTS.auth.login);
  const { email: loginEmail } = useAppSelector(state => state.auth.login.formData);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const initialValues = {
    email: loginEmail,
    password: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const result = await login({ email: values.email, password: values.password }).unwrap();
      if (result?.data?.token) {
        storeAuthToken(result?.data?.token);
        dispatch(setCredentials({ user: null, isAuthenticated: true }));
        dispatch(setAuthToken(result?.data?.token));
        // Optionally, fetch user profile here
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setLoginType(null));
    };
  }, []);

  return (
    <>
      {/* Welcome Text */}
      <div className="text-center">
        <h2 className="text-[36px] font-[600] text-neutral leading-10">Welcome Back</h2>
        <p className="text-[13px] font-[400] text-[#5E5F6E] mt-2 leading-5">Sign In. Secure. Simplify.</p>
      </div>

      {/* Login Form */}
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
              disabled={isSubmitting || isLoading || isLoginLoading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {(isLoading || isLoginLoading) ? 'Signing in...' : 'Sign In'}
            </Button>

          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm; 