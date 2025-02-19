
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';
import { Thermometer, Droplet } from 'lucide-react';

const MilkBalanceTracker = () => {
  const { data: milkReceptionData } = useMilkReception();

  const calculateTankBalance = (tankName) => {
    if (!milkReceptionData) return { volume: 0, lastTemperature: 0 };

    const tankData = milkReceptionData
      .filter(record => record.tank_number === tankName)
      .reduce((acc, record) => {
        // Add positive volumes (receptions) and subtract negative volumes (offloads)
        acc.volume += record.milk_volume;
        // Update temperature only if it's the most recent record
        if (!acc.lastTimestamp || new Date(record.created_at) > new Date(acc.lastTimestamp)) {
          acc.lastTemperature = record.temperature;
          acc.lastTimestamp = record.created_at;
        }
        return acc;
      }, { volume: 0, lastTemperature: 0, lastTimestamp: null });

    return {
      volume: Math.max(0, tankData.volume), // Ensure volume doesn't go below 0
      lastTemperature: tankData.lastTemperature
    };
  };

  const tankA = calculateTankBalance('Tank A');
  const tankB = calculateTankBalance('Tank B');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Tank A Status</CardTitle>
          <Droplet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Volume:</span>
              <span className="text-lg font-bold text-blue-600">{tankA.volume.toFixed(2)}L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Temperature:</span>
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-lg font-bold text-gray-700">{tankA.lastTemperature}°C</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Tank B Status</CardTitle>
          <Droplet className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Volume:</span>
              <span className="text-lg font-bold text-green-600">{tankB.volume.toFixed(2)}L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Temperature:</span>
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-lg font-bold text-gray-700">{tankB.lastTemperature}°C</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(tankA.volume + tankB.volume).toFixed(2)}L
          </div>
          <p className="text-xs text-muted-foreground">
            Combined volume across all tanks
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkBalanceTracker;
