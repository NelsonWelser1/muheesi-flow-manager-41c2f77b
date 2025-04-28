
import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHealthRecords } from '@/hooks/useHealthRecords';

const HealthRecordsView = () => {
  const { healthRecords, isLoading, error } = useHealthRecords();
  
  console.log("HealthRecordsView component rendering with data:", healthRecords);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Cattle Health Records</h3>
      <ScrollArea className="h-[500px]">
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="p-3 text-left font-medium">Tag #</th>
                <th className="p-3 text-left font-medium">Health Status</th>
                <th className="p-3 text-left font-medium">Last Check Date</th>
                <th className="p-3 text-left font-medium">Vaccinations</th>
                <th className="p-3 text-left font-medium">Treatment</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className="border-t">
                  <td className="p-3" colSpan="6">
                    <p className="text-center text-muted-foreground">Loading health records...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr className="border-t">
                  <td className="p-3" colSpan="6">
                    <p className="text-center text-red-500">Error loading health records: {error.message}</p>
                  </td>
                </tr>
              ) : healthRecords && healthRecords.length > 0 ? (
                healthRecords.map(record => (
                  <tr key={record.id} className="border-t">
                    <td className="p-3">{record.cattle_inventory?.tag_number || 'N/A'}</td>
                    <td className="p-3">{record.record_type === 'examination' ? 'Healthy' : 'Under Treatment'}</td>
                    <td className="p-3">{new Date(record.record_date).toLocaleDateString()}</td>
                    <td className="p-3">{record.record_type === 'vaccination' ? record.description : 'N/A'}</td>
                    <td className="p-3">{record.treatment || 'N/A'}</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
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
      </ScrollArea>
    </Card>
  );
};

export default HealthRecordsView;
