
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
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[200px]">Batch ID</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[150px]">Fromager</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[150px]">Cheese Type</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Milk Volume (L)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[250px]">Start Time</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[150px]">Starter Culture</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Starter Quantity (g)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[150px]">Coagulant Type</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Coagulant Quantity (ml)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Temperature (°C)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Processing Time (min)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Expected Yield (kg)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Duration (hours)</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[120px]">Status</th>
            <th className="px-6 py-4 text-left whitespace-nowrap min-w-[300px]">Notes</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b hover:bg-muted/50">
              <td className="px-6 py-4 whitespace-normal">{record.batch_id}</td>
              <td className="px-6 py-4 whitespace-normal">{record.fromager_identifier}</td>
              <td className="px-6 py-4 whitespace-normal">{record.cheese_type}</td>
              <td className="px-6 py-4 whitespace-normal">{record.milk_volume}</td>
              <td className="px-6 py-4 whitespace-normal">{formatDate(new Date(record.start_time), 'PPp')}</td>
              <td className="px-6 py-4 whitespace-normal">{record.starter_culture}</td>
              <td className="px-6 py-4 whitespace-normal">{record.starter_quantity}</td>
              <td className="px-6 py-4 whitespace-normal">{record.coagulant_type}</td>
              <td className="px-6 py-4 whitespace-normal">{record.coagulant_quantity}</td>
              <td className="px-6 py-4 whitespace-normal">{record.processing_temperature}</td>
              <td className="px-6 py-4 whitespace-normal">{record.processing_time}</td>
              <td className="px-6 py-4 whitespace-normal">{record.expected_yield}</td>
              <td className="px-6 py-4 whitespace-normal">{record.estimated_duration}</td>
              <td className="px-6 py-4 whitespace-normal">{record.status}</td>
              <td className="px-6 py-4 whitespace-normal">{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
