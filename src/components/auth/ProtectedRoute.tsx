import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoadingSpinner className="h-8 w-8 text-primary" />
            </div>
        );
    }

    if (!user) {
        // Redirect to login, but save the current location they were trying to go to
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.userType)) {
        // If user is logged in but doesn't have the right role, redirect to their role-specific dashboard
        if (user.userType === 'worker') return <Navigate to="/worker/dashboard" replace />;
        if (user.userType === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
        return <Navigate to="/customer/dashboard" replace />;
    }

    return children;
}
