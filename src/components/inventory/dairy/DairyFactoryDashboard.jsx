
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionSchedule from './factory/ProductionSchedule';
import InventoryStatus from './factory/InventoryStatus';
import QualityControl from './factory/QualityControl';
import ProductionForms from './factory/ProductionForms';
import LogisticsDashboard from './logistics/LogisticsDashboard';
import PersonnelDashboard from './personnel/PersonnelDashboard';
import ReportsDashboard from './reports/ReportsDashboard';
import SalesMarketing from './SalesMarketing';
import { Card } from "@/components/ui/card";
import { useFactoryOperations } from '@/integrations/supabase/hooks/useGrandBernaDairies';

const DairyFactoryDashboard = () => {
  const { batches, inventory, totalProduction, lowInventoryItems } = useFactoryOperations();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Production Today</h3>
            <p className="text-2xl font-bold">{totalProduction.toFixed(2)} L</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Active Batches</h3>
            <p className="text-2xl font-bold">
              {batches?.filter(b => !b.end_time).length || 0}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Low Inventory Items</h3>
            <p className="text-2xl font-bold">{lowInventoryItems?.length || 0}</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="flex space-x-2 overflow-x-auto">
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="production">Production Forms</TabsTrigger>
          <TabsTrigger value="sales-marketing">Sales & Marketing</TabsTrigger>
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

        <TabsContent value="sales-marketing">
          <SalesMarketing />
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
