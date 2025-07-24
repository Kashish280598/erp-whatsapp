export interface ErrorState {
  message: string;
  code?: string | number;
  severity: 'error' | 'warning' | 'info';
  source?: string;
  timestamp: number;
}

export interface LoadingState {
  [key: string]: boolean;
}

export type LoadingKeys = 
  | 'auth/login'
  | 'auth/register'
  | 'users/fetch'
  | 'data/fetch'
  | 'settings/update'
  | string; // Allow dynamic keys 