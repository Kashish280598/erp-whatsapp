import Loader from "@/components/Loader";
import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthRedirect from "./auth-redirect";
import App from "@/App";
import ErrorElement from "@/pages/errors/general-error";
import { cn } from "@/lib/utils";
import ProtectedRoute from "./ProtectedRoute";

// Application Pages
import Components from "@/pages/dashboard/Components";
import Dashboard from "@/pages/dashboard/Dashboard";
import Settings from "@/pages/Settings/index";
import ManageAccount from "@/pages/Settings/ManageAccount";
import UserManagement from "@/pages/Settings/UserManagement";
import About from "@/pages/Settings/About";
import License from "@/pages/Settings/License";
import Discovery from "@/pages/Discovery/index";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import SSO from "@/pages/auth/SSO";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import TwoFASetup from "@/pages/auth/TwoFASetup";
import ResetPassword from "@/pages/auth/ResetPassword";

// Error Pages
import NotFoundError from "@/pages/errors/not-found-error";

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
    {
        path: "/2fa-setup",
        element: (
            <Suspense fallback={<FallbackLoader />}>
                <AuthRedirect>
                    <TwoFASetup />
                </AuthRedirect>
            </Suspense>
        ),
    },
    {
        path: "/sso",
        element: (
            <Suspense fallback={<FallbackLoader />}>
                <AuthRedirect>
                    <SSO />
                </AuthRedirect>
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