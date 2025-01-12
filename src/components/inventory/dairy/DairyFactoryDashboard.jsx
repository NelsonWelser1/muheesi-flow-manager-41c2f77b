import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionSchedule from './factory/ProductionSchedule';
import InventoryStatus from './factory/InventoryStatus';
import QualityControl from './factory/QualityControl';
import ProductionForms from './factory/ProductionForms';
import LogisticsDashboard from './logistics/LogisticsDashboard';
import PersonnelDashboard from './personnel/PersonnelDashboard';
import ReportsDashboard from './reports/ReportsDashboard';
import { useFactoryOperations } from '@/integrations/supabase/hooks/useGrandBernaDairies';

const DairyFactoryDashboard = () => {
  console.log('Rendering DairyFactoryDashboard');
  const { batches, inventory, totalProduction, lowInventoryItems } = useFactoryOperations();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Production Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProduction.toFixed(2)} L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {batches?.filter(b => !b.end_time).length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lowInventoryItems?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="production">Production Forms</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <ProductionSchedule batches={batches} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryStatus inventory={inventory} />
        </TabsContent>

        <TabsContent value="quality">
          <QualityControl batches={batches} />
        </TabsContent>

        <TabsContent value="production">
          <ProductionForms />
        </TabsContent>

        <TabsContent value="logistics">
          <LogisticsDashboard />
        </TabsContent>

        <TabsContent value="personnel">
          <PersonnelDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DairyFactoryDashboard;
