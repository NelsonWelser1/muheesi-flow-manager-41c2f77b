
import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, PlusCircle, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";

const BreedingRecordsView = ({ records = [], onRefresh }) => {
  // Calculate statistics
  const totalRecords = records.length;
  const successfulBreedings = records.filter(r => r.status === 'successful').length;
  const pendingBreedings = records.filter(r => r.status === 'pending').length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Breeding Records</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Breeding Records</p>
              <h3 className="text-2xl font-bold">{totalRecords}</h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Successful Breedings</p>
              <h3 className="text-2xl font-bold">{successfulBreedings}</h3>
            </div>
            <Baby className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Pending Confirmations</p>
              <h3 className="text-2xl font-bold">{pendingBreedings}</h3>
            </div>
            <PlusCircle className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Breeding Records Table */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Breeding Records</h3>
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-left font-medium">Cow ID</th>
                <th className="p-3 text-left font-medium">Bull ID/Semen</th>
                <th className="p-3 text-left font-medium">Method</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Expected Due Date</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record, index) => (
                  <tr key={record.id || index} className="border-t">
                    <td className="p-3">{new Date(record.record_date).toLocaleDateString()}</td>
                    <td className="p-3">{record.cattle_inventory?.tag_number || 'Unknown'}</td>
                    <td className="p-3">{record.bull_id || record.semen_batch || '-'}</td>
                    <td className="p-3">{record.breeding_method || 'Natural'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        record.status === 'successful' ? 'bg-green-100 text-green-800' : 
                        record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-3">{record.expected_due_date ? new Date(record.expected_due_date).toLocaleDateString() : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td className="p-3" colSpan="6">
                    <p className="text-center text-muted-foreground">No breeding records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default BreedingRecordsView;
