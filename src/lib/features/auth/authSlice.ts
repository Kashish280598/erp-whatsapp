import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setLoading } from '../app/appSlice';
import userService from '@/lib/api/services/userService';
import { API_ENDPOINTS } from '@/lib/api/config';
import { toast } from 'sonner';
import type { ForgotPasswordRequestPayload, LoginPayload, ResetPasswordPayload, VerifyPasswordPaylod, ChangePasswordPayload } from '@/types/user.type';
import Cookies from "js-cookie";

import type { RootState } from '@/lib/store';
import { closeConfirmPasswordModal, closeSetPasswordModal, openSetPasswordModal, openSuccessModal } from '../settings/settingsSlice';
interface User {
  id: string;
  email: string;
  role: 'admin' | 'read-only' | 'super-admin'; // Adjust if more specific roles exist
  tenantId: string;
  cognitoUserId: string;
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
    tenantId?: string;
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
  tenantId?: string;
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
    tenantId: string;
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
  tenants: {
    data: any[];
  },
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
      tenantId: '',
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
      tenantId: '',
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
      tenantId: '',
      token: '',
      expiresAt: '',
      isUsed: false,
      createdAt: '',
    },
  },
  forgotPassword: {
    isRequestSent: false,
  },
  tenants: {
    data: []
  },
  verifiedPassword: ''
};


export const validateInvitationToken = createAsyncThunk(API_ENDPOINTS.auth.validateInvitationToken,
  async (token: string, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.validateInvitationToken, isLoading: true }));
      const res = await userService.validateInvitationToken(token, { skipAuth: true, skipRetry: true });
      if (res.status === "success") {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.validateInvitationToken, isLoading: false }));
        dispatch(setIsValidateInvitationTokenError(''));
        dispatch(setIsExpiredLink(false));
        dispatch(setRegistrationFormData({
          email: res.data.email,
          tenantId: res.data.tenantId,
          name: res.data.name,
          role: res.data.role,
          id: res.data.id,
          token: res.data.token,
        }));
        return res;
      } else {
        throw new Error(res.statusText);
      }
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.validateInvitationToken, isLoading: false }));
      if (err?.data?.message?.includes?.("Invalid or expired link")) {
        dispatch(setIsExpiredLink(true));
      } else {
        dispatch(setIsValidateInvitationTokenError(err?.message || "Oops! Looks like we're having trouble connecting to the server. Please try again later."));
      }
      toast.error(err?.data?.message || "Oops! Looks like we're having trouble connecting to the server. Please try again later.");
    }
  }
);

export const signupUser = createAsyncThunk(API_ENDPOINTS.auth.register,
  async ({ confirmPassword, ...payload }: any, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.register, isLoading: true }));
      const res = await userService.signup({ password: payload.password, invitationToken: payload.invitationToken }, { skipAuth: true, skipRetry: true });
      if (res.status === "success") {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.register, isLoading: false }));
        dispatch(setRegistrationStep(2));
        dispatch(setRegistrationFormData({
          password: payload.password,
          confirmPassword: confirmPassword,
        }));
      } else {
        throw new Error(res.statusText);
      }
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.register, isLoading: false }));
      toast.error(err?.data?.message);
    }
  }
);

export const verifyEmailForPasswordLogin = createAsyncThunk(API_ENDPOINTS.auth.verifyEmailForPasswordLogin,
  async (email: string, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.verifyEmailForPasswordLogin, isLoading: true }));
      const res = await userService.verifyEmailForPasswordLogin(email, { skipAuth: true, skipRetry: true, credentials: 'omit' });
      if (res.status === "success") {
        if (res.data.length && !res.data[0]?.active) {
          throw new Error('Your account has been deactivated by the admin. Please contact support team.')
        }
        else if (!res.data.length)
          throw new Error("The user is not registered.");
        dispatch(setLoading({ key: API_ENDPOINTS.auth.verifyEmailForPasswordLogin, isLoading: false }));
        dispatch(setLoginType('password'));
        dispatch(setLoginFormData({ email: email, password: '', tenantId: res?.data[0]?.tenantId, session: '' }));
        dispatch(setTenants(res?.data));
        return res;
      } else {
        throw new Error(res.statusText);
      }
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.verifyEmailForPasswordLogin, isLoading: false }));
      toast.error(err?.data?.message || err?.message);
    }
  }
);


export const loginUser = createAsyncThunk(API_ENDPOINTS.auth.login,
  async ({ payload }: { payload: LoginPayload }, { dispatch }) => {
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
          tenantId: payload.tenantId,
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
  async (payload: ForgotPasswordRequestPayload, { dispatch, getState }) => {
    try {
      const { tenants } = (getState() as RootState).auth;
      const tenantId = tenants?.data?.[0]?.tenantId;
      dispatch(setLoading({ key: API_ENDPOINTS.auth.forgotPasswordRequest, isLoading: true }));
      const res = await userService.forgotPasswordRequest({ ...payload, tenantId }, { skipAuth: true, skipRetry: true });
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

export const resetPassword = createAsyncThunk(API_ENDPOINTS.auth.resetPassword,
  async ({ data }: { data: ResetPasswordPayload }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.resetPassword, isLoading: true }));
      const res = await userService.resetPassword(data, { skipAuth: true, skipRetry: true });
      if (res.status === "success") {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.resetPassword, isLoading: false }));
        toast.success("Your password has been successfully reset!");
        dispatch(resetPasswordState());
        return res;
      } else {
        throw new Error(res.statusText);
      }
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.resetPassword, isLoading: false }));
      if (err?.data?.message?.includes?.("Invalid or expired")) {
        dispatch(setResetPasswordLinkExpired(true));
      } else if (!err?.data?.message?.includes('New password must be different')) {
        dispatch(setIsValidateResetPasswordTokenError(err?.data?.message || err.message));
      }
      toast.error(err?.data?.message || 'Something went wrong');
    }
  }
);

export const refreshToken = createAsyncThunk(API_ENDPOINTS.auth.refresh,
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.refresh, isLoading: true }));
      const res = await userService.refreshToken({ skipAuth: true, skipRetry: true, credentials: 'include' });
      if (res.status === "success") {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.refresh, isLoading: false }));
      } else {
        throw new Error(res.statusText);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      if (err?.data?.message?.includes?.("Missing required parameter REFRESH_TOKEN")) {
        localStorage.removeItem('isLoggedIn');
      } else {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.refresh, isLoading: false }));
        toast.error(err?.data?.message || err?.message);
      }
    }
  }
);

export const validateResetPasswordToken = createAsyncThunk(API_ENDPOINTS.auth.validateResetPasswordToken,
  async (token: string, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.validateResetPasswordToken, isLoading: true }));
      const res = await userService.validateResetPasswordToken(token, { skipAuth: true, skipRetry: true });
      if (res.status === "success") {
        dispatch(setLoading({ key: API_ENDPOINTS.auth.validateResetPasswordToken, isLoading: false }));
        dispatch(setIsValidateResetPasswordTokenError(''));
        dispatch(setResetPasswordLinkExpired(false));
        dispatch(setResetPasswordData(res.data));
        return res;
      } else {
        throw new Error(res.statusText);
      }
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.validateResetPasswordToken, isLoading: false }));
      if (err?.data?.message?.includes?.("Invalid or expired")) {
        dispatch(setResetPasswordLinkExpired(true));
      } else {
        dispatch(setIsValidateResetPasswordTokenError(err?.data?.message || err.message));
      }
      toast.error(err?.data?.message || 'Something went wrong');
    }
  }
);

export const getProfile = createAsyncThunk(API_ENDPOINTS.users.profile,
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.users.profile, isLoading: true }));
      const res = await userService.getProfile({ credentials: 'include' });
      if (res.status === "success") {
        dispatch(setCredentials({ user: res.data, isAuthenticated: true }));
        dispatch(setLoading({ key: API_ENDPOINTS.users.profile, isLoading: false }));
      } else {
        throw new Error(res.statusText);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      dispatch(setCredentials({ user: null, isAuthenticated: false }));
      if (err?.data?.message?.includes?.("Missing required parameter REFRESH_TOKEN")) {
        localStorage.removeItem('isLoggedIn');
      } else {
        dispatch(setLoading({ key: API_ENDPOINTS.users.profile, isLoading: false }));
        toast.error(err?.data?.message || err?.message);
      }
    }
  }
);

export const verifyPassword = createAsyncThunk(API_ENDPOINTS.auth.verifyPassword,
  async (payload: VerifyPasswordPaylod, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.verifyPassword, isLoading: true }));
      const res = await userService.verifyPassword(payload);
      if (res.status === "success") {
        dispatch(openSetPasswordModal());
        dispatch(closeConfirmPasswordModal());
        dispatch(setVerifiedPassword(payload.password));
        dispatch(setLoading({ key: API_ENDPOINTS.auth.verifyPassword, isLoading: false }));
      } else {
        throw new Error(res.statusText);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.verifyPassword, isLoading: false }));
      toast.error(err?.data?.message || err?.message);
    }
  }
);

export const changePassword = createAsyncThunk(API_ENDPOINTS.auth.changePassword,
  async (payload: ChangePasswordPayload, { dispatch }) => {
    try {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.changePassword, isLoading: true }));
      const res = await userService.changePassword(payload);
      if (res.status === "success") {
        dispatch(closeSetPasswordModal());
        dispatch(openSuccessModal());
        dispatch(setVerifiedPassword(''));
        dispatch(setLoading({ key: API_ENDPOINTS.auth.changePassword, isLoading: false }));
      } else {
        throw new Error(res.statusText);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.changePassword, isLoading: false }));
      toast.error(err?.data?.message || err?.message);
    }
  }
);

export const toggleDiscoveryAllSet = createAsyncThunk(API_ENDPOINTS.auth.toggleDiscoveryAllSet,
  async (payload: { showGuide: boolean; }, { dispatch }) => {
    try {
      dispatch(setIsShowAllSetDialog(false));
      dispatch(setLoading({ key: API_ENDPOINTS.auth.toggleDiscoveryAllSet, isLoading: true }));
      await userService.toggleDiscoveryAllSet(payload);
      dispatch(setLoading({ key: API_ENDPOINTS.auth.toggleDiscoveryAllSet, isLoading: false }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      dispatch(setLoading({ key: API_ENDPOINTS.auth.toggleDiscoveryAllSet, isLoading: false }));
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
    setTenants: (state, action: PayloadAction<typeof initialState.tenants.data>) => {
      state.tenants.data = action.payload;
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
  setTenants,
  setIsValidateResetPasswordTokenError,
  setResetPasswordData,
  setVerifiedPassword
} = authSlice.actions;

export default authSlice.reducer; 