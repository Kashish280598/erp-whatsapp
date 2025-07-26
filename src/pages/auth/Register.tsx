import RegisterForm from "@/components/auth/RegisterForm";
import { useAppDispatch, useAppSelector, type RootState } from "@/lib/store";
import React, { useEffect, useState } from "react";
import { setIsExpiredLink } from "@/lib/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LogoLight from '@/assets/logo-light.svg';
import LogoDark from '@/assets/logo-dark.svg';
import { useTheme } from '@/providers/theme-provider';


const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { activeStep, isExpiredLink } = useAppSelector((state: RootState) => state.auth.registration);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { user } = useAppSelector(state => state.auth);
    const { theme } = useTheme();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        const validateToken = () => {
            if (!token) {
                navigate('/404');
                return;
            }
            setIsInitialLoading(false);
        };
        validateToken();
        return () => {
            dispatch(setIsExpiredLink(false));
        };
    }, []);

    useEffect(() => {
        if (user && user.id && !isExpiredLink && !isInitialLoading) toast.error('You already have an active session. Kindly log out and try again.')
    }, [user?.id, isExpiredLink, isInitialLoading]);


    if (isExpiredLink) {
        return (
            <div className={`custom-scrollbar h-screen pb-10 flex flex-col items-center bg-linear-270 from-[#FFFFFF] to-primary-200 relative ${"overflow-auto"}`}>
                {/* Background Shapes */}
                <div className="fixed -top-5 -right-10 w-[296px] h-[296px] rounded-full opacity-10 rotate-[30deg] z-999">
                    <img src={theme === 'dark' ? LogoDark : LogoLight} alt="Logo" />
                </div>
                <div className="fixed -bottom-15 -left-10 w-[296px] h-[296px] rounded-full opacity-10 -rotate-[30deg] z-999">
                    <img src={theme === 'dark' ? LogoDark : LogoLight} alt="Logo" />
                </div>
                <div className="w-full max-w-[480px] space-y-8 relative z-10 mt-35">
                    <h1 className="text-[36px] font-[600] text-neutral leading-10 text-center">
                        Expired/Invalid Invitation Link!
                    </h1>
                    <p className="text-[13px] text-[#5E5F6E] leading-5 text-center">
                        The invitation link you used has expired or invalid. For security reasons, invitation links are only valid for a limited time. Don't worry, you can request a new link from your administrator.
                    </p>
                    {!user?.id && (<div className="space-y-5">
                        <p className="text-[13px] text-primary leading-5 text-center">
                            <Link to="/login" className="text-primary font-[600]">Contact Support Team</Link>
                        </p>
                    </div>)}
                </div>
            </div>
        )
    };


    return (
        <div className={`custom-scrollbar h-screen pb-10 flex flex-col items-center bg-linear-270 from-[#FFFFFF] to-primary-200 relative ${"overflow-auto"}`}>
            {/* Background Shapes */}
            <div className="fixed -top-5 -right-10 w-[296px] h-[296px] rounded-full opacity-10 rotate-[30deg] z-999">
                <img src={theme === 'dark' ? LogoDark : LogoLight} alt="Logo" />
            </div>
            <div className="fixed -bottom-15 -left-10 w-[296px] h-[296px] rounded-full opacity-10 -rotate-[30deg] z-999">
                <img src={theme === 'dark' ? LogoDark : LogoLight} alt="Logo" />
            </div>

            {/* Main Content */}
            {!isInitialLoading && (
                <div className="w-full max-w-[480px] space-y-8 relative z-10 mt-35">
                    {activeStep === 1 && <RegisterForm />}
                </div>
            )}
        </div>
    );
};

export default Register;