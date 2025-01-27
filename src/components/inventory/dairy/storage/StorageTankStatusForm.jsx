import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Droplet, Clock, User } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const StorageTankStatusForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTank, setSelectedTank] = useState('');
  const [cleaningRecord, setCleaningRecord] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    cleanerId: ''
  });
  const [volumeData, setVolumeData] = useState({
    initialVolume: '',
    addedVolume: '',
    temperature: ''
  });

  // Fetch tanks data
  const { data: tanks, isLoading } = useQuery({
    queryKey: ['storageTanks'],
    queryFn: async () => {
      console.log('Fetching storage tanks data');
      const { data, error } = await supabase
        .from('storage_tanks')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate current volume
  const calculateCurrentVolume = () => {
    const initial = parseFloat(volumeData.initialVolume) || 0;
    const added = parseFloat(volumeData.addedVolume) || 0;
    return initial + added;
  };

  // Submit tank status update
  const submitMutation = useMutation({
    mutationFn: async (formData) => {
      console.log('Submitting tank status update:', formData);
      const { error } = await supabase
        .from('storage_tanks')
        .update({
          current_volume: formData.currentVolume,
          temperature: formData.temperature,
          last_cleaned: formData.cleaningRecord.date + ' ' + formData.cleaningRecord.time,
          cleaner_id: formData.cleaningRecord.cleanerId
        })
        .eq('id', formData.tankId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['storageTanks']);
      toast({
        title: "Success",
        description: "Tank status updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating tank status:', error);
      toast({
        title: "Error",
        description: "Failed to update tank status",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate({
      tankId: selectedTank,
      currentVolume: calculateCurrentVolume(),
      temperature: parseFloat(volumeData.temperature),
      cleaningRecord
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          Storage Tank Status Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tank">Select Tank</Label>
              <Select 
                value={selectedTank}
                onValueChange={setSelectedTank}
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
              <Label htmlFor="initialVolume">Initial Volume (L)</Label>
              <Input
                id="initialVolume"
                type="number"
                value={volumeData.initialVolume}
                onChange={(e) => setVolumeData(prev => ({
                  ...prev,
                  initialVolume: e.target.value
                }))}
                placeholder="Enter initial volume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addedVolume">Added Volume (L)</Label>
              <Input
                id="addedVolume"
                type="number"
                value={volumeData.addedVolume}
                onChange={(e) => setVolumeData(prev => ({
                  ...prev,
                  addedVolume: e.target.value
                }))}
                placeholder="Enter added volume"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <div className="relative">
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={volumeData.temperature}
                  onChange={(e) => setVolumeData(prev => ({
                    ...prev,
                    temperature: e.target.value
                  }))}
                  placeholder="Enter temperature"
                  className="pl-9"
                />
                <Thermometer className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Cleaning Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleaningDate">Date</Label>
                <Input
                  id="cleaningDate"
                  type="date"
                  value={cleaningRecord.date}
                  onChange={(e) => setCleaningRecord(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaningTime">Time</Label>
                <Input
                  id="cleaningTime"
                  type="time"
                  value={cleaningRecord.time}
                  onChange={(e) => setCleaningRecord(prev => ({
                    ...prev,
                    time: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleanerId">Cleaner ID</Label>
                <div className="relative">
                  <Input
                    id="cleanerId"
                    value={cleaningRecord.cleanerId}
                    onChange={(e) => setCleaningRecord(prev => ({
                      ...prev,
                      cleanerId: e.target.value
                    }))}
                    placeholder="Enter cleaner ID"
                    className="pl-9"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Current Volume: </span>
              <span className="font-bold">{calculateCurrentVolume()} L</span>
            </div>
            <Button type="submit">Update Tank Status</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StorageTankStatusForm;