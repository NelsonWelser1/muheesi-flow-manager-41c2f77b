
import React, { useState } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import MaintenanceEntryForm from '../../MaintenanceEntryForm';
import MaintenanceStats from './components/MaintenanceStats';
import UrgentTasks from './components/UrgentTasks';
import MaintenanceCalendarCard from './components/MaintenanceCalendarCard';
import ScheduledMaintenanceCard from './components/ScheduledMaintenanceCard';
import LoadingState from './components/LoadingState';
import { useMaintenanceData } from './hooks/useMaintenanceData';
import { useMaintenanceStats } from './hooks/useMaintenanceStats';
import { useMaintenancePagination } from './hooks/useMaintenancePagination';

const MaintenanceHub = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  const { data: maintenanceData, isLoading } = useMaintenanceData();
  const stats = useMaintenanceStats(maintenanceData);

  const {
    filteredMaintenanceData,
    paginatedMaintenanceData,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems,
    handlePageChange
  } = useMaintenancePagination(maintenanceData, selectedDate, view);

  const handleScheduleMaintenance = async (taskId) => {
    try {
      const { error } = await supabase
        .from('equipment_maintenance')
        .update({ status: 'scheduled' })
        .eq('id', taskId);

      if (error) throw error;
      toast.success('Maintenance scheduled successfully');
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast.error('Failed to schedule maintenance');
    }
  };

  const urgentTasks = maintenanceData?.filter(task => 
    task.status === 'critical' || 
    (new Date(task.next_maintenance) <= new Date())
  ) || [];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <MaintenanceStats stats={stats} />

      {/* Urgent Tasks */}
      <UrgentTasks 
        urgentTasks={urgentTasks} 
        onScheduleMaintenance={handleScheduleMaintenance} 
      />

      {/* Maintenance Entry Form */}
      <MaintenanceEntryForm />

      {/* Calendar and Scheduled Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceCalendarCard 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <ScheduledMaintenanceCard
          paginatedMaintenanceData={paginatedMaintenanceData}
          filteredMaintenanceData={filteredMaintenanceData}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MaintenanceHub;
