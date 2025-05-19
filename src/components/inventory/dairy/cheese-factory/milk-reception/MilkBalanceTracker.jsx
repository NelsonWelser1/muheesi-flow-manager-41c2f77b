
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';
import { Thermometer, Droplet, AlertTriangle, Volume } from 'lucide-react';

const MilkBalanceTracker = () => {
  const { data: milkReceptionData, isLoading, error } = useMilkReception();

  const calculateTankBalance = (tankName) => {
    // First, validate that we have data
    if (!milkReceptionData || !Array.isArray(milkReceptionData) || milkReceptionData.length === 0) {
      console.log(`No valid data for ${tankName} calculations`);
      return { volume: 0, lastTemperature: 0 };
    }

    // Filter records by tank name with strict equality checking
    const tankRecords = milkReceptionData.filter(record => 
      record && record.tank_number && record.tank_number === tankName
    );
    
    console.log(`Records for ${tankName}:`, tankRecords.length);

    if (tankRecords.length === 0) {
      console.log(`No records found for ${tankName}`);
      return { volume: 0, lastTemperature: 0 };
    }

    // Accumulate the tank data with explicit number conversions
    const tankData = tankRecords.reduce((acc, record) => {
      // Explicitly convert milk_volume to number and validate it exists
      if (record && record.milk_volume !== null && record.milk_volume !== undefined) {
        const volumeValue = Number(record.milk_volume);
        if (!isNaN(volumeValue)) {
          acc.volume += volumeValue;
        } else {
          console.log(`Invalid milk volume for record in ${tankName}:`, record.milk_volume);
        }
      }
      
      // Update temperature only if it's valid and the most recent record
      if (record && record.temperature !== null && record.temperature !== undefined && 
          (!acc.lastTimestamp || new Date(record.created_at) > new Date(acc.lastTimestamp))) {
        const tempValue = Number(record.temperature);
        if (!isNaN(tempValue)) {
          acc.lastTemperature = tempValue;
          acc.lastTimestamp = record.created_at;
        } else {
          console.log(`Invalid temperature for record in ${tankName}:`, record.temperature);
        }
      }
      return acc;
    }, { volume: 0, lastTemperature: 0, lastTimestamp: null });

    // Ensure we don't return negative volumes
    return {
      volume: Math.max(0, tankData.volume),
      lastTemperature: tankData.lastTemperature
    };
  };

  // Calculate balances for each tank with robust error handling
  const calculateSafeTankBalance = (tankName) => {
    try {
      return calculateTankBalance(tankName);
    } catch (err) {
      console.error(`Error calculating ${tankName} balance:`, err);
      return { volume: 0, lastTemperature: 0 };
    }
  };

  const tankA = calculateSafeTankBalance('Tank A');
  const tankB = calculateSafeTankBalance('Tank B');
  const directProcessing = calculateSafeTankBalance('Direct-Processing');
  
  // Calculate total volume with explicit number conversions
  const totalVolume = Number(tankA.volume || 0) + Number(tankB.volume || 0) + Number(directProcessing.volume || 0);
  
  // Comprehensive debugging output
  console.log('Tank balances calculated:', { 
    tankA: { volume: tankA.volume, temp: tankA.lastTemperature },
    tankB: { volume: tankB.volume, temp: tankB.lastTemperature }, 
    directProcessing: { volume: directProcessing.volume, temp: directProcessing.lastTemperature }
  });
  console.log('Total volume calculated:', totalVolume);
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading tank data...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500 flex items-center justify-center">
        <AlertTriangle className="mr-2" /> Error loading tank data
      </div>
    );
  }

  // Print detailed diagnostics about the data we're working with
  if (milkReceptionData) {
    console.log('Raw milk reception data count:', milkReceptionData.length);
    
    // Count by tank with null check in filter
    const tankACount = milkReceptionData.filter(r => r && r.tank_number === 'Tank A').length;
    const tankBCount = milkReceptionData.filter(r => r && r.tank_number === 'Tank B').length;
    const directCount = milkReceptionData.filter(r => r && r.tank_number === 'Direct-Processing').length;
    
    console.log('Tank A records:', tankACount);
    console.log('Tank B records:', tankBCount);
    console.log('Direct Processing records:', directCount);
    console.log('Unassigned records:', milkReceptionData.length - tankACount - tankBCount - directCount);
    
    // Sample data from each tank for verification
    if (tankBCount > 0) {
      const sampleB = milkReceptionData.find(r => r && r.tank_number === 'Tank B');
      console.log('Sample Tank B record:', sampleB);
    }
  }

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
            {totalVolume.toFixed(2)}L
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
