import { useAppDispatch } from '@/lib/store';
import { useEffect, useRef } from 'react';
import { getProfile, logout, refreshToken as refreshTokenAction } from '@/lib/features/auth/authSlice';
import { isLoggedIn } from '@/lib/utils';

export function useAutoRefreshToken() {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const logoutChannel = new BroadcastChannel('erp-auth-broadcast');
    const dispatch = useAppDispatch();

    const fetchProfile = async () => {
        const loggedIn = isLoggedIn();
        if (loggedIn === 'true') {
            dispatch(getProfile());
        }
    };

    const refreshToken = async () => {
        const loggedIn = isLoggedIn();
        if (loggedIn === 'true') {
            dispatch(refreshTokenAction());
        }
    };

    const startRefreshInterval = () => {
        intervalRef.current = setInterval(() => {
            refreshToken();
        }, 14 * 60 * 1000); // Every 14 minutes
    };

    useEffect(() => {
        fetchProfile();
        startRefreshInterval();

        logoutChannel.onmessage = (event) => {
            if (event.data === 'logout') {
                localStorage.removeItem('isLoggedIn');
                dispatch(logout());
            };
        };

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            };
            logoutChannel.close();
        };
    }, []);
}
