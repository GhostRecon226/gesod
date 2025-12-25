import { useSettings } from "@/contexts/SettingsContext";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export function SessionTimeoutHandler() {
  const { settings } = useSettings();
  
  useSessionTimeout({
    enabled: settings.session_timeout_enabled,
    timeoutMinutes: settings.session_timeout_minutes,
    warningMinutes: 2,
  });

  return null;
}
