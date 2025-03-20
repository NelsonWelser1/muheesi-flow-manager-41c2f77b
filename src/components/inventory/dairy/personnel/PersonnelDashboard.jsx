
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ActionTiles from './dashboard/ActionTiles';
import MetricsCards from './dashboard/MetricsCards';
import CurrentShiftSchedule from './dashboard/CurrentShiftSchedule';
import PerformanceChart from './dashboard/PerformanceChart';
import ActiveComponent from './dashboard/ActiveComponent';
import { usePersonnelMetrics } from './hooks/usePersonnelMetrics';

const PersonnelDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const metrics = usePersonnelMetrics();

  const handleBack = () => {
    setActiveComponent(null);
  };

  const handleViewRecords = () => {
    setActiveComponent("Employee Records");
  };

  if (activeComponent) {
    return (
      <ActiveComponent 
        activeComponent={activeComponent} 
        onBack={handleBack} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Personnel Management</h2>
        {!activeComponent && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewRecords}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Records
          </Button>
        )}
      </div>
      
      {/* Action Tiles */}
      <ActionTiles onComponentSelect={setActiveComponent} />

      {/* Metrics Dashboard */}
      <MetricsCards 
        employeeCount={metrics.employeeCount}
        avgPerformance={metrics.avgPerformance}
        activeRecruitments={metrics.activeRecruitments}
        onShiftCount={metrics.onShiftCount}
        hoursWorked={metrics.hoursWorked}
        pendingReviews={metrics.pendingReviews}
      />

      {/* Current Shift Schedule */}
      <CurrentShiftSchedule currentShift={metrics.currentShift} />

      {/* Performance Chart */}
      <PerformanceChart />
    </div>
  );
};

export default PersonnelDashboard;
