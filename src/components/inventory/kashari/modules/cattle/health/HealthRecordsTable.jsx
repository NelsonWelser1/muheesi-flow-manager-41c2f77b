
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const HealthRecordsTable = ({ records = [], isLoading = false, error = null }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading health records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading health records: {error.message}</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No health records found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left font-medium">Tag #</th>
            <th className="p-3 text-left font-medium">Record Type</th>
            <th className="p-3 text-left font-medium">Date</th>
            <th className="p-3 text-left font-medium">Description</th>
            <th className="p-3 text-left font-medium">Treatment</th>
            <th className="p-3 text-left font-medium">Next Due</th>
            <th className="p-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id} className="border-t hover:bg-muted/30">
              <td className="p-3">{record.cattle_inventory?.tag_number || 'N/A'}</td>
              <td className="p-3 capitalize">{record.record_type}</td>
              <td className="p-3">{new Date(record.record_date).toLocaleDateString()}</td>
              <td className="p-3 max-w-[200px] truncate">{record.description}</td>
              <td className="p-3">{record.treatment || 'N/A'}</td>
              <td className="p-3">
                {record.next_due_date ? new Date(record.next_due_date).toLocaleDateString() : 'N/A'}
              </td>
              <td className="p-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthRecordsTable;
