import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';
import { format } from 'date-fns';

const MilkBalanceTracker = () => {
  const { data: milkReception } = useMilkReception();

  const calculateMilkBalance = () => {
    if (!milkReception) return { totalReceived: 0, totalOffloaded: 0, currentBalance: 0 };

    return milkReception.reduce((acc, record) => {
      const volume = parseFloat(record.milk_volume);
      
      // Check if it's an offload record (negative volume or supplier name contains "Offload")
      if (volume < 0 || record.supplier_name.includes('Offload')) {
        acc.totalOffloaded += Math.abs(volume);
      } else {
        acc.totalReceived += volume;
      }
      
      acc.currentBalance = acc.totalReceived - acc.totalOffloaded;
      return acc;
    }, { totalReceived: 0, totalOffloaded: 0, currentBalance: 0 });
  };

  const { totalReceived, totalOffloaded, currentBalance } = calculateMilkBalance();

  const lastUpdate = milkReception && milkReception.length > 0 
    ? format(new Date(milkReception[0].datetime), 'PPp')
    : 'No records';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Milk Balance Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Received</p>
            <p className="text-2xl font-bold text-green-700">{totalReceived.toFixed(2)} L</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Total Offloaded</p>
            <p className="text-2xl font-bold text-red-700">{totalOffloaded.toFixed(2)} L</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Current Balance</p>
            <p className="text-2xl font-bold text-blue-700">{currentBalance.toFixed(2)} L</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdate}</p>
      </CardContent>
    </Card>
  );
};

export default MilkBalanceTracker;