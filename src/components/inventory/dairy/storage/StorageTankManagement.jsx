import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Droplet, AlertTriangle, Trash2 } from "lucide-react";
import MilkVolumeGraph from './MilkVolumeGraph';
import CleaningRecordsTable from './CleaningRecordsTable';
import AddCleaningRecord from './AddCleaningRecord';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StorageTankManagement = () => {
  const [selectedTank, setSelectedTank] = useState(null);
  const [milkVolume, setMilkVolume] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const { toast } = useToast();

  // Fetch tanks data
  const { data: tanks, isLoading, refetch: refetchTanks } = useQuery({
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

  // Fetch cleaning records
  const { data: cleaningRecords } = useQuery({
    queryKey: ['cleaningRecords', selectedTank],
    enabled: !!selectedTank,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cleaning_records')
        .select(`
          id,
          cleaned_at,
          notes,
          storage_tanks (name)
        `)
        .eq('tank_id', selectedTank)
        .order('cleaned_at', { ascending: false });

      if (error) throw error;
      return data.map(record => ({
        ...record,
        tank_name: record.storage_tanks.name
      }));
    }
  });

  // Calculate total cost
  const calculateTotalCost = () => {
    return (parseFloat(milkVolume) || 0) * (parseFloat(pricePerLiter) || 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting tank update:', { selectedTank, milkVolume, temperature, pricePerLiter });
    
    try {
      const selectedTankData = tanks.find(t => t.id === selectedTank);
      const newVolume = selectedTankData.current_volume + parseFloat(milkVolume);
      
      if (newVolume > selectedTankData.capacity) {
        toast({
          title: "Error",
          description: "Adding this volume would exceed tank capacity",
          variant: "destructive",
        });
        return;
      }

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
      
      // Update tank volume
      const { error: updateError } = await supabase
        .from('storage_tanks')
        .update({ 
          current_volume: newVolume,
          temperature: parseFloat(temperature)
        })
        .eq('id', selectedTank);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Tank updated successfully",
      });

      // Reset form
      setMilkVolume('');
      setTemperature('');
      setPricePerLiter('');
      refetchTanks();
      
    } catch (error) {
      console.error('Error updating tank:', error);
      toast({
        title: "Error",
        description: "Failed to update tank",
        variant: "destructive",
      });
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
                className={`${getTankStatusColor(tank)} border cursor-pointer transition-all hover:shadow-lg`}
                onClick={() => setSelectedTank(tank.id)}
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
                      <span className={temperature > 4.5 ? 'text-red-500' : 'text-green-500'}>
                        {tank.temperature}°C
                      </span>
                    </div>
                    {tank.last_cleaned_at && (
                      <div className="text-sm text-gray-500">
                        Last cleaned: {new Date(tank.last_cleaned_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="update" className="w-full">
            <TabsList>
              <TabsTrigger value="update">Update Tank</TabsTrigger>
              <TabsTrigger value="cleaning">Cleaning Records</TabsTrigger>
            </TabsList>

            <TabsContent value="update">
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
            </TabsContent>

            <TabsContent value="cleaning">
              {selectedTank ? (
                <div className="space-y-4">
                  <AddCleaningRecord 
                    tankId={selectedTank}
                    onRecordAdded={() => {
                      refetchTanks();
                    }}
                  />
                  <CleaningRecordsTable records={cleaningRecords || []} />
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Please select a tank to view cleaning records
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <MilkVolumeGraph />
      
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