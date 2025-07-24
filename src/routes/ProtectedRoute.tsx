import React from "react";
import Loader from "@/components/Loader";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/lib/store";
// import { useLoading } from "@/hooks/useAppState";
// import { API_ENDPOINTS } from "@/lib/api/config";
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isLoading = false;
    // const { isLoading } = useLoading(API_ENDPOINTS.users.profile);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    if (isLoading) {
        return (
            <div className="w-full h-svh">
                <Loader />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;