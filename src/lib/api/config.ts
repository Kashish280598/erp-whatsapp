export const API_CONFIG = {
  baseURL: 'https://whatsapp-erp-production.up.railway.app',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  retryAttempts: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  retryDelay: Number(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
  statusCodesToRetry: [408, 500, 502, 503, 504],

  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    credentials: 'include',
  },

  withCredentials: true,
  mode: 'cors' as RequestMode,
  cache: 'no-cache' as RequestCache,
  redirect: 'follow' as RequestRedirect,
  referrerPolicy: 'strict-origin-when-cross-origin' as ReferrerPolicy,
} as const;

export const AUTH_CONFIG = {
  userKey: 'auth_user',

  cookieNames: {
    token: 'erp_token',
    refreshToken: 'erp_refresh_token',
    xsrfToken: 'XSRF-TOKEN'
  },
} as const;

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'ERP Admin',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  features: {
    auth: import.meta.env.VITE_ENABLE_AUTH === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    forgotPasswordRequest: '/api/auth/request-password-reset',
    resetPassword: '/api/auth/reset-password',
    logout: '/api/auth/logout',
  },
  users: {
    all: '/api/users',
    profile: '/api/users/me',
    allInvitations: '/api/invitations',
    editUserById: '/api/users',
    updateInvitationById: '/api/invitations',
    inviteUsers: '/api/invitations/bulk',
    resendInvitation: '/api/invitations/resend',
    toggleActiveUser: '/api/users/toggle-active',
    deleteUser: '/api/users',
    resetPasswordForUser: '/api/password-reset/request-by-id',
  },
  orders: {
    all: '/api/orders',
  },
  categories: '/api/categories'
} as const; 