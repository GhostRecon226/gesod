import { Settings, Bell, Shield, Palette, Database, Loader2, Info } from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { useState } from "react";
import { SettingKey } from "@/services/settingsService";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminSettings() {
  const { settings, isLoading, updateSetting } = useSettings();
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

  const handleToggle = async (key: SettingKey, newValue: boolean) => {
    setSavingKeys(prev => new Set(prev).add(key));
    
    const success = await updateSetting(key, newValue);
    
    setSavingKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    
    if (success) {
      toast.success(`Setting updated successfully`);
    } else {
      toast.error(`Failed to update setting`);
    }
  };

  const isSaving = (key: string) => savingKeys.has(key);

  if (isLoading) {
    return (
      <AdminDashboardLayout pageTitle="Settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout pageTitle="Settings">
      <div className="space-y-6 max-w-2xl">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Configure general application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Maintenance Mode
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">When enabled, non-admin users will see a maintenance page instead of the app.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable public access to the site
                </p>
              </div>
              {isSaving('maintenance_mode') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.maintenance_mode} 
                  onCheckedChange={(checked) => handleToggle('maintenance_mode', checked)}
                />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Debug Mode
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Enables verbose logging in the browser console for troubleshooting.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed logging for troubleshooting
                </p>
              </div>
              {isSaving('debug_mode') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.debug_mode} 
                  onCheckedChange={(checked) => handleToggle('debug_mode', checked)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how and when notifications are sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Email Notifications
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Master toggle for all email notifications. Requires email service integration.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send email alerts for important events
                </p>
              </div>
              {isSaving('email_notifications') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.email_notifications} 
                  onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
                />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Quote Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify admins when new quote requests are submitted
                </p>
              </div>
              {isSaving('new_quote_alerts') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.new_quote_alerts} 
                  onCheckedChange={(checked) => handleToggle('new_quote_alerts', checked)}
                />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bid Request Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify admins when new bid requests are submitted
                </p>
              </div>
              {isSaving('bid_request_alerts') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.bid_request_alerts} 
                  onCheckedChange={(checked) => handleToggle('bid_request_alerts', checked)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and access control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Two-Factor Authentication
                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Coming Soon</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch 
                checked={settings.require_2fa} 
                disabled
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Session Timeout
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Automatically logs out users after {settings.session_timeout_minutes} minutes of inactivity.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out inactive users ({settings.session_timeout_minutes} min)
                </p>
              </div>
              {isSaving('session_timeout_enabled') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.session_timeout_enabled} 
                  onCheckedChange={(checked) => handleToggle('session_timeout_enabled', checked)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use dark theme across the application
                </p>
              </div>
              {isSaving('dark_mode') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.dark_mode} 
                  onCheckedChange={(checked) => handleToggle('dark_mode', checked)}
                />
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact View</Label>
                <p className="text-sm text-muted-foreground">
                  Use a more condensed layout
                </p>
              </div>
              {isSaving('compact_view') ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Switch 
                  checked={settings.compact_view} 
                  onCheckedChange={(checked) => handleToggle('compact_view', checked)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
            <CardDescription>
              Database and storage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">Supabase</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region</span>
                <span className="font-medium">US East</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-success">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
