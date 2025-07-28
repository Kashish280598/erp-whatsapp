import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useEffect, useRef } from 'react';
import { logout, setCredentials, setAuthToken } from '@/lib/features/auth/authSlice';
import { useLazyGetCurrentUserQuery } from '@/lib/api/auth/auth-api';
import Cookies from 'js-cookie';

export function useAutoRefreshToken() {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const logoutChannel = new BroadcastChannel('erp-auth-broadcast');
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const token = useAppSelector(state => state.auth.token);
    const user = useAppSelector(state => state.auth.user);
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    // Initialize auth state from stored credentials
    const initializeAuth = async () => {
        try {
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (isLoggedIn) {
                // Get token from cookies or localStorage
                const storedToken = Cookies.get('erp_token') || localStorage.getItem('auth_token');
                
                if (storedToken) {
                    // Set token in Redux store if not already set
                    if (!token) {
                        dispatch(setAuthToken(storedToken));
                    }

                    // If we have stored auth data but user is not loaded, fetch profile
                    if (!isAuthenticated || !user) {
                        try {
                            const userResult = await getCurrentUser(undefined).unwrap();
                            if (userResult?.data?.user) {
                                dispatch(setCredentials({ 
                                    user: userResult.data.user, 
                                    isAuthenticated: true 
                                }));
                            } else {
                                throw new Error('No user data in response');
                            }
                        } catch (profileError) {
                            console.error('Error fetching user profile on init:', profileError);
                            // If profile fetch fails, clear stored auth data
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('auth_token');
                            Cookies.remove('erp_token');
                            dispatch(logout());
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            // If there's an error, clear stored auth data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('auth_token');
            Cookies.remove('erp_token');
            dispatch(logout());
        }
    };

    useEffect(() => {
        // Initialize auth state on app startup
        initializeAuth();

        // Listen for logout events from other tabs
        logoutChannel.onmessage = (event) => {
            if (event.data === 'logout') {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('auth_token');
                dispatch(logout());
            }
        };

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            logoutChannel.close();
        };
    }, []);

    // Monitor token changes and sync with cookies/localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('auth_token', token);
            // Also set in cookie if not already set
            if (!Cookies.get('erp_token')) {
                Cookies.set('erp_token', token, { expires: 7 }); // 7 days
            }
        }
    }, [token]);
}
