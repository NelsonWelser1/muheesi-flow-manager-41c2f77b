import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MilkVolumeGraph from './MilkVolumeGraph';

const StorageTankManagement = () => {
  const [selectedTank, setSelectedTank] = useState(null);
  const [milkVolume, setMilkVolume] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const { toast } = useToast();

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
      
      console.log('Fetched storage tanks:', data);
      return data || [];
    }
  });

  const calculateTotalCost = () => {
    if (!milkVolume || !pricePerLiter) return 0;
    return parseFloat(milkVolume) * parseFloat(pricePerLiter);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTank) {
      toast({
        title: "Error",
        description: "Please select a tank first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('milk_transactions')
        .insert({
          tank_id: selectedTank.id,
          liters_added: parseFloat(milkVolume),
          temperature: parseFloat(temperature),
          price_per_liter: parseFloat(pricePerLiter)
        });
      
      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('storage_tanks')
        .update({ 
          current_volume: selectedTank.current_volume + parseFloat(milkVolume),
          last_temperature: parseFloat(temperature)
        })
        .eq('id', selectedTank.id);
      
      if (updateError) throw updateError;

      setMilkVolume('');
      setTemperature('');
      setPricePerLiter('');
      setSelectedTank(null);

      toast({
        title: "Success",
        description: "Milk volume updated successfully",
      });
    } catch (error) {
      console.error('Error updating milk volume:', error);
      toast({
        title: "Error",
        description: "Failed to update milk volume",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tank">Select Tank</Label>
                <select 
                  id="tank"
                  className="w-full p-2 border rounded"
                  value={selectedTank?.id || ''}
                  onChange={(e) => setSelectedTank(tanks.find(t => t.id === e.target.value))}
                >
                  <option value="">Select a tank</option>
                  {tanks.map((tank) => (
                    <option key={tank.id} value={tank.id}>
                      {tank.name} (Current: {tank.current_volume}L)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="volume">Milk Volume (Liters)</Label>
                <Input
                  id="volume"
                  type="number"
                  value={milkVolume}
                  onChange={(e) => setMilkVolume(e.target.value)}
                  placeholder="Enter milk volume"
                  required
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="Enter temperature"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price per Liter (UGX)</Label>
                <Input
                  id="price"
                  type="number"
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(e.target.value)}
                  placeholder="Enter price per liter"
                  required
                />
              </div>

              <div>
                <Label>Total Cost (UGX)</Label>
                <div className="text-lg font-bold">{calculateTotalCost().toLocaleString()}</div>
              </div>

              <Button type="submit" className="w-full">
                Add Milk Volume
              </Button>
            </form>
          </CardContent>
        </Card>

        <MilkVolumeGraph tankId={selectedTank?.id} />
      </div>
    </div>
  );
};

export default StorageTankManagement;