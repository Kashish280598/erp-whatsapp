import { allowedAdminRoles, getRole, type Role } from '@/lib/utils';
import React from 'react'
import { Navigate } from 'react-router-dom';

interface RoleBasedProtectedRoutesTypes {
    allowedRoles?: Role[];
    children: React.ReactNode;
}
const RoleBasedProtectedRoutes: React.FC<RoleBasedProtectedRoutesTypes> = ({ allowedRoles = allowedAdminRoles, children }) => {
    // By default allow all routes for Admin User
    allowedRoles.push(...allowedAdminRoles);
    const role: Role = getRole() as Role;

    if (allowedRoles.includes(role)) {
        return <>{children}</>;
    };
    
    return <Navigate to="/404" />;
};

export default RoleBasedProtectedRoutes;
