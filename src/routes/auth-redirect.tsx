import React from "react";
interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  return <>{children}</>;
};

export default AuthRedirect;