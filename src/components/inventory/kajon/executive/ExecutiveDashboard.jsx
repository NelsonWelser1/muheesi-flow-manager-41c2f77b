
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  LineChart, 
  Coffee, 
  Truck, 
  Globe,
  CupSoda,
  Warehouse,
  Database
} from 'lucide-react';

import PerformanceMetrics from './PerformanceMetrics';
import QualityInsights from './QualityInsights';
import StrategicActions from './StrategicActions';
import DataExplorer from './DataExplorer';
import QualityManagement from './QualityManagement';
import LogisticsManagement from './LogisticsManagement';
import ExportBusinessAnalytics from './ExportBusinessAnalytics';

const ExecutiveDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Strategic Overview</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Data Explorer</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <CupSoda className="h-4 w-4" />
            <span>Quality Management</span>
          </TabsTrigger>
          <TabsTrigger value="logistics" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Logistics</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Export Business</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PerformanceMetrics />
            <QualityInsights />
            <StrategicActions />
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <DataExplorer />
        </TabsContent>
        
        <TabsContent value="quality" className="space-y-4">
          <QualityManagement />
        </TabsContent>
        
        <TabsContent value="logistics" className="space-y-4">
          <LogisticsManagement />
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <ExportBusinessAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
