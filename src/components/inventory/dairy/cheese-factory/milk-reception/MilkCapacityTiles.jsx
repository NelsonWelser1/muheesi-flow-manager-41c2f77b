
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';
import { Droplet, Thermometer, TrendingUp } from 'lucide-react';
import DirectProcessingAlerts from './DirectProcessingAlerts';

const MilkCapacityTiles = () => {
  const { data: milkReceptionData } = useMilkReception();

  // Tank capacity limits (in liters)
  const TANK_CAPACITIES = {
    'Tank A': 5000,
    'Tank B': 3000,
    'Direct-Processing': null // Unlimited capacity
  };

  const calculateTankData = (tankName) => {
    if (!milkReceptionData || milkReceptionData.length === 0) {
      return { 
        currentVolume: 0, 
        lastTemperature: 0, 
        capacity: TANK_CAPACITIES[tankName] || null,
        utilizationPercentage: 0
      };
    }

    const tankRecords = milkReceptionData
      .filter(record => record.tank_number === tankName)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const currentVolume = tankRecords.reduce((total, record) => {
      return total + (record.milk_volume || 0);
    }, 0);

    const lastTemperature = tankRecords.length > 0 ? tankRecords[0].temperature : 0;
    const capacity = TANK_CAPACITIES[tankName];
    
    // For unlimited capacity (Direct Processing), utilization is always 0
    const utilizationPercentage = capacity && capacity > 0 ? Math.min((currentVolume / capacity) * 100, 100) : 0;

    return {
      currentVolume: Math.max(0, currentVolume),
      lastTemperature,
      capacity,
      utilizationPercentage
    };
  };

  const tankA = calculateTankData('Tank A');
  const tankB = calculateTankData('Tank B');
  const directProcessing = calculateTankData('Direct-Processing');

  const totalCurrentVolume = tankA.currentVolume + tankB.currentVolume + directProcessing.currentVolume;
  const totalCapacity = tankA.capacity + tankB.capacity; // Don't include unlimited capacity in total
  const totalUtilization = totalCapacity > 0 ? (totalCurrentVolume / totalCapacity) * 100 : 0;

  const getTileColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-50 border-red-200';
    if (percentage >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      {/* Direct Processing Alerts */}
      <DirectProcessingAlerts />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tank A */}
        <Card className={`${getTileColor(tankA.utilizationPercentage)}`}>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-lg font-medium">Tank A</CardTitle>
            <Droplet className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current:</span>
                <span className="text-xl font-bold text-blue-600">
                  {tankA.currentVolume.toFixed(1)}L
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity:</span>
                <span className="text-sm font-medium">{tankA.capacity}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilization:</span>
                <span className={`text-sm font-bold ${getUtilizationColor(tankA.utilizationPercentage)}`}>
                  {tankA.utilizationPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Temperature:</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-red-500" />
                  <span className="text-sm font-medium">{tankA.lastTemperature}°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tank B */}
        <Card className={`${getTileColor(tankB.utilizationPercentage)}`}>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-lg font-medium">Tank B</CardTitle>
            <Droplet className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current:</span>
                <span className="text-xl font-bold text-green-600">
                  {tankB.currentVolume.toFixed(1)}L
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity:</span>
                <span className="text-sm font-medium">{tankB.capacity}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilization:</span>
                <span className={`text-sm font-bold ${getUtilizationColor(tankB.utilizationPercentage)}`}>
                  {tankB.utilizationPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Temperature:</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-red-500" />
                  <span className="text-sm font-medium">{tankB.lastTemperature}°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Direct Processing */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-lg font-medium">Direct Processing</CardTitle>
            <Droplet className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current:</span>
                <span className="text-xl font-bold text-purple-600">
                  {directProcessing.currentVolume.toFixed(1)}L
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity:</span>
                <span className="text-sm font-medium text-blue-600">Unlimited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilization:</span>
                <span className="text-sm font-bold text-green-600">N/A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Temperature:</span>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-red-500" />
                  <span className="text-sm font-medium">{directProcessing.lastTemperature}°C</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Capacity */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-lg font-medium">Total Capacity</CardTitle>
            <TrendingUp className="h-5 w-5 text-slate-600" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current:</span>
                <span className="text-xl font-bold text-slate-700">
                  {totalCurrentVolume.toFixed(1)}L
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Capacity:</span>
                <span className="text-sm font-medium">{totalCapacity}L + Unlimited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tank Utilization:</span>
                <span className={`text-sm font-bold ${getUtilizationColor(totalUtilization)}`}>
                  {totalUtilization.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tank Available:</span>
                <span className="text-sm font-medium text-green-600">
                  {(totalCapacity - (tankA.currentVolume + tankB.currentVolume)).toFixed(1)}L
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MilkCapacityTiles;
