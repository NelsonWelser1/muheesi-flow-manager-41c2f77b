
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
    // Ensure case-insensitive comparison for more reliable matching
    const tankRecords = milkReceptionData.filter(record => 
      record && record.tank_number && record.tank_number.trim().toLowerCase() === tankName.trim().toLowerCase()
    );
    
    console.log(`Records for ${tankName}:`, tankRecords.length);
    if (tankRecords.length > 0) {
      console.log(`Sample record for ${tankName}:`, tankRecords[0]);
    }

    if (tankRecords.length === 0) {
      console.log(`No records found for ${tankName}`);
      return { volume: 0, lastTemperature: 0 };
    }

    // Accumulate the tank data with explicit number conversions
    const tankData = tankRecords.reduce((acc, record) => {
      // Explicitly convert milk_volume to number and validate it exists
      if (record && record.milk_volume !== null && record.milk_volume !== undefined) {
        const volumeValue = Number(record.milk_volume);
        console.log(`Processing record for ${tankName}, volume: ${volumeValue}`);
        
        if (!isNaN(volumeValue)) {
          acc.volume += volumeValue;
          console.log(`Running total for ${tankName}: ${acc.volume}`);
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

    console.log(`Final calculation for ${tankName}:`, tankData);

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

  // Force explicit tank names to ensure consistency
  const tankA = calculateSafeTankBalance('Tank A');
  const tankB = calculateSafeTankBalance('Tank B');
  const directProcessing = calculateSafeTankBalance('Direct-Processing');
  
  // Calculate total volume with explicit number conversions
  const tankAVolume = parseFloat(tankA.volume) || 0;
  const tankBVolume = parseFloat(tankB.volume) || 0; 
  const directProcessingVolume = parseFloat(directProcessing.volume) || 0;
  
  const totalVolume = tankAVolume + tankBVolume + directProcessingVolume;
  
  // Comprehensive debugging output
  console.log('Tank balances calculated:', { 
    tankA: { volume: tankAVolume, temp: tankA.lastTemperature },
    tankB: { volume: tankBVolume, temp: tankB.lastTemperature }, 
    directProcessing: { volume: directProcessingVolume, temp: directProcessing.lastTemperature }
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
              <span className="text-lg font-bold text-blue-600">{tankAVolume.toFixed(2)}L</span>
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
              <span className="text-lg font-bold text-green-600">{tankBVolume.toFixed(2)}L</span>
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
              <span className="text-lg font-bold text-purple-600">{directProcessingVolume.toFixed(2)}L</span>
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
