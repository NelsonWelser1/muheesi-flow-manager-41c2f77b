
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const ProductionLineForm = ({ productionLine }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableOffloads, setAvailableOffloads] = useState([]);
  const [selectedOffload, setSelectedOffload] = useState(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      batch_id: '',
      milk_volume: '',
      start_time: '',
      end_time: '',
      operator_name: '',
      notes: '',
      offload_batch_id: ''
    }
  });

  // Function to fetch already used batch IDs from both production lines
  const fetchUsedBatchIds = async () => {
    try {
      const [internationalRes, localRes] = await Promise.all([
        supabase
          .from('production_line_international')
          .select('offload_batch_id')
          .not('offload_batch_id', 'is', null),
        supabase
          .from('production_line_local')
          .select('offload_batch_id')
          .not('offload_batch_id', 'is', null)
      ]);

      const usedBatches = [
        ...(internationalRes.data || []).map(b => b.offload_batch_id),
        ...(localRes.data || []).map(b => b.offload_batch_id)
      ];

      return usedBatches;
    } catch (error) {
      console.error('Error fetching used batch IDs:', error);
      return [];
    }
  };

  // Fetch milk reception data and filter out used batches
  useEffect(() => {
    const fetchMilkOffloads = async () => {
      try {
        const usedBatchIds = await fetchUsedBatchIds();
        
        const { data: offloads, error } = await supabase
          .from('milk_reception')
          .select('*')
          .filter('supplier_name', 'like', 'Offload from%')
          .filter('tank_number', 'in', '("Tank A","Tank B","Direct-Processing")')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter out already used batch IDs
        const availableOffloads = offloads.filter(offload => 
          !usedBatchIds.includes(offload.batch_id)
        );

        setAvailableOffloads(availableOffloads);
      } catch (error) {
        console.error('Error fetching milk offloads:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available milk offloads",
          variant: "destructive"
        });
      }
    };

    fetchMilkOffloads();
  }, [toast]);

  const handleOffloadSelect = (selectedBatchId) => {
    const selectedRecord = availableOffloads.find(offload => offload.batch_id === selectedBatchId);
    if (selectedRecord) {
      setSelectedOffload(selectedRecord);
      setValue('milk_volume', Math.abs(selectedRecord.milk_volume).toFixed(2));
      setValue('offload_batch_id', selectedRecord.batch_id);
      toast({
        title: "Milk Volume Updated",
        description: `Volume set to ${Math.abs(selectedRecord.milk_volume).toFixed(2)}L from batch ${selectedRecord.batch_id}`,
      });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const tableName = productionLine.name.toLowerCase().includes('international') 
        ? 'production_line_international' 
        : 'production_line_local';

      const { error } = await supabase
        .from(tableName)
        .insert({
          ...data,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Production line record created successfully",
      });

      reset();
      setSelectedOffload(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to create production line record",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offload_batch_id">Select Milk Offload</Label>
              <Select onValueChange={handleOffloadSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select offload batch" />
                </SelectTrigger>
                <SelectContent>
                  {availableOffloads.map((offload) => (
                    <SelectItem key={offload.batch_id} value={offload.batch_id}>
                      {`${offload.tank_number} - ${offload.batch_id} (${Math.abs(offload.milk_volume)}L)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="milk_volume">Milk Volume (L)</Label>
              <Input 
                id="milk_volume"
                type="number"
                step="0.01"
                {...register('milk_volume')}
                readOnly
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input 
                id="start_time"
                type="datetime-local"
                {...register('start_time')}
              />
            </div>

            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input 
                id="end_time"
                type="datetime-local"
                {...register('end_time')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="operator_name">Operator Name</Label>
            <Input 
              id="operator_name"
              {...register('operator_name')}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes"
              {...register('notes')}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Start Production"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
