import logo from "@/assets/logo.svg";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAppDispatch, useAppSelector, type RootState } from "@/lib/store";
import { useLoading } from "@/hooks/useAppState";
import { API_ENDPOINTS } from "@/lib/api/config";
import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";
import { setIsExpiredLink, validateInvitationToken } from "@/lib/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { activeStep, isExpiredLink, isValidateInvitationTokenError } = useAppSelector((state: RootState) => state.auth.registration);
    const { isLoading } = useLoading(API_ENDPOINTS.auth.register);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { isLoading: isLoadingValidateInvitationToken } = useLoading(API_ENDPOINTS.auth.validateInvitationToken);
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        const validateToken = () => {
            if (!token) {
                navigate('/404');
                return;
            }
            setIsInitialLoading(false);
            dispatch(validateInvitationToken(token));
        };
        validateToken();
        return () => {
            dispatch(setIsExpiredLink(false));
        };
    }, []);

    useEffect(() => {
        if (user && user.id && !isExpiredLink && !isValidateInvitationTokenError && !isLoadingValidateInvitationToken && !isInitialLoading) toast.error('You already have an active session. Kindly log out and try again.')
    }, [user?.id, isExpiredLink, isValidateInvitationTokenError, isLoadingValidateInvitationToken, isInitialLoading]);


    if (isExpiredLink || isValidateInvitationTokenError) {
        return (
            <div className={`custom-scrollbar h-screen pb-10 flex flex-col items-center bg-linear-270 from-[#FFFFFF] to-primary-200 relative ${"overflow-auto"}`}>
                {/* Background Shapes */}
                <div className="fixed -top-5 -right-10 w-[296px] h-[296px] rounded-full opacity-10 rotate-[30deg] z-999">
                    <img src={logo} alt="logo" className="w-full h-full object-cover" />
                </div>
                <div className="fixed -bottom-15 -left-10 w-[296px] h-[296px] rounded-full opacity-10 -rotate-[30deg] z-999">
                    <img src={logo} alt="logo" className="w-full h-full object-cover" />
                </div>
                <div className="w-full max-w-[480px] space-y-8 relative z-10 mt-35">
                    <h1 className="text-[36px] font-[600] text-neutral leading-10 text-center">
                        {isExpiredLink ? 'Expired/Invalid Invitation Link!' : 'Oops! Something went wrong'}
                    </h1>
                    <p className="text-[13px] text-[#5E5F6E] leading-5 text-center">
                        {isExpiredLink ? 'The invitation link you used has expired or invalid. For security reasons, invitation links are only valid for a limited time. Don\'t worry, you can request a new link from your administrator.' : (
                            <>
                                Error: {isValidateInvitationTokenError}
                                <br />
                                Please try again later or contact support team.
                            </>
                        )}
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
        <div className={`custom-scrollbar h-screen pb-10 flex flex-col items-center bg-linear-270 from-[#FFFFFF] to-primary-200 relative ${isLoading ? "overflow-hidden" : "overflow-auto"}`}>
            {/* Background Shapes */}
            <div className="fixed -top-5 -right-10 w-[296px] h-[296px] rounded-full opacity-10 rotate-[30deg] z-999">
                <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>
            <div className="fixed -bottom-15 -left-10 w-[296px] h-[296px] rounded-full opacity-10 -rotate-[30deg] z-999">
                <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>

            {/* Main Content */}
            {!isLoadingValidateInvitationToken && !isInitialLoading && (
                <div className="w-full max-w-[480px] space-y-8 relative z-10 mt-35">
                    {activeStep === 1 && <RegisterForm />}
                </div>
            )}
            {(isLoadingValidateInvitationToken || isLoading || isInitialLoading) && <Loader
                className={`fixed top-0 left-0 z-998 ${isInitialLoading ? "backdrop-blur-[10px]" : "backdrop-blur-[3px]"}`}
                title={isLoadingValidateInvitationToken ? 'Verifying Your Invitation Link' : 'Loading...'}
                description={isLoadingValidateInvitationToken ? 'We\'re confirming your invitation link. This will just take a moment...' : 'This will just take a moment...'} />}
        </div>
    );
};

export default Register;