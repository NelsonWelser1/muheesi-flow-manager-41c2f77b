
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, HardDrive, Shield, RefreshCw } from 'lucide-react';

const DataManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Data Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45.7TB</div>
            <p className="text-xs text-muted-foreground">67% utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Backup Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">Last backup: 2h ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Data Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">+2.3TB</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Database Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Optimal</div>
            <p className="text-xs text-muted-foreground">All systems running</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage & Backup Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">Primary</p>
              <p className="text-sm text-muted-foreground">30.5TB / 45TB</p>
              <p className="text-xs text-green-600">Healthy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">Backup</p>
              <p className="text-sm text-muted-foreground">28.2TB / 40TB</p>
              <p className="text-xs text-green-600">Synchronized</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">Archive</p>
              <p className="text-sm text-muted-foreground">156TB / 200TB</p>
              <p className="text-xs text-green-600">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement;
