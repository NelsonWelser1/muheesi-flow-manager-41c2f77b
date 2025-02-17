
import React from 'react';
import { format as formatDate } from 'date-fns';

const ProductionTable = ({ records }) => {
  if (!records?.length) {
    return <div className="text-center py-4">No records found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Batch ID</th>
            <th className="px-4 py-2 text-left">Fromager</th>
            <th className="px-4 py-2 text-left">Cheese Type</th>
            <th className="px-4 py-2 text-left">Volume (L)</th>
            <th className="px-4 py-2 text-left">Start Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b hover:bg-muted/50">
              <td className="px-4 py-2">{record.batch_id}</td>
              <td className="px-4 py-2">{record.fromager_identifier}</td>
              <td className="px-4 py-2">{record.cheese_type}</td>
              <td className="px-4 py-2">{record.milk_volume}</td>
              <td className="px-4 py-2">{formatDate(new Date(record.start_time), 'PPp')}</td>
              <td className="px-4 py-2">{record.status}</td>
              <td className="px-4 py-2">{formatDate(new Date(record.created_at), 'PPp')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
