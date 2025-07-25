import { Toster } from '@/components/custom/Toster'
import Loader from '@/components/Loader'
import { useLoading } from '@/hooks/useAppState'
import { useAutoRefreshToken } from '@/hooks/useAutoRefreshToken'
import '@/index.css'
import { API_ENDPOINTS } from '@/lib/api/config'
import { setInitializing, setTourCompleted } from '@/lib/features/app/appSlice'
import * as Sentry from '@sentry/react'
import axios from 'axios'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import setupAxios from './lib/axios-interceptors'
import { persistor, store, useAppDispatch, useAppSelector } from './lib/store'
import { ThemeProvider } from './providers/theme-provider'
import { router } from './routes/routers'
// reactour
import { useTheme } from '@/providers/theme-provider'
import { TourProvider, useTour } from '@reactour/tour'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || 'https://9158b79a18221ba1b846f790b2b4ab4c@o4507089036574720.ingest.us.sentry.io/4509721065422848',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0, // Adjust for production
  environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  release: import.meta.env.VITE_APP_VERSION || 'unknown',
});

// Custom Tour Step Components with Close Buttons
const WelcomeStep = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsOpen(false);
    dispatch(setTourCompleted(true));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">🎉 Welcome to Alchemy ERP!</div>
      <div className="text-sm leading-relaxed">
        Let's take a quick tour to help you get started with your new ERP system.
        We'll show you the key features and how to navigate through the application.
      </div>
      <button
        onClick={handleClose}
        className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Skip Tour
      </button>
    </div>
  );
};

const DashboardStep = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsOpen(false);
    dispatch(setTourCompleted(true));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">📊 Dashboard</div>
      <div className="text-sm leading-relaxed">
        This is your command center! Here you'll find an overview of your business metrics,
        recent activities, and quick access to important features.
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Skip Tour
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const InventoryStep = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsOpen(false);
    dispatch(setTourCompleted(true));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">📦 Inventory Manager</div>
      <div className="text-sm leading-relaxed">
        Manage your product inventory here. Add new items, track stock levels,
        monitor sales, and keep your warehouse organized efficiently.
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Skip Tour
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const CustomersStep = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsOpen(false);
    dispatch(setTourCompleted(true));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">👥 Customers</div>
      <div className="text-sm leading-relaxed">
        View and manage your customer database. Track customer information,
        order history, and maintain strong relationships with your clients.
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Skip Tour
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const ChatStep = ({ setIsOpen }: { setIsOpen: (open: boolean) => void }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setIsOpen(false);
    dispatch(setTourCompleted(true));
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">💬 Chat Integration</div>
      <div className="text-sm leading-relaxed">
        Connect with your customers through our integrated chat system.
        Manage conversations, respond to inquiries, and provide excellent customer support.
      </div>
      <button
        onClick={handleClose}
        className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
      >
        Complete Tour
      </button>
    </div>
  );
};

const tourSteps = [
  {
    selector: 'body',
    content: WelcomeStep,
  },
  {
    selector: '[data-tour="sidebar-dashboard"]',
    content: DashboardStep,
  },
  {
    selector: '[data-tour="sidebar-inventory-manager"]',
    content: InventoryStep,
  },
  {
    selector: '[data-tour="sidebar-customers"]',
    content: CustomersStep,
  },
  {
    selector: '[data-tour="sidebar-chat"]',
    content: ChatStep,
  },
];

// Controller for programmatic tour open, must be inside TourProvider
const TourController = ({ shouldOpenTour }: { shouldOpenTour: boolean }) => {
  const { setIsOpen } = useTour();
  useEffect(() => {
    if (shouldOpenTour) {
      console.log('Opening tour! shouldOpenTour:', shouldOpenTour);
      setIsOpen(true);
    } else {
      console.log('Tour not opening. shouldOpenTour:', shouldOpenTour);
    }
  }, [shouldOpenTour, setIsOpen]);
  return null;
};

const AppTourProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const tourCompleted = useAppSelector(state => state.app.tourCompleted);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const shouldOpenTour = isAuthenticated && !tourCompleted;

  return (
    <TourProvider
      steps={tourSteps}
      styles={{
        popover: (base: React.CSSProperties) => ({
          ...base,
          backgroundColor: isDark ? '#23272f' : '#fff',
          color: isDark ? '#fff' : '#23272f',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.15)',
          fontSize: 16,
          lineHeight: 1.6,
          borderRadius: 12,
          maxWidth: 350,
        }),
        maskArea: (base: React.CSSProperties) => ({
          ...base,
          rx: 8,
        }),
        badge: (base: React.CSSProperties) => ({
          ...base,
          backgroundColor: isDark ? '#565ADD' : '#23272f',
          color: '#fff',
        }),
        controls: (base: React.CSSProperties) => ({
          ...base,
          color: isDark ? '#fff' : '#23272f',
        }),
        close: (base: React.CSSProperties) => ({
          ...base,
          color: isDark ? '#fff' : '#23272f',
        }),
      }}
      disableInteraction={tourCompleted}
      showCloseButton={false}
    >
      <TourController shouldOpenTour={shouldOpenTour} />
      {children}
    </TourProvider>
  );
};

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

// Vite HMR/React 18 createRoot fix
const rootElement = document.getElementById('root');
if (!(window as any)._viteReactRoot) {
  (window as any)._viteReactRoot = ReactDOM.createRoot(rootElement!);
}
(window as any)._viteReactRoot.render(

  <AppWrapper>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <AppTourProvider>
          <ThemeProvider storageKey="erp-ui-theme" defaultTheme="light">
            <React.Suspense fallback={<Loader />}>
              <App />
            </React.Suspense>
            <Toster />
          </ThemeProvider>
        </AppTourProvider>
      </PersistGate>
    </Provider>
  </AppWrapper>
);