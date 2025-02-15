import React, { useState } from 'react';
import { Beef, Wrench, AlertCircle, TrendingUp, ClipboardCheck, PackageCheck, ScrollText, Scale } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from './slaughterhouse/MetricCard';
import ProductionChart from './slaughterhouse/ProductionChart';
import ProcessingUnitsTable from './slaughterhouse/ProcessingUnitsTable';
import OperationLogsTable from './slaughterhouse/OperationLogsTable';
import AnimalProcurementForm from './slaughterhouse/forms/AnimalProcurementForm';
import ProcessingProductionForm from './slaughterhouse/forms/ProcessingProductionForm';
import PackagingStorageForm from './slaughterhouse/forms/PackagingStorageForm';
import ComplianceForm from './slaughterhouse/forms/ComplianceForm';

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
  const [activeForm, setActiveForm] = useState(null);

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'procurement':
        return <AnimalProcurementForm onBack={() => setActiveForm(null)} />;
      case 'processing':
        return <ProcessingProductionForm onBack={() => setActiveForm(null)} />;
      case 'packaging':
        return <PackagingStorageForm onBack={() => setActiveForm(null)} />;
      case 'compliance':
        return <ComplianceForm onBack={() => setActiveForm(null)} />;
      default:
        return null;
    }
  };

  if (activeForm) {
    return (
      <div className="space-y-4">
        {renderActiveForm()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100"
          onClick={() => setActiveForm('procurement')}
        >
          <Scale className="h-8 w-8" />
          <span className="text-lg font-semibold text-center">Animal Procurement & Reception</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100"
          onClick={() => setActiveForm('processing')}
        >
          <Beef className="h-8 w-8" />
          <span className="text-lg font-semibold text-center">Processing & Meat Production</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100"
          onClick={() => setActiveForm('packaging')}
        >
          <PackageCheck className="h-8 w-8" />
          <span className="text-lg font-semibold text-center">Meat Packaging & Cold Storage</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-orange-50 hover:bg-orange-100"
          onClick={() => setActiveForm('compliance')}
        >
          <ClipboardCheck className="h-8 w-8" />
          <span className="text-lg font-semibold text-center">Regulatory & Safety Compliance</span>
        </Button>
      </div>

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
