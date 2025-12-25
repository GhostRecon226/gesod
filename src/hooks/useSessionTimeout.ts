import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UseSessionTimeoutOptions {
  enabled: boolean;
  timeoutMinutes: number;
  warningMinutes?: number;
}

export function useSessionTimeout({ 
  enabled, 
  timeoutMinutes,
  warningMinutes = 2 
}: UseSessionTimeoutOptions) {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    clearTimers();
    toast.error('Session expired due to inactivity. Please log in again.');
    await signOut();
  }, [signOut, clearTimers]);

  const resetTimer = useCallback(() => {
    if (!enabled || !user) return;

    lastActivityRef.current = Date.now();
    clearTimers();

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timer
    if (warningMinutes > 0 && timeoutMinutes > warningMinutes) {
      warningRef.current = setTimeout(() => {
        toast.warning(
          `Your session will expire in ${warningMinutes} minute${warningMinutes > 1 ? 's' : ''} due to inactivity.`,
          { duration: 10000 }
        );
      }, warningMs);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(handleLogout, timeoutMs);
  }, [enabled, user, timeoutMinutes, warningMinutes, clearTimers, handleLogout]);

  useEffect(() => {
    if (!enabled || !user) {
      clearTimers();
      return;
    }

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    // Throttle activity detection
    let throttleTimer: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        resetTimer();
      }, 1000);
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start the timer
    resetTimer();

    return () => {
      clearTimers();
      if (throttleTimer) clearTimeout(throttleTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, user, resetTimer, clearTimers]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current,
  };
}
