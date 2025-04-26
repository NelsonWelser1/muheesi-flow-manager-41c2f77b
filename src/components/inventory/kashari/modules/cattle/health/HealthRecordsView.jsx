
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Syringe, Activity } from "lucide-react";
import HealthRecordsTable from './HealthRecordsTable';
import AddHealthRecordDialog from './AddHealthRecordDialog';
import { useHealthRecords } from '@/hooks/useHealthRecords';

const HealthRecordsView = ({ records = [], onRefresh }) => {
  const { addHealthRecord } = useHealthRecords();
  
  // Calculate statistics from actual records
  const totalRecords = records.length;
  const vaccinationCount = records.filter(r => r.record_type === 'vaccination').length;
  
  // Calculate health score based on actual data
  const calculateHealthScore = () => {
    if (records.length === 0) return '85%';
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const recentRecords = records.filter(r => new Date(r.record_date) > lastMonth);
    return recentRecords.length > 0 ? '95%' : '85%';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Health Records</h2>
        <AddHealthRecordDialog onSuccess={onRefresh} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <h3 className="text-2xl font-bold">{totalRecords}</h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <h3 className="text-2xl font-bold">{vaccinationCount}</h3>
            </div>
            <Syringe className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <h3 className="text-2xl font-bold">{calculateHealthScore()}</h3>
            </div>
            <Activity className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Records Table */}
      <HealthRecordsTable records={records} />
    </div>
  );
};

export default HealthRecordsView;
