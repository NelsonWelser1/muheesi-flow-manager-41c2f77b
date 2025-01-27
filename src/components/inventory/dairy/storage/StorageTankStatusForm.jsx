import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Thermometer, Droplet, Clock, User, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const StorageTankStatusForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTank, setSelectedTank] = useState('');
  const [errors, setErrors] = useState({});
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
      
      if (error) {
        console.error('Error fetching tanks:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedTank) {
      newErrors.tank = 'Please select a tank';
    }
    
    if (!volumeData.initialVolume) {
      newErrors.initialVolume = 'Initial volume is required';
    }
    
    if (!volumeData.temperature) {
      newErrors.temperature = 'Temperature is required';
    }
    
    if (!cleaningRecord.cleanerId) {
      newErrors.cleanerId = 'Cleaner ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate current volume
  const calculateCurrentVolume = () => {
    const initial = parseFloat(volumeData.initialVolume) || 0;
    const added = parseFloat(volumeData.addedVolume) || 0;
    return initial + added;
  };

  // Submit tank status update
  const submitMutation = useMutation({
    mutationFn: async (formData) => {
      if (!formData.tankId) {
        throw new Error('Please select a tank');
      }

      console.log('Submitting tank status update:', formData);
      const lastCleaned = `${formData.cleaningRecord.date} ${formData.cleaningRecord.time}`;
      
      const { error } = await supabase
        .from('storage_tanks')
        .update({
          initial_volume: parseFloat(formData.initialVolume) || 0,
          added_volume: parseFloat(formData.addedVolume) || 0,
          current_volume: formData.currentVolume,
          temperature: parseFloat(formData.temperature) || 0,
          last_cleaned: lastCleaned,
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
      // Reset form
      setVolumeData({
        initialVolume: '',
        addedVolume: '',
        temperature: ''
      });
      setSelectedTank('');
      setErrors({});
    },
    onError: (error) => {
      console.error('Error updating tank status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update tank status",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      tankId: selectedTank,
      initialVolume: volumeData.initialVolume,
      addedVolume: volumeData.addedVolume,
      currentVolume: calculateCurrentVolume(),
      temperature: volumeData.temperature,
      cleaningRecord
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
                <Label htmlFor="tank" className={errors.tank ? 'text-red-500' : ''}>
                  Select Tank {errors.tank && <span className="text-red-500">*</span>}
                </Label>
                <Select 
                  value={selectedTank}
                  onValueChange={setSelectedTank}
                >
                  <SelectTrigger className={errors.tank ? 'border-red-500' : ''}>
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
                {errors.tank && <p className="text-sm text-red-500">{errors.tank}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialVolume" className={errors.initialVolume ? 'text-red-500' : ''}>
                  Initial Volume (L) {errors.initialVolume && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="initialVolume"
                  type="number"
                  value={volumeData.initialVolume}
                  onChange={(e) => setVolumeData(prev => ({
                    ...prev,
                    initialVolume: e.target.value
                  }))}
                  placeholder="Enter initial volume"
                  className={errors.initialVolume ? 'border-red-500' : ''}
                />
                {errors.initialVolume && <p className="text-sm text-red-500">{errors.initialVolume}</p>}
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
                <Label htmlFor="temperature" className={errors.temperature ? 'text-red-500' : ''}>
                  Temperature (°C) {errors.temperature && <span className="text-red-500">*</span>}
                </Label>
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
                    className={`pl-9 ${errors.temperature ? 'border-red-500' : ''}`}
                  />
                  <Thermometer className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
                {errors.temperature && <p className="text-sm text-red-500">{errors.temperature}</p>}
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
              <Button 
                type="submit" 
                className="flex items-center gap-2"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? 'Updating...' : 'Update Tank Status'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storage Tanks Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tanks?.map((tank) => (
              <div key={tank.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="space-y-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    {tank.name}
                    {parseFloat(tank.temperature) > 6 && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Last cleaned: {format(new Date(tank.last_cleaned || new Date()), 'PPp')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cleaner ID: {tank.cleaner_id || 'N/A'}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold">{tank.current_volume}L</div>
                  <div className="text-sm text-gray-500">Temperature: {tank.temperature}°C</div>
                  <div className="text-sm text-gray-500">Capacity: {tank.capacity || 5000}L</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageTankStatusForm;
