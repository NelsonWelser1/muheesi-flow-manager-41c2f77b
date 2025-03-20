
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/supabase";

// Import our refactored components
import LogisticsMetrics from './components/LogisticsMetrics';
import LogisticsOptions from './components/LogisticsOptions';
import LogisticsContent from './components/LogisticsContent';
import LogisticsHeader from './components/LogisticsHeader';

const LogisticsDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  // Fetch active deliveries for options component
  const { data: activeDeliveries = 0 } = useQuery({
    queryKey: ['activeDeliveries'],
    queryFn: async () => {
      const { count } = await supabase
        .from('logistics_delivery_management')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'In Transit');
      return count || 0;
    }
  });

  // Fetch pending orders for options component
  const { data: pendingOrders = 0 } = useQuery({
    queryKey: ['pendingOrders'],
    queryFn: async () => {
      const { count } = await supabase
        .from('logistics_order_entries')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'Pending');
      return count || 0;
    }
  });

  // Fetch average delivery time for options component
  const { data: avgDeliveryTime = '0' } = useQuery({
    queryKey: ['avgDeliveryTime'],
    queryFn: async () => {
      const { data } = await supabase
        .from('logistics_delivery_performance')
        .select('delivery_time')
        .limit(100);
      if (!data?.length) return '0';
      const avg = data.reduce((acc, curr) => acc + curr.delivery_time, 0) / data.length;
      return Math.round(avg).toString();
    }
  });

  // Fetch delayed deliveries for options component
  const { data: delayedDeliveries = 0 } = useQuery({
    queryKey: ['delayedDeliveries'],
    queryFn: async () => {
      const { count } = await supabase
        .from('logistics_delivery_management')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Delayed');
      return count || 0;
    }
  });

  // Return to main dashboard
  const handleBack = () => {
    setActiveComponent(null);
  };

  // Render the dashboard title and appropriate action buttons
  const renderCardHeader = () => {
    return (
      <CardTitle className="flex justify-between items-center">
        <span>Logistics & Distribution Management</span>
        {!activeComponent && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveComponent('records')}
            className="flex items-center gap-2"
          >
            View All Records
          </Button>
        )}
        {activeComponent && activeComponent !== 'records' && activeComponent !== 'view-deliveries' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            ← Back to All Options
          </Button>
        )}
        {activeComponent === 'records' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            ← Back to Management
          </Button>
        )}
      </CardTitle>
    );
  };

  // Render content based on the active component
  const renderDashboardContent = () => {
    if (activeComponent) {
      return <LogisticsContent activeComponent={activeComponent} setActiveComponent={setActiveComponent} />;
    }
    
    return (
      <LogisticsOptions 
        activeDeliveries={activeDeliveries} 
        delayedDeliveries={delayedDeliveries}
        pendingOrders={pendingOrders}
        avgDeliveryTime={avgDeliveryTime}
        onSelectOption={setActiveComponent}
      />
    );
  };

  return (
    <div className="space-y-6">
      <LogisticsHeader 
        activeComponent={activeComponent}
        onBack={handleBack}
        onViewRecords={() => setActiveComponent('records')}
      />

      <LogisticsMetrics />

      <Card>
        <CardHeader>
          {renderCardHeader()}
        </CardHeader>
        <CardContent>
          {renderDashboardContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
