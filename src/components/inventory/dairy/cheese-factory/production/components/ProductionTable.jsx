
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
            <th className="px-4 py-2 text-left">Milk Volume (L)</th>
            <th className="px-4 py-2 text-left">Start Time</th>
            <th className="px-4 py-2 text-left">Starter Culture</th>
            <th className="px-4 py-2 text-left">Starter Quantity (g)</th>
            <th className="px-4 py-2 text-left">Coagulant Type</th>
            <th className="px-4 py-2 text-left">Coagulant Quantity (ml)</th>
            <th className="px-4 py-2 text-left">Temperature (°C)</th>
            <th className="px-4 py-2 text-left">Processing Time (min)</th>
            <th className="px-4 py-2 text-left">Expected Yield (kg)</th>
            <th className="px-4 py-2 text-left">Duration (hours)</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Notes</th>
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
              <td className="px-4 py-2">{record.starter_culture}</td>
              <td className="px-4 py-2">{record.starter_quantity}</td>
              <td className="px-4 py-2">{record.coagulant_type}</td>
              <td className="px-4 py-2">{record.coagulant_quantity}</td>
              <td className="px-4 py-2">{record.temperature}</td>
              <td className="px-4 py-2">{record.processing_time}</td>
              <td className="px-4 py-2">{record.expected_yield}</td>
              <td className="px-4 py-2">{record.estimated_duration}</td>
              <td className="px-4 py-2">{record.status}</td>
              <td className="px-4 py-2">{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
