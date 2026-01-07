import React, { useState } from 'react';
import { Beef, Wrench, AlertCircle, TrendingUp, ClipboardCheck, PackageCheck, Scale, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MetricCard from './slaughterhouse/MetricCard';
import ProductionChart from './slaughterhouse/ProductionChart';
import ProcessingUnitsTable from './slaughterhouse/ProcessingUnitsTable';
import OperationLogsTable from './slaughterhouse/OperationLogsTable';
import AnimalProcurementForm from './slaughterhouse/forms/AnimalProcurementForm';
import ProcessingProductionForm from './slaughterhouse/forms/ProcessingProductionForm';
import PackagingStorageForm from './slaughterhouse/forms/PackagingStorageForm';
import ComplianceForm from './slaughterhouse/forms/ComplianceForm';
import { useSlaughterhouseData } from '@/hooks/useSlaughterhouseData';

const SlaughterhouseStock = () => {
  const [activeForm, setActiveForm] = useState(null);
  const { dailyProduction, processingUnits, operationLogs, stats, loading } = useSlaughterhouseData();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <MetricCard title="Processed Today" value={stats.processedToday} icon={Beef} />
        <MetricCard title="Meat Output" value={stats.meatOutput} icon={TrendingUp} />
        <MetricCard title="Active Units" value={stats.activeUnits} icon={Wrench} />
        <MetricCard title="Alerts" value={stats.alertCount} icon={AlertCircle} />
      </div>

      <ProductionChart data={dailyProduction} />
      <ProcessingUnitsTable units={processingUnits} />
      <OperationLogsTable logs={operationLogs} />
    </div>
  );
};

export default SlaughterhouseStock;
