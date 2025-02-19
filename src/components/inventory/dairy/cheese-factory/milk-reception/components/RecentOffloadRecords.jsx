
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

export const RecentOffloadRecords = ({
  records
}) => {
  if (!records || records.length === 0) {
    return <p className="text-center text-gray-500">No offload records found</p>;
  }

  return (
    <div className="grid gap-4">
      {records
        .filter(record => record.supplier_name?.includes('Offload from'))
        .slice(0, 5)
        .map(record => (
          <Card key={record.id} className="p-4 px-[15px] py-[2px] my-0 mx-0">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <strong>Tank:</strong> {record.storage_tank || record.tank_number}
              </div>
              <div>
                <strong>Date:</strong> {format(new Date(record.created_at), 'PPp')}
              </div>
              <div>
                <strong>Volume:</strong> {Math.abs(record.milk_volume)}L
              </div>
              <div>
                <strong>Temperature:</strong> {record.temperature}°C
              </div>
              <div>
                <strong>Quality:</strong> {record.quality_score || record.quality_check}
              </div>
              {record.destination && (
                <div>
                  <strong>Destination:</strong> {record.destination}
                </div>
              )}
              {record.notes && (
                <div className="col-span-2">
                  <strong>Notes:</strong> {record.notes}
                </div>
              )}
            </div>
          </Card>
        ))}
    </div>
  );
};
