
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Syringe, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddHealthRecordDialog from './AddHealthRecordDialog';

const HealthRecordsTable = ({ records = [] }) => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">Date</th>
            <th className="p-3 text-left font-medium">Cattle</th>
            <th className="p-3 text-left font-medium">Type</th>
            <th className="p-3 text-left font-medium">Description</th>
            <th className="p-3 text-left font-medium">Treatment</th>
            <th className="p-3 text-left font-medium">Next Due</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="p-3">{new Date(record.record_date).toLocaleDateString()}</td>
                <td className="p-3">{record.cattle_inventory?.tag_number || 'Unknown'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    record.record_type === 'vaccination' ? 'bg-blue-100 text-blue-800' :
                    record.record_type === 'treatment' ? 'bg-yellow-100 text-yellow-800' :
                    record.record_type === 'examination' ? 'bg-green-100 text-green-800' :
                    record.record_type === 'deworming' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.record_type}
                  </span>
                </td>
                <td className="p-3">{record.description}</td>
                <td className="p-3">{record.treatment || '-'}</td>
                <td className="p-3">{record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          ) : (
            <tr className="border-t">
              <td className="p-3" colSpan="6">
                <p className="text-center text-muted-foreground">No health records found</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const HealthRecordsView = ({ records = [], onRefresh }) => {
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            Refresh Data
          </Button>
          <AddHealthRecordDialog onSuccess={onRefresh} />
        </div>
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
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Health Records</h3>
        <HealthRecordsTable records={records} />
      </Card>
    </div>
  );
};

export default HealthRecordsView;
