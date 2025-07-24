import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
// import LoginRightSection from '@/components/auth/LoginRightSection';
import { Button } from '@/components/ui/button';
import { IconChevronLeft } from '@tabler/icons-react';
import { CircleCheck } from 'lucide-react';
import Logo from '@/assets/logo.svg';
import { useAppSelector, type RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { forgotPasswordRequest, setIsForgotPasswordRequestSent } from '@/lib/features/auth/authSlice';
import { useAppDispatch } from '@/lib/store';
import { API_ENDPOINTS } from '@/lib/api/config';
import { useLoading } from '@/hooks/useAppState';
import Loader from "@/components/Loader";
import { toast } from 'sonner';
import userService from '@/lib/api/services/userService';
import { setLoading } from '@/lib/features/app/appSlice';

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const { isRequestSent } = useAppSelector((state: RootState) => state.auth.forgotPassword);
    const [email, setEmail] = useState('');
    const { isLoading } = useLoading(API_ENDPOINTS.auth.forgotPasswordRequest);
    const { email: loginEmail } = useAppSelector(state => state.auth.login.formData);

    useEffect(() => {
        setEmail(loginEmail || '');
        return () => {
            dispatch(setIsForgotPasswordRequestSent(false));
        };
    }, []);

    const handleSubmit = async () => {
        try {
            if (!loginEmail) {
                dispatch(setLoading({ key: API_ENDPOINTS.auth.forgotPasswordRequest, isLoading: true }));
                const res = await userService.verifyEmailForPasswordLogin(email, { skipAuth: true, skipRetry: true, credentials: 'omit' });
                if (res.status === "success") {
                    if (res.data.length && !res.data[0]?.active) {
                        throw new Error('Your account has been deactivated by the admin. Please contact support team.')
                    }
                    if (!res.data.length)
                        throw new Error("The user is not registered.");
                    dispatch(forgotPasswordRequest({ email }));
                    return res;
                } else {
                    throw new Error(res?.statusText);
                }
            } else {
                dispatch(forgotPasswordRequest({ email }));
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.auth.forgotPasswordRequest, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        }
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <div className="custom-scrollbar flex flex-col min-h-screen md:flex-row">
            {/* Left Section */}
            <div className="w-full p-4 flex flex-col items-center justify-start lg:p-8">
                <div className="w-full max-w-[480px] space-y-6 md:space-y-7 pt-7">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <img
                            src={Logo}
                            alt="ERP Logo"
                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-25 lg:h-25"
                        />
                    </div>

                    {/* Forgot Password Text */}
                    <div className="text-center">
                        <h2 className="text-[36px] font-[600] text-neutral leading-10">
                            {isRequestSent ? 'Reset Password Email Sent!' : 'Forgot Password'}
                        </h2>
                        <p className="text-[13px] font-[400] text-[#5E5F6E] mt-2 leading-5">
                            {isRequestSent ? 'Please check your email for a reset password link.' : "No worries, we'll send you a password reset link in your account's email."}
                        </p>
                    </div>

                    {/* Forgot Password Form */}
                    <div className="mt-11 space-y-4 sm:space-y-6">
                        <Input
                            autoFocus
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={isRequestSent ? 'bg-[#F4F4F6] opacity-100' : ''}
                            disabled={isRequestSent || Boolean(loginEmail)}
                            placeholder="Enter your email address"
                            endIcon={isRequestSent ? <CircleCheck size={20} fill={'#077D48'} className='text-white' /> : null}
                        />

                        {!isRequestSent && <Button
                            onClick={handleSubmit}
                            disabled={!isValidEmail(email) || isLoading}
                            variant="default"
                            type="submit"
                            className="w-full"
                        >
                            Continue
                        </Button>}
                        <Link
                            to="/login"
                            className="w-full flex justify-center px-4 text-[13px] font-[600] text-primary items-center gap-1 cursor-pointer hover:underline underline-offset-3"
                        >
                            <IconChevronLeft size={16} />
                            Back to Sign-In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            {/* <LoginRightSection /> */}

            {isLoading && <Loader
                className={`fixed top-0 left-0 z-998 backdrop-blur-[3px]`}
                title={'Verifying Email...'}
                description={"We're verifying your email and sending a reset password link. This will just take a moment."} />}
        </div>
    );
};

export default ForgotPassword; 