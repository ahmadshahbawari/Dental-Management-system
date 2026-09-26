import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { Role } from '@/types/auth';

interface RequireAuthProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

export function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => user.roles.includes(role));
    if (!hasRequiredRole) {
      // Redirect to dashboard if user doesn't have required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
}

// Permission wrapper component
export function Can({
  permission,
  children,
}: {
  permission: { resource: string; action: string };
  children: React.ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission.resource, permission.action)) {
    return null;
  }

  return <>{children}</>;
}
