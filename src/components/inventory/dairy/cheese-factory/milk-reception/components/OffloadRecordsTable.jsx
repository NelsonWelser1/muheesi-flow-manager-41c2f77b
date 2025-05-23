
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

export const OffloadRecordsTable = ({ records }) => {
  const formatVolume = (record) => {
    // Handle different volume field names
    if (record.volume_offloaded) {
      return `${Math.abs(record.volume_offloaded)}L`;
    } else if (record.milk_volume && Number(record.milk_volume) < 0) {
      return `${Math.abs(record.milk_volume)}L`;
    }
    return 'N/A';
  };

  const formatDate = (record) => {
    const dateField = record.created_at || record.datetime || record.offload_date;
    if (dateField) {
      return format(new Date(dateField), 'dd/MM/yyyy HH:mm');
    }
    return 'N/A';
  };

  const getDestination = (record) => {
    if (record.destination) {
      return record.destination;
    } else if (record.notes && record.notes.includes('Offloaded to:')) {
      return record.notes.replace('Offloaded to: ', '');
    }
    return 'N/A';
  };

  const getTankNumber = (record) => {
    return record.storage_tank || record.tank_number || 
           (record.supplier_name?.replace('Offload from ', '')) || 'N/A';
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="whitespace-nowrap px-6 min-w-[150px] font-semibold">Batch ID</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Storage Tank</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Volume Offloaded</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Temperature (°C)</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[110px] font-semibold">Fat %</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Protein %</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[130px] font-semibold">Date & Time</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[120px] font-semibold">Destination</TableHead>
            <TableHead className="whitespace-nowrap px-6 min-w-[100px] font-semibold">Quality</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No offload records to display
              </TableCell>
            </TableRow>
          ) : (
            records.map(record => (
              <TableRow key={record.id} className="hover:bg-gray-50">
                <TableCell className="whitespace-nowrap px-6 min-w-[150px] font-medium">
                  {record.batch_id || `OFF-${record.id?.slice(0, 8)}` || 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                  {getTankNumber(record)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px] text-red-600 font-medium">
                  -{formatVolume(record)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                  {record.temperature ? `${record.temperature}°C` : 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[110px]">
                  {record.fat_percentage ? `${record.fat_percentage}%` : 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                  {record.protein_percentage ? `${record.protein_percentage}%` : 'N/A'}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[130px]">
                  {formatDate(record)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[120px]">
                  {getDestination(record)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 min-w-[100px]">
                  {record.quality_check || record.quality_score || 'N/A'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
