import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import DashboardMetrics from './components/DashboardMetrics';
import MainCard from './components/MainCard';
import { useLogisticsData } from './hooks/useLogisticsData';
const LogisticsDashboard = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [activeComponent, setActiveComponent] = useState(null);

  // Fetch metrics data
  const {
    activeDeliveries,
    pendingOrders,
    avgDeliveryTime,
    delayedDeliveries
  } = useLogisticsData();

  // Return to main dashboard
  const handleBack = () => {
    setActiveComponent(null);
  };
  return <div className="space-y-6">
      

      <DashboardMetrics activeDeliveries={activeDeliveries} pendingOrders={pendingOrders} avgDeliveryTime={avgDeliveryTime} delayedDeliveries={delayedDeliveries} />

      <MainCard activeComponent={activeComponent} setActiveComponent={setActiveComponent} handleBack={handleBack} activeDeliveries={activeDeliveries} pendingOrders={pendingOrders} avgDeliveryTime={avgDeliveryTime} delayedDeliveries={delayedDeliveries} />
    </div>;
};
export default LogisticsDashboard;