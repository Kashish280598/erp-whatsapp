import { usersApi } from '@/lib/api/users-api';
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from './api/auth/auth-api';
import { categoriesApi } from './api/categories-api';
import appReducer from './features/app/appSlice';
import authReducer from './features/auth/authSlice';
import breadcrumbReducer from './features/breadcrumb/breadcrumbSlice';
import discoveryReducer from './features/discovery/discoverySlice';
import settingsReducer from './features/settings/settingsSlice';


// redux-persist imports
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ordersApi } from './api/orders-api';

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user', 'token'], // persist only auth essentials
};

const appPersistConfig = {
  key: 'app',
  storage,
  whitelist: ['tourCompleted'], // persist only tourCompleted for app slice
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedAppReducer = persistReducer(appPersistConfig, appReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    app: persistedAppReducer,
    breadcrumb: breadcrumbReducer,
    settings: settingsReducer,
    discovery: discoveryReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat([usersApi.middleware, categoriesApi.middleware, authApi.middleware, ordersApi.middleware]),

  devTools: true,
});

export const persistor = persistStore(store);

// Define the base state types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type for the persisted app state
export interface PersistedAppState {
  tourCompleted: boolean;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
}

// Type for the persisted auth state
export interface PersistedAuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 