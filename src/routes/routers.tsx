import Loader from "@/components/Loader";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthRedirect from "./auth-redirect";
import App from "@/App";
import ErrorElement from "@/pages/errors/general-error";
import { cn } from "@/lib/utils";
import ProtectedRoute from "./ProtectedRoute";

// Application Pages
const Components = lazy(() => import("@/pages/dashboard/Components"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings/index"));
const ManageAccount = lazy(() => import("@/pages/Settings/ManageAccount"));
const UserManagement = lazy(() => import("@/pages/Settings/UserManagement"));
const About = lazy(() => import("@/pages/Settings/About"));
const License = lazy(() => import("@/pages/Settings/License"));
const Discovery = lazy(() => import("@/pages/Discovery/index"));

// Auth Pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// Error Pages
const NotFoundError = lazy(() => import("@/pages/errors/not-found-error"));

const FallbackLoader = ({ className }: { className?: string }) => {
    return <Loader className={cn("h-[calc(100svh)]", className)} />;
};

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <Suspense fallback={<FallbackLoader />}>
                <AuthRedirect>
                    <Login />
                </AuthRedirect>
            </Suspense>
        ),
    },
    {
        path: "/register",
        element: (
            <Suspense fallback={<FallbackLoader />}>
                <Register />
            </Suspense>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <Suspense fallback={<FallbackLoader />}>
                <AuthRedirect>
                    <ForgotPassword />
                </AuthRedirect>
            </Suspense>
        ),
    },
    {
        path: "/reset-password",
        element: (
            <Suspense fallback={<FallbackLoader />}>
                <ResetPassword />
            </Suspense>
        ),
    },
    // Dashboard Routes
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "",
                element: <Navigate to="/discover" />,
            },
            {
                path: "/redirect",
                element: <></>,
            },
            {
                path: "/dashboard",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
            {
                path: 'discover',
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <Discovery />
                    </Suspense>
                ),
                errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
            },
            {
                path: "integrations",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <ProtectedRoute>
                            <Components />
                        </ProtectedRoute>
                    </Suspense>
                ),
                errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
            },
            {
                path: "settings",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    </Suspense>
                ),
                errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="manage-account" />,
                    },
                    {
                        path: "manage-account",
                        element: <ManageAccount />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                    {
                        path: "user-management",
                        element: <UserManagement />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                    {
                        path: "about",
                        element: <About />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                    {
                        path: "license",
                        element: <License />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                ],
            },
        ]
    },

    // Error routes
    { path: "/404", Component: NotFoundError },
    // Fallback 404 route
    { path: "*", Component: NotFoundError },
]);