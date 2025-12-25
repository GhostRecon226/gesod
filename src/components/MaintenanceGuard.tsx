import { ReactNode } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { MaintenancePage } from './MaintenancePage';
import { useLocation } from 'react-router-dom';

interface MaintenanceGuardProps {
  children: ReactNode;
}

export function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const { settings, isLoading } = useSettings();
  const { role, loading: authLoading } = useAuth();
  const location = useLocation();

  // Allow admin routes and auth page to bypass maintenance
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/auth';
  const isAdmin = role === 'admin';

  // Show nothing while loading
  if (isLoading || authLoading) {
    return null;
  }

  // If maintenance mode is enabled and user is not an admin on non-admin routes
  if (settings.maintenance_mode && !isAdmin && !isAdminRoute && !isAuthRoute) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
