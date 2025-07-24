import { usersApi } from '@/lib/api/users-api';
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import appReducer from './features/app/appSlice';
import authReducer from './features/auth/authSlice';
import breadcrumbReducer from './features/breadcrumb/breadcrumbSlice';
import discoveryReducer from './features/discovery/discoverySlice';
import settingsReducer from './features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    breadcrumb: breadcrumbReducer,
    settings: settingsReducer,
    discovery: discoveryReducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 