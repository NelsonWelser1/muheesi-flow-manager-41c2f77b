
import React from 'react';
import { format } from 'date-fns';

const RecentRecords = ({ records }) => {
  if (!records || records.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-2">Recently Added Records</h4>
      <div className="text-xs text-muted-foreground">
        {records.map((record) => (
          <div key={record.id} className="border-b py-2">
            <p><strong>{record.employee_id}</strong> - {record.job_title}</p>
            <p className="text-xs">
              Added: {format(new Date(record.created_at), 'PPp')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRecords;
