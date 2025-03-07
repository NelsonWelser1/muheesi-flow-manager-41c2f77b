
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogisticsDashboard from '../components/inventory/dairy/logistics/LogisticsDashboard';
import DeliveriesModule from '../components/inventory/dairy/logistics/modules/DeliveriesModule';
import OrdersModule from '../components/inventory/dairy/logistics/modules/OrdersModule';
import PerformanceModule from '../components/inventory/dairy/logistics/modules/PerformanceModule';
import LogisticsOverview from '../components/inventory/dairy/logistics/modules/LogisticsOverview';

const LogisticsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LogisticsDashboard />} />
      <Route path="/overview" element={<LogisticsOverview />} />
      <Route path="/deliveries" element={<DeliveriesModule />} />
      <Route path="/orders" element={<OrdersModule />} />
      <Route path="/performance" element={<PerformanceModule />} />
    </Routes>
  );
};

export default LogisticsRoutes;
