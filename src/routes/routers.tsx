import App from "@/App";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import ErrorElement from "@/pages/errors/general-error";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import AuthRedirect from "./auth-redirect";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "@/pages/Chat";

// Application Pages
const Components = lazy(() => import("@/pages/dashboard/Components"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Settings = lazy(() => import("@/pages/Settings/index"));
const ManageAccount = lazy(() => import("@/pages/Settings/ManageAccount"));
const UserManagement = lazy(() => import("@/pages/Settings/UserManagement"));
const Discovery = lazy(() => import("@/pages/Discovery/index"));
const InventoryPage = lazy(() => import("@/pages/inventory"));
const CustomersPage = lazy(() => import("@/pages/customers"));

// Auth Pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// Error Pages
const NotFoundError = lazy(() => import("@/pages/errors/not-found-error"));

// User Pages
const UserListing = lazy(() => import("@/pages/users/user-listing"));
const UserCreate = lazy(() => import("@/pages/users/user-create"));
const UserEdit = lazy(() => import("@/pages/users/user-edit"));
const UserView = lazy(() => import("@/pages/users/user-view"));

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
                path: "inventory",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <ProtectedRoute>
                            <InventoryPage />
                        </ProtectedRoute>
                    </Suspense>
                ),
                errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
            },
            {
                path: "chat",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <Chat />
                    </Suspense>
                ),
                errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
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
                path: "customers/*",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <ProtectedRoute>
                            <CustomersPage />
                        </ProtectedRoute>
                    </Suspense>
                ),
                // Nested routes handled inside CustomersPage
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
                ],
            },
            {
                path: "users",
                element: (
                    <Suspense fallback={<FallbackLoader className="h-[calc(100svh-90px)]" />}>
                        <ProtectedRoute>
                            {/* Use Outlet for nested user routes */}
                            <Outlet />
                        </ProtectedRoute>
                    </Suspense>
                ),
                errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                children: [
                    {
                        index: true,
                        element: <UserListing />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                    {
                        path: "create",
                        element: <UserCreate />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                    {
                        path: ":id/edit",
                        element: <UserEdit />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                    {
                        path: ":id",
                        element: <UserView />,
                        errorElement: <ErrorElement className="h-[calc(100svh-90px)]" />,
                    },
                ],
            }
        ]
    },

    // Error routes
    { path: "/404", Component: NotFoundError },
    // Fallback 404 route
    { path: "*", Component: NotFoundError },
]);