import React from 'react';
import { Beef, Wrench, AlertCircle, TrendingUp } from 'lucide-react';
import MetricCard from './slaughterhouse/MetricCard';
import ProductionChart from './slaughterhouse/ProductionChart';
import ProcessingUnitsTable from './slaughterhouse/ProcessingUnitsTable';
import OperationLogsTable from './slaughterhouse/OperationLogsTable';

const mockData = {
  dailyProduction: [
    { type: 'Beef', quantity: 250 },
    { type: 'Pork', quantity: 180 },
    { type: 'Goat', quantity: 120 },
  ],
  processingUnits: [
    { id: 1, name: 'Unit A', activity: 'Beef Processing', personnel: 'Team 1', status: 'active' },
    { id: 2, name: 'Unit B', activity: 'Pork Processing', personnel: 'Team 2', status: 'maintenance' },
  ],
  operationLogs: [
    { id: 1, time: '09:00 AM', type: 'Beef', quantity: 50, personnel: 'John Doe' },
    { id: 2, time: '10:30 AM', type: 'Pork', quantity: 30, personnel: 'Jane Smith' },
  ]
};

const SlaughterhouseStock = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Processed Today" value="80 animals" icon={Beef} />
        <MetricCard title="Meat Output" value="550 kg" icon={TrendingUp} />
        <MetricCard title="Active Units" value="2/3" icon={Wrench} />
        <MetricCard title="Alerts" value="2" icon={AlertCircle} />
      </div>

      <ProductionChart data={mockData.dailyProduction} />
      <ProcessingUnitsTable units={mockData.processingUnits} />
      <OperationLogsTable logs={mockData.operationLogs} />
    </div>
  );
};

export default SlaughterhouseStock;