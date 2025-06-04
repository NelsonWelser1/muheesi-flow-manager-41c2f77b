
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ITMetricsCards from './it-manager/ITMetricsCards';
import SystemInfrastructure from './it-manager/SystemInfrastructure';
import SecurityManagement from './it-manager/SecurityManagement';
import NetworkOperations from './it-manager/NetworkOperations';
import DataManagement from './it-manager/DataManagement';
import UserSupport from './it-manager/UserSupport';
import ProjectManagement from './it-manager/ProjectManagement';
import { Monitor, Shield, Wifi, Database, Users, Briefcase } from 'lucide-react';

const ITManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('infrastructure');

  const itTabs = [
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Monitor,
      component: <SystemInfrastructure />
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      component: <SecurityManagement />
    },
    {
      id: 'network',
      label: 'Network Ops',
      icon: Wifi,
      component: <NetworkOperations />
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: Database,
      component: <DataManagement />
    },
    {
      id: 'support',
      label: 'User Support',
      icon: Users,
      component: <UserSupport />
    },
    {
      id: 'projects',
      label: 'IT Projects',
      icon: Briefcase,
      component: <ProjectManagement />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">IT Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Manage technology infrastructure, security, and digital transformation initiatives
          </p>
        </div>
        <Monitor className="h-8 w-8 text-blue-600" />
      </div>

      <ITMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {itTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {itTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ITManagerDashboard;
