'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Wallet, Shield, Bell, Database } from 'lucide-react';
import { toast } from 'react-toastify';
import { settingsApi } from '@/lib/api';
import { Settings as SettingsType, UpdateSettingsRequest } from '@/types';
import { LoadingSpinnerFull, LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setLoading(true);
    try {
      const updateData: UpdateSettingsRequest = {
        organizationName: settings.organizationName,
        tokenAddress: settings.tokenAddress,
        network: 'somnia', // Always set to somnia network
        autoPayouts: settings.autoPayouts,
        notifications: settings.notifications,
        databaseUrl: settings.databaseUrl,
        apiKey: settings.apiKey,
      };
      
      await settingsApi.update(updateData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!settings) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenAddress: settings.tokenAddress,
          network: 'somnia',
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to connect to the somnia network.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-muted-foreground">
            Manage your organization configuration and preferences.
          </p>
        </div>
        <LoadingSpinnerFull text="Loading settings..." />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex-1 space-y-8 p-8 min-h-screen">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Failed to load settings</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load organization settings. Please try refreshing the page.
          </p>
          <Button onClick={loadSettings}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your organization configuration and preferences.
        </p>
      </div>

      <div className="grid gap-6 flex-1">
        {/* Organization Settings */}
        <Card>
          <CardHeader>
                      <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Organization Settings
          </CardTitle>
            <CardDescription>
              Configure your organization's basic information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select value="somnia" disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="somnia">somnia Network</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Currently only somnia network is supported.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Token Configuration
            </CardTitle>
            <CardDescription>
              Select the stable coin for employee salary payments and ESOP tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Salary Token */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salaryToken">Employee Salary Token</Label>
                <Select value={'usdt'} onValueChange={(value) => setSettings({ ...settings, tokenAddress: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stable coin for salaries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usdt">Circle (USDC)</SelectItem>
                    <SelectItem value="usda" disabled>USD Coin (USDC) - Coming Soon</SelectItem>
                    <SelectItem value="usdc" disabled>Dai (DAI) - Coming Soon</SelectItem>
                    <SelectItem value="dai" disabled>Avalon USDa (USDA) - Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Currently only USDC is supported. Other stable coins will be available soon.
                </p>
              </div>
            </div>

            <Separator />

            {/* ESOP Token */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="esopToken">ESOP Token</Label>
                <Select value="somnia" disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token for ESOPs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="somnia">somnia Coin (Native)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  ESOPs are distributed using the native somnia coin.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
                      <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Preferences
          </CardTitle>
            <CardDescription>
              Configure application preferences and automation settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Payouts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically process payouts when conditions are met
                </p>
              </div>
              <Switch
                checked={settings.autoPayouts}
                onCheckedChange={(checked) => setSettings({ ...settings, autoPayouts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
                      <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
            <CardDescription>
              Security settings and access controls for your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline">
                Change Admin Password
              </Button>
              <Button variant="outline">
                View Access Logs
              </Button>
              <Button variant="outline">
                Export Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 