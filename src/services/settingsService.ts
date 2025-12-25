import { supabase } from "@/integrations/supabase/client";

export type SettingKey = 
  | 'maintenance_mode'
  | 'debug_mode'
  | 'email_notifications'
  | 'new_quote_alerts'
  | 'bid_request_alerts'
  | 'require_2fa'
  | 'session_timeout_enabled'
  | 'session_timeout_minutes'
  | 'dark_mode'
  | 'compact_view';

export interface AppSettings {
  maintenance_mode: boolean;
  debug_mode: boolean;
  email_notifications: boolean;
  new_quote_alerts: boolean;
  bid_request_alerts: boolean;
  require_2fa: boolean;
  session_timeout_enabled: boolean;
  session_timeout_minutes: number;
  dark_mode: boolean;
  compact_view: boolean;
}

export const defaultSettings: AppSettings = {
  maintenance_mode: false,
  debug_mode: false,
  email_notifications: false,
  new_quote_alerts: true,
  bid_request_alerts: true,
  require_2fa: false,
  session_timeout_enabled: true,
  session_timeout_minutes: 30,
  dark_mode: false,
  compact_view: false,
};

export const settingsService = {
  async fetchAllSettings(): Promise<AppSettings> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }

    const settings = { ...defaultSettings };
    
    if (data) {
      data.forEach((row: { key: string; value: unknown }) => {
        const key = row.key as SettingKey;
        if (key in settings) {
          (settings as Record<string, unknown>)[key] = row.value;
        }
      });
    }

    return settings;
  },

  async fetchMaintenanceMode(): Promise<boolean> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'maintenance_mode')
      .single();

    if (error) {
      console.error('Error fetching maintenance mode:', error);
      return false;
    }

    return data?.value as boolean ?? false;
  },

  async updateSetting<K extends SettingKey>(
    key: K, 
    value: AppSettings[K]
  ): Promise<boolean> {
    // Convert value to JSON-compatible format
    const jsonValue = typeof value === 'boolean' || typeof value === 'number' 
      ? value 
      : JSON.parse(JSON.stringify(value));
      
    const { error } = await supabase
      .from('app_settings')
      .update({ 
        value: jsonValue,
        updated_at: new Date().toISOString()
      })
      .eq('key', key);

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }

    return true;
  },

  async updateMultipleSettings(
    updates: Partial<AppSettings>
  ): Promise<boolean> {
    const promises = Object.entries(updates).map(([key, value]) =>
      this.updateSetting(key as SettingKey, value as AppSettings[SettingKey])
    );

    const results = await Promise.all(promises);
    return results.every(Boolean);
  },
};
