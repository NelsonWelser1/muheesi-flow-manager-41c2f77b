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

  const calculateDirectProcessing = () => {
    if (!milkReceptionData) return { volume: 0, lastTemperature: 0 };

    // Filter records for Direct Processing
    const directProcessingRecords = milkReceptionData.filter(record => 
      record.tank_number === 'Direct-Processing' || 
      (record.destination && record.destination.toLowerCase().includes('direct'))
    );

    // Calculate total volume and get latest temperature
    return directProcessingRecords.reduce((acc, record) => {
      // For direct processing entries
      if (record.tank_number === 'Direct-Processing') {
        acc.volume += record.milk_volume;
      }
      // For tank offloads to direct processing
      else if (record.destination && record.destination.toLowerCase().includes('direct')) {
        acc.volume += Math.abs(record.milk_volume); // Convert negative offload to positive inflow
      }

      // Update temperature if this is the most recent record
      if (!acc.lastTimestamp || new Date(record.created_at) > new Date(acc.lastTimestamp)) {
        acc.lastTemperature = record.temperature;
        acc.lastTimestamp = record.created_at;
      }

      return acc;
    }, { volume: 0, lastTemperature: 0, lastTimestamp: null });
  };

  const tankA = calculateTankBalance('Tank A');
  const tankB = calculateTankBalance('Tank B');
  const directProcessing = calculateDirectProcessing();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <Card className="bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-lg font-medium">Tank A Status</CardTitle>
          <Droplet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1">
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
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-lg font-medium">Tank B Status</CardTitle>
          <Droplet className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1">
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

      <Card className="bg-purple-50">
        <CardHeader className="flex flex-row items-center justify-between py-2">
          <CardTitle className="text-lg font-medium">Direct Processing</CardTitle>
          <Droplet className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Volume:</span>
              <span className="text-lg font-bold text-purple-600">{directProcessing.volume.toFixed(2)}L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Temperature:</span>
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-lg font-bold text-gray-700">{directProcessing.lastTemperature}°C</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-2">
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-2xl font-bold">
            {(tankA.volume + tankB.volume + directProcessing.volume).toFixed(2)}L
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
