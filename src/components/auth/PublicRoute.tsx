import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PublicRouteProps {
    children: React.ReactNode;
}

/**
 * PublicRoute prevents authenticated users from accessing auth pages (Login/Register).
 * If a user is logged in, it redirects them to their appropriate dashboard.
 */
export default function PublicRoute({ children }: PublicRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <LoadingSpinner className="h-8 w-8 text-primary" />
            </div>
        );
    }

    if (isAuthenticated && user) {
        // Redirect to appropriate dashboard based on role
        if (user.userType === 'worker') return <Navigate to="/worker/dashboard" replace />;
        if (user.userType === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
        return <Navigate to="/customer/dashboard" replace />;
    }

    return children;
}
