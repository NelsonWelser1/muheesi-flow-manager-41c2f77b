
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wrench } from "lucide-react";

export const SettingsForm = ({ settings, setSettings, onSubmit, isSubmitting }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="temperature_threshold">Temperature Threshold (°C)</Label>
          <Input
            id="temperature_threshold"
            type="number"
            step="0.1"
            value={settings.temperature_threshold}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              temperature_threshold: parseFloat(e.target.value)
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity_warning">Capacity Warning Threshold (%)</Label>
          <Input
            id="capacity_warning"
            type="number"
            value={settings.capacity_warning_threshold}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              capacity_warning_threshold: parseInt(e.target.value)
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cleaning_interval">Cleaning Interval (days)</Label>
          <Input
            id="cleaning_interval"
            type="number"
            value={settings.cleaning_interval}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              cleaning_interval: parseInt(e.target.value)
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance_interval">Maintenance Interval (days)</Label>
          <Input
            id="maintenance_interval"
            type="number"
            value={settings.maintenance_interval}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              maintenance_interval: parseInt(e.target.value)
            }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="auto_cleaning_enabled"
            checked={settings.auto_cleaning_enabled}
            onCheckedChange={(checked) => setSettings(prev => ({
              ...prev,
              auto_cleaning_enabled: checked
            }))}
          />
          <Label htmlFor="auto_cleaning_enabled">Enable Auto-Cleaning Alerts</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit"
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <Wrench className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};
