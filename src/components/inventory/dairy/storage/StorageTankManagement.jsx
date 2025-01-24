import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Droplet, AlertTriangle } from "lucide-react";
import MilkVolumeGraph from './MilkVolumeGraph';
import { predictProduction } from '@/utils/productionAI';

const StorageTankManagement = () => {
  // Move all hooks to the top level
  const [selectedTank, setSelectedTank] = useState(null);
  const [milkVolume, setMilkVolume] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');

  // Query for tanks data
  const { data: tanks, isLoading } = useQuery({
    queryKey: ['storageTanks'],
    queryFn: async () => {
      console.log('Fetching storage tanks data');
      const { data, error } = await supabase
        .from('storage_tanks')
        .select('*');
      
      if (error) {
        console.error('Error fetching storage tanks:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Query for milk volume data - moved outside of conditional
  const { data: volumeData } = useQuery({
    queryKey: ['milkVolumes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milk_transactions')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map(transaction => ({
        date: transaction.created_at,
        volume: transaction.liters_added,
        predicted: null
      }));
    }
  });

  // Calculate predicted data - moved outside conditional
  const predictedData = React.useMemo(() => {
    if (!volumeData) return [];
    return predictProduction(volumeData);
  }, [volumeData]);

  // Calculate total cost
  const calculateTotalCost = () => {
    return (parseFloat(milkVolume) || 0) * (parseFloat(pricePerLiter) || 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting tank update:', { selectedTank, milkVolume, temperature, pricePerLiter });
    
    try {
      const { error } = await supabase
        .from('milk_transactions')
        .insert([{
          tank_id: selectedTank,
          liters_added: parseFloat(milkVolume),
          temperature: parseFloat(temperature),
          price_per_liter: parseFloat(pricePerLiter),
          total_cost: calculateTotalCost()
        }]);

      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('storage_tanks')
        .update({ 
          current_volume: supabase.raw('current_volume + ?', [parseFloat(milkVolume)]),
          temperature: parseFloat(temperature)
        })
        .eq('id', selectedTank);

      if (updateError) throw updateError;

      setMilkVolume('');
      setTemperature('');
      setPricePerLiter('');
      
    } catch (error) {
      console.error('Error updating tank:', error);
    }
  };

  const getTankStatusColor = (tank) => {
    const capacityPercentage = (tank.current_volume / tank.capacity) * 100;
    if (capacityPercentage >= 90) return 'bg-red-100 border-red-300';
    if (capacityPercentage >= 75) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Storage Tank Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {tanks?.map((tank) => (
              <Card 
                key={tank.id} 
                className={`${getTankStatusColor(tank)} border`}
              >
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-2">{tank.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Droplet className="h-4 w-4 mr-2" />
                        <span>Volume:</span>
                      </div>
                      <span>{tank.current_volume}/{tank.capacity}L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 mr-2" />
                        <span>Temperature:</span>
                      </div>
                      <span>{tank.temperature}°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tank">Select Tank</Label>
                <Select 
                  onValueChange={setSelectedTank}
                  value={selectedTank}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tank" />
                  </SelectTrigger>
                  <SelectContent>
                    {tanks?.map((tank) => (
                      <SelectItem key={tank.id} value={tank.id}>
                        {tank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="Enter temperature"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume Added (L)</Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  value={milkVolume}
                  onChange={(e) => setMilkVolume(e.target.value)}
                  placeholder="Enter volume"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Liter (UGX)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.1"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(e.target.value)}
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Total Cost: </span>
                <span className="font-bold">UGX {calculateTotalCost().toLocaleString()}</span>
              </div>
              <Button type="submit">Update Tank</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Add the new graph component */}
      <MilkVolumeGraph 
        data={volumeData || []} 
        predictedData={predictedData}
      />
      
      <Card className="bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tanks?.filter(tank => (tank.current_volume / tank.capacity) * 100 >= 90).map(tank => (
              <div key={tank.id} className="flex items-center text-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>{tank.name} is nearly full ({Math.round((tank.current_volume / tank.capacity) * 100)}% capacity)</span>
              </div>
            ))}
            {tanks?.filter(tank => tank.temperature > 4.5).map(tank => (
              <div key={tank.id} className="flex items-center text-yellow-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>{tank.name} temperature is above optimal (Current: {tank.temperature}°C)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageTankManagement;
