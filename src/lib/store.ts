import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './features/auth/authSlice';
import appReducer from './features/app/appSlice';
import breadcrumbReducer from './features/breadcrumb/breadcrumbSlice';
import settingsReducer from './features/settings/settingsSlice';
import discoveryReducer from './features/discovery/discoverySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    breadcrumb: breadcrumbReducer,
    settings: settingsReducer,
    discovery: discoveryReducer,
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