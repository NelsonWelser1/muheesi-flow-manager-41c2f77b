
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LogisticsDashboard from '../components/inventory/dairy/logistics/LogisticsDashboard';
import OrdersModule from '../components/inventory/dairy/logistics/modules/OrdersModule';
import DeliveriesModule from '../components/inventory/dairy/logistics/modules/DeliveriesModule';
import PerformanceModule from '../components/inventory/dairy/logistics/modules/PerformanceModule';

// Create a LogisticsRoutes component
const LogisticsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LogisticsDashboard />} />
      <Route path="/overview" element={<LogisticsDashboard />} />
      <Route path="/deliveries" element={<DeliveriesModule />} />
      <Route path="/orders" element={<OrdersModule />} />
      <Route path="/performance" element={<PerformanceModule />} />
    </Routes>
  );
};

export default LogisticsRoutes;
