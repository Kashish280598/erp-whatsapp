import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.svg";
import { useAppDispatch, } from "@/lib/store";
import { useLoading } from "@/hooks/useAppState";
import { API_ENDPOINTS } from "@/lib/api/config";
import Loader from "@/components/Loader";
import { callbackSSO } from "@/lib/features/auth/authSlice";
import { useNavigate } from "react-router-dom";


const SSO = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading } = useLoading(API_ENDPOINTS.auth.callbackSSO);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        const state = new URLSearchParams(window.location.search).get('state');
        console.log(code, state);
        const validateToken = () => {
            if (!code || !state) {
                navigate('/404');
                return;
            }
            setIsInitialLoading(false);
            const callback = () => {
                navigate('/login');
            };
            dispatch(callbackSSO({ code, state, callback }));
        };
        validateToken();
    }, []);

    return (
        <div className={`custom-scrollbar h-screen pb-10 flex flex-col items-center bg-linear-270 from-[#FFFFFF] to-primary-200 relative ${isLoading ? "overflow-hidden" : "overflow-auto"}`}>
            {/* Background Shapes */}
            <div className="fixed -top-5 -right-10 w-[296px] h-[296px] rounded-full opacity-10 rotate-[30deg] z-999">
                <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>
            <div className="fixed -bottom-15 -left-10 w-[296px] h-[296px] rounded-full opacity-10 -rotate-[30deg] z-999">
                <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>

            {(isLoading || isInitialLoading) && <Loader
                className={`fixed top-0 left-0 z-998 ${isInitialLoading ? "backdrop-blur-[10px]" : "backdrop-blur-[3px]"}`}
                title={'Initializing Your SSO Setup'}
                description={'We\'re logging you in. This will just take a moment...'} />}
        </div>
    );
};

export default SSO;