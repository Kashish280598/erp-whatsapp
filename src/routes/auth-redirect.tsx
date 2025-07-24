import Loader from "@/components/Loader";
// import { useLoading } from "@/hooks/useAppState";
// import { API_ENDPOINTS } from "@/lib/api/config";
import { useAppSelector } from "@/lib/store";
import React from "react";
import { Navigate } from "react-router-dom";
interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
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

  if (isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }
  return children;
};

export default AuthRedirect;