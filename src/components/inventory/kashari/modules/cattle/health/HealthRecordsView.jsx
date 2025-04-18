
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Syringe, Activity } from "lucide-react";
import HealthRecordsTable from './HealthRecordsTable';
import AddHealthRecordDialog from './AddHealthRecordDialog';

const HealthRecordsView = ({ cattleData = [] }) => {
  // Mock data for demonstration
  const [mockCattleData, setMockCattleData] = useState([]);
  
  useEffect(() => {
    // If no real data provided, use mock data
    if (cattleData.length === 0) {
      setMockCattleData([
        { id: '1', tag_number: 'KF-001', name: 'Bella' },
        { id: '2', tag_number: 'KF-002', name: 'Daisy' },
        { id: '3', tag_number: 'KF-003', name: 'Lola' },
      ]);
    }
  }, [cattleData]);

  const dataToUse = cattleData.length > 0 ? cattleData : mockCattleData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Health Records</h2>
        <AddHealthRecordDialog cattleData={dataToUse} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
            <Syringe className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <h3 className="text-2xl font-bold">95%</h3>
            </div>
            <Activity className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Records Table */}
      <HealthRecordsTable />
    </div>
  );
};

export default HealthRecordsView;
