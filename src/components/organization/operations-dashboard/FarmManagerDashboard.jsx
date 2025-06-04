
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmMetricsCards from './farm-manager/FarmMetricsCards';
import CropManagement from './farm-manager/CropManagement';
import LivestockManagement from './farm-manager/LivestockManagement';
import ResourcePlanning from './farm-manager/ResourcePlanning';
import ProductionTracking from './farm-manager/ProductionTracking';
import WeatherMonitoring from './farm-manager/WeatherMonitoring';
import { Sprout, Cow, Calendar, BarChart3, Cloud, Tractor } from 'lucide-react';

const FarmManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('crops');

  const farmTabs = [
    {
      id: 'crops',
      label: 'Crop Management',
      icon: Sprout,
      component: <CropManagement />
    },
    {
      id: 'livestock',
      label: 'Livestock Management',
      icon: Cow,
      component: <LivestockManagement />
    },
    {
      id: 'production',
      label: 'Production Tracking',
      icon: BarChart3,
      component: <ProductionTracking />
    },
    {
      id: 'resources',
      label: 'Resource Planning',
      icon: Tractor,
      component: <ResourcePlanning />
    },
    {
      id: 'weather',
      label: 'Weather Monitoring',
      icon: Cloud,
      component: <WeatherMonitoring />
    },
    {
      id: 'schedule',
      label: 'Farm Schedule',
      icon: Calendar,
      component: <div>Farm Schedule component would be implemented here</div>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Farm Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Manage farm operations, crop production, livestock, and resource optimization
          </p>
        </div>
        <Sprout className="h-8 w-8 text-green-600" />
      </div>

      <FarmMetricsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {farmTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {farmTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FarmManagerDashboard;
