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
import CombinedProductionView from './production/CombinedProductionView';

const CheeseFactoryDashboard = () => {
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

      {/* Combined Production View */}
      <CombinedProductionView />

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="forms">Production Forms</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales & Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <ProductionSchedule />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryStatus />
        </TabsContent>

        <TabsContent value="quality">
          <QualityControl />
        </TabsContent>

        <TabsContent value="forms">
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

        <TabsContent value="sales">
          <SalesMarketing />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheeseFactoryDashboard;
