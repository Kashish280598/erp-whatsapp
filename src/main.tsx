import { Toster } from '@/components/custom/Toster'
import Loader from '@/components/Loader'
import { useLoading } from '@/hooks/useAppState'
import { useAutoRefreshToken } from '@/hooks/useAutoRefreshToken'
import '@/index.css'
import { API_ENDPOINTS } from '@/lib/api/config'
import { setInitializing } from '@/lib/features/app/appSlice'
import { store, useAppDispatch, useAppSelector } from '@/lib/store'
import { ThemeProvider } from "@/providers/theme-provider"
import { router } from '@/routes/routers'
import * as Sentry from '@sentry/react'
import axios from 'axios'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from "react-router-dom"
import setupAxios from './lib/axios-interceptors'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || 'https://9158b79a18221ba1b846f790b2b4ab4c@o4507089036574720.ingest.us.sentry.io/4509721065422848',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0, // Adjust for production
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  release: import.meta.env.VITE_APP_VERSION || 'unknown',
});

const App = () => {
  useAutoRefreshToken();
  const dispatch = useAppDispatch();
  const { isLoading } = useLoading(API_ENDPOINTS.users.profile);
  const initializing = useAppSelector(state => state.app.initializing);

  useEffect(() => {
    dispatch(setInitializing(false));
  }, []);

  if (isLoading || initializing) {
    return (
      <div className="w-full h-svh">
        <Loader />
      </div>
    );
  };

  return (
    <RouterProvider router={router} />
  )
};

interface WrapperProps {
  children: React.ReactNode;
}
const AppWrapper: React.FC<WrapperProps> = ({ children }) => {
  const isDev = import.meta.env.MODE === 'development';
  return isDev ? <>{children}</> : <React.StrictMode>{children}</React.StrictMode>;

}

setupAxios(axios)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppWrapper>
    <Provider store={store}>
      <ThemeProvider storageKey="erp-ui-theme" defaultTheme="light">
        <React.Suspense fallback={<Loader />}>
          <App />
        </React.Suspense>
        <Toster />
      </ThemeProvider>
    </Provider>
  </AppWrapper>
);