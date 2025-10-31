import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Settings, 
  Globe,
  Database,
  Mail,
  Shield,
  Zap,
  Save
} from 'lucide-react';

const SystemConfiguration = () => {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Muheesi GKK Integrated System',
    systemEmail: 'admin@muheesigkk.com',
    timeZone: 'Africa/Kampala',
    language: 'en',
    maintenanceMode: false
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    autoBackup: true,
    backupFrequency: '6h',
    retentionDays: 30,
    compressionEnabled: true
  });

  const [emailSettings, setEmailSettings] = useState({
    emailEnabled: true,
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'noreply@muheesigkk.com',
    emailFrom: 'Muheesi GKK System'
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChar: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    twoFactorAuth: false
  });

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveDatabase = () => {
    toast.success("Database settings saved successfully");
  };

  const handleSaveEmail = () => {
    toast.success("Email settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          System Configuration
        </h1>
        <p className="text-muted-foreground mt-1">
          Global system settings and configuration management
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={generalSettings.systemName}
                  onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemEmail">System Email</Label>
                <Input
                  id="systemEmail"
                  type="email"
                  value={generalSettings.systemEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, systemEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeZone">Time Zone</Label>
                <Select
                  value={generalSettings.timeZone}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, timeZone: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Kampala">Africa/Kampala (EAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                    <SelectItem value="lg">Luganda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable access for all users</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenanceMode: checked})}
                />
              </div>
              <Button onClick={handleSaveGeneral} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
              <CardDescription>Backup schedules and database management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Enable scheduled database backups</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={databaseSettings.autoBackup}
                  onCheckedChange={(checked) => setDatabaseSettings({...databaseSettings, autoBackup: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupFreq">Backup Frequency</Label>
                <Select
                  value={databaseSettings.backupFrequency}
                  onValueChange={(value) => setDatabaseSettings({...databaseSettings, backupFrequency: value})}
                  disabled={!databaseSettings.autoBackup}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Every Hour</SelectItem>
                    <SelectItem value="6h">Every 6 Hours</SelectItem>
                    <SelectItem value="12h">Every 12 Hours</SelectItem>
                    <SelectItem value="24h">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention">Backup Retention (Days)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={databaseSettings.retentionDays}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, retentionDays: parseInt(e.target.value)})}
                  disabled={!databaseSettings.autoBackup}
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="compression">Backup Compression</Label>
                  <p className="text-sm text-muted-foreground">Compress backups to save storage space</p>
                </div>
                <Switch
                  id="compression"
                  checked={databaseSettings.compressionEnabled}
                  onCheckedChange={(checked) => setDatabaseSettings({...databaseSettings, compressionEnabled: checked})}
                  disabled={!databaseSettings.autoBackup}
                />
              </div>
              <Button onClick={handleSaveDatabase} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Database Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>SMTP settings for system email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailEnabled">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Enable system email notifications</p>
                </div>
                <Switch
                  id="emailEnabled"
                  checked={emailSettings.emailEnabled}
                  onCheckedChange={(checked) => setEmailSettings({...emailSettings, emailEnabled: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                  disabled={!emailSettings.emailEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  disabled={!emailSettings.emailEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                  disabled={!emailSettings.emailEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFrom">From Name</Label>
                <Input
                  id="emailFrom"
                  value={emailSettings.emailFrom}
                  onChange={(e) => setEmailSettings({...emailSettings, emailFrom: e.target.value})}
                  disabled={!emailSettings.emailEnabled}
                />
              </div>
              <Button onClick={handleSaveEmail} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>Password policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="minLength">Minimum Password Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="specialChar">Require Special Characters</Label>
                  <p className="text-sm text-muted-foreground">Passwords must include special characters</p>
                </div>
                <Switch
                  id="specialChar"
                  checked={securitySettings.requireSpecialChar}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireSpecialChar: checked})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: checked})}
                />
              </div>
              <Button onClick={handleSaveSecurity} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;
