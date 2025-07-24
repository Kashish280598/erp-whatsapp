import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setLoading } from '../app/appSlice';
import userService from '@/lib/api/services/userService';
import { API_ENDPOINTS } from '@/lib/api/config';
import { toast } from 'sonner';
import Cookies from "js-cookie";


interface User {
  id: string;
  email: string;
  role: 'admin' | 'read-only' | 'super-admin'; // Adjust if more specific roles exist
  active: boolean;
  name: string;
  createdAt: string; // Can also be Date if you parse it
  updatedAt: string;
  invitedBy: {
    id: string;
    name: string;
  };
  inviterName?: string;
  lastActivity: string;
  authMethod: 'Password' | 'Google' | 'MicrosoftEntraID' | 'Okta';
  showGuide?: boolean;
}

interface RegistrationState {
  activeStep: number;
  isExpiredLink: boolean;
  isValidateInvitationTokenError: string;
  formData: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    session?: string;
    role?: string;
    id?: string;
    token?: string;
  };
  selectedProvider: string | null;
}

interface LoginFormData {
  email: string;
  password: string;
  session?: string;
}

interface ResetPasswordState {
  isExpiredLink: boolean;
  isValidateResetPasswordTokenError: string;
  isLoading: boolean;
  error: string | null;
  formData: {
    password: string;
    confirmPassword: string;
  };
  data: {
    email: string;  
    token: string;
    expiresAt: string;
    isUsed: boolean;
    createdAt: string;
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  registration: RegistrationState;
  login: {
    type: 'password' | null,
    step: number;
    formData: LoginFormData;
    isLoading: boolean;
    error: string | null;
  };
  resetPassword: ResetPasswordState;
  forgotPassword: {
    isRequestSent: boolean;
  };
  verifiedPassword: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  registration: {
    isExpiredLink: false,
    isValidateInvitationTokenError: '',
    activeStep: 1,
    formData: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
    selectedProvider: null,
  },
  login: {
    type: null,
    step: 1,
    formData: {
      email: '',
      password: '',
      session: '',
    },
    isLoading: false,
    error: null,
  },
  resetPassword: {
    isExpiredLink: false,
    isLoading: false,
    error: null,
    formData: {
      password: '',
      confirmPassword: '',
    },
    isValidateResetPasswordTokenError: '',
    data: {
      email: '',
      token: '',
      expiresAt: '',
      isUsed: false,
      createdAt: '',
    },
  },
  forgotPassword: {
    isRequestSent: false,
  },
  verifiedPassword: ''
};


export const loginUser = createAsyncThunk(API_ENDPOINTS.auth.login,
  async ({ payload }: { payload: LoginFormData }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.login, isLoading: true }));

      const res = await userService.login(payload, {
        skipAuth: true,
        skipRetry: true,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (res.status === "success") {
        dispatch(setLoginStep(2));
        dispatch(setLoginFormData({
          email: payload.email,
          password: payload.password,
          session: res.data.session,
        }));
        dispatch(setLoading({ key: API_ENDPOINTS.auth.login, isLoading: false }));
        return res;
      } else {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.login, isLoading: false }));
      toast.error(error?.data?.message || error?.message);
    }
  }
);

export const forgotPasswordRequest = createAsyncThunk(API_ENDPOINTS.auth.forgotPasswordRequest,
  async (payload: { email: string }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.forgotPasswordRequest, isLoading: true }));
      const res = await userService.forgotPasswordRequest({ email: payload.email });
      if (res.status === "success") {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.forgotPasswordRequest, isLoading: false }));
        dispatch(setIsForgotPasswordRequestSent(true));
        return res;
      } else {
        throw new Error(res.statusText);
      }
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.forgotPasswordRequest, isLoading: false }));
      if (err?.data?.message)
        toast.error(err.data.message);
      else
        toast.error(`Error: ${err.message}`);
    }
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.login = initialState.login;
      // const logoutChannel = new BroadcastChannel('erp-auth-broadcast');
      // logoutChannel.postMessage('logout');
      localStorage.removeItem('isLoggedIn');
      Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
      });
      // logoutChannel.close();
      // Cookies will be cleared by the server
      // Todo: API intigration is pending
    },
    setCredentials: (state, action: PayloadAction<{ user: User | null; isAuthenticated: boolean }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      if (action.payload.isAuthenticated) localStorage.setItem('isLoggedIn', 'true');
      else localStorage.removeItem('isLoggedIn');
    },
    setIsShowAllSetDialog: (state, action: PayloadAction<boolean>) => {
      if (state.user)
        state.user.showGuide = action.payload;
    },
    setRegistrationStep: (state, action: PayloadAction<number>) => {
      state.registration.activeStep = action.payload;
    },
    setRegistrationFormData: (state, action: PayloadAction<typeof initialState.registration.formData>) => {
      state.registration.formData = {
        ...state.registration.formData,
        ...action.payload
      }
    },
    resetRegistration: (state) => {
      state.registration = initialState.registration;
    },
    setLoginStep: (state, action: PayloadAction<number>) => {
      state.login.step = action.payload;
    },
    setLoginFormData: (state, action) => {
      state.login.formData = action.payload;
    },
    setLoginType: (state, action: PayloadAction<'password' | null>) => {
      state.login.type = action.payload;
    },
    resetLoginForm: (state) => {
      state.login.formData = initialState.login.formData;
      state.login.step = 1;
      state.login.error = null;
    },
    setResetPasswordLinkExpired: (state, action: PayloadAction<boolean>) => {
      state.resetPassword.isExpiredLink = action.payload;
    },
    setResetPasswordFormData: (state, action: PayloadAction<typeof initialState.resetPassword.formData>) => {
      state.resetPassword.formData = action.payload;
    },
    resetPasswordState: (state) => {
      state.resetPassword = initialState.resetPassword;
    },
    setIsExpiredLink: (state, action: PayloadAction<boolean>) => {
      state.registration.isExpiredLink = action.payload;
    },
    setIsValidateInvitationTokenError: (state, action: PayloadAction<string>) => {
      state.registration.isValidateInvitationTokenError = action.payload;
    },
    setIsValidateResetPasswordTokenError: (state, action: PayloadAction<string>) => {
      state.resetPassword.isValidateResetPasswordTokenError = action.payload;
    },
    setIsForgotPasswordRequestSent: (state, action: PayloadAction<boolean>) => {
      state.forgotPassword.isRequestSent = action.payload;
    },
    setResetPasswordData: (state, action: PayloadAction<typeof initialState.resetPassword.data>) => {
      state.resetPassword.data = action.payload;
    },
    setVerifiedPassword: (state, action: PayloadAction<string>) => {
      state.verifiedPassword = action.payload;
    }
  },
});

export const {
  logout,
  setCredentials,
  setRegistrationStep,
  setRegistrationFormData,
  resetRegistration,
  setLoginStep,
  setLoginFormData,
  resetLoginForm,
  setResetPasswordLinkExpired,
  setResetPasswordFormData,
  resetPasswordState,
  setIsShowAllSetDialog,
  setIsExpiredLink,
  setIsValidateInvitationTokenError,
  setIsForgotPasswordRequestSent,
  setLoginType,
  setIsValidateResetPasswordTokenError,
  setResetPasswordData,
  setVerifiedPassword
} = authSlice.actions;

export default authSlice.reducer; 