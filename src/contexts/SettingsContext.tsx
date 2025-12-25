import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppSettings, defaultSettings, settingsService, SettingKey } from '@/services/settingsService';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSetting: <K extends SettingKey>(key: K, value: AppSettings[K]) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { user, role } = useAuth();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // If admin, fetch all settings; otherwise just maintenance mode
      if (role === 'admin') {
        const allSettings = await settingsService.fetchAllSettings();
        setSettings(allSettings);
      } else {
        const maintenanceMode = await settingsService.fetchMaintenanceMode();
        setSettings(prev => ({ ...prev, maintenance_mode: maintenanceMode }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings, user]);

  // Apply theme settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Dark mode
    if (settings.dark_mode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Compact view
    if (settings.compact_view) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }
  }, [settings.dark_mode, settings.compact_view]);

  const updateSetting = useCallback(async <K extends SettingKey>(
    key: K,
    value: AppSettings[K]
  ): Promise<boolean> => {
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: value }));
    
    const success = await settingsService.updateSetting(key, value);
    
    if (!success) {
      // Revert on failure
      await fetchSettings();
    }
    
    return success;
  }, [fetchSettings]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSetting, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
