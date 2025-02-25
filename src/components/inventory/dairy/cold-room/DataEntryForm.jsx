
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { format } from 'date-fns';

const DataEntryForm = ({ userId, username }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const [productType, setProductType] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [availableProductTypes, setAvailableProductTypes] = useState([]);
  const [availableProductionBatches, setAvailableProductionBatches] = useState([]);

  // Product type options
  const cheeseTypes = [
    { value: 'Mozzarella', prefix: 'MOZ' },
    { value: 'Gouda', prefix: 'GOU' },
    { value: 'Parmesan', prefix: 'PAR' },
    { value: 'Swiss', prefix: 'SUI' },
    { value: 'Blue Cheese', prefix: 'BLU' }
  ];

  const yogurtTypes = [
    { value: 'Plain Yogurt', prefix: 'PLY' },
    { value: 'Greek Yogurt', prefix: 'GRY' },
    { value: 'Flavored Yogurt', prefix: 'FLY' },
    { value: 'Low-Fat Yogurt', prefix: 'LFY' },
    { value: 'Probiotic Yogurt', prefix: 'PRY' }
  ];

  const fetchProductionBatchIds = async () => {
    console.log('Fetching production batch IDs');
    try {
      // Fetch from international production line
      const { data: internationalBatches, error: intError } = await supabase
        .from('production_line_international')
        .select('batch_id, cheese_type, created_at')
        .order('created_at', { ascending: false });

      if (intError) throw intError;

      // Fetch from local production line
      const { data: localBatches, error: localError } = await supabase
        .from('production_line_local')
        .select('batch_id, cheese_type, created_at')
        .order('created_at', { ascending: false });

      if (localError) throw localError;

      // Combine and format batches
      const allBatches = [
        ...(internationalBatches || []).map(b => ({ ...b, line: 'International' })),
        ...(localBatches || []).map(b => ({ ...b, line: 'Local' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      console.log('Fetched production batches:', allBatches);
      setAvailableProductionBatches(allBatches);
    } catch (error) {
      console.error('Error fetching production batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch production batch IDs",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProductionBatchIds();
  }, []);

  useEffect(() => {
    // Update available product types based on category
    if (productCategory === 'cheese') {
      setAvailableProductTypes(cheeseTypes);
    } else if (productCategory === 'yogurt') {
      setAvailableProductTypes(yogurtTypes);
    } else {
      setAvailableProductTypes([]);
    }
  }, [productCategory]);

  const generateBatchId = async (type) => {
    const now = new Date();
    const datePrefix = format(now, 'yyyyMMdd');
    const timeComponent = format(now, 'HHmmss');
    
    // Cold room prefix is "CLD"
    const roomPrefix = 'CLD';
    
    // Get product type prefix
    const selectedType = [...cheeseTypes, ...yogurtTypes].find(t => t.value === type);
    const typePrefix = selectedType?.prefix || 'GEN';
    
    // Combine all components
    return `${roomPrefix}${datePrefix}-${typePrefix}-${timeComponent}`;
  };

  const handleProductCategoryChange = (category) => {
    console.log('Product category changed:', category);
    setProductCategory(category);
    setProductType('');
    setValue('product_type', '');
  };

  const handleProductTypeChange = async (type) => {
    console.log('Product type changed:', type);
    setProductType(type);
    const newBatchId = await generateBatchId(type);
    setValue('batch_id', newBatchId);
    setValue('product_type', type);
    
    toast({
      title: "Batch ID Generated",
      description: `New batch ID: ${newBatchId}`,
    });
  };

  const handleProductionBatchSelect = (batchId) => {
    console.log('Production batch selected:', batchId);
    const selectedBatch = availableProductionBatches.find(b => b.batch_id === batchId);
    if (selectedBatch) {
      setValue('production_batch_id', batchId);
      toast({
        title: "Production Batch Selected",
        description: `Selected batch: ${batchId} from ${selectedBatch.line} line`,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!session) {
        console.log('Proceeding without authentication for testing');
      }

      // Debug log to verify data being sent to Supabase
      console.log('Submitting data to Supabase:', {
        ...data,
        product_category: productCategory,
        operator_id: session?.user?.id || 'test-user',
        storage_date_time: new Date().toISOString()
      });

      const { error } = await supabase
        .from('cold_room_inventory')
        .insert([{
          ...data,
          product_category: productCategory,
          operator_id: session?.user?.id || 'test-user',
          storage_date_time: new Date().toISOString()
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Data has been successfully recorded",
      });

      reset();
      setProductType('');
      setProductCategory('');
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cold_room_id">Cold Room ID</Label>
          <Input
            id="cold_room_id"
            {...register('cold_room_id', { required: true })}
            placeholder="Enter Cold Room ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_category">Product Category</Label>
          <Select onValueChange={handleProductCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select product category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheese">Cheese</SelectItem>
              <SelectItem value="yogurt">Yogurt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_type">Product Type</Label>
          <Select onValueChange={handleProductTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              {availableProductTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_id">Cold Room Batch ID</Label>
          <Input
            id="batch_id"
            {...register('batch_id', { required: true })}
            placeholder="Batch ID will be generated automatically"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="production_batch_id">Production Batch ID</Label>
          <Select onValueChange={handleProductionBatchSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select production batch" />
            </SelectTrigger>
            <SelectContent>
              {availableProductionBatches.map((batch) => (
                <SelectItem key={batch.batch_id} value={batch.batch_id}>
                  {`${batch.line} - ${batch.batch_id} (${batch.cheese_type})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_weight">Unit Weight (kg)</Label>
          <Input
            id="unit_weight"
            type="number"
            step="0.01"
            {...register('unit_weight', { 
              required: true,
              min: 0
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_quantity">Unit Quantity</Label>
          <Input
            id="unit_quantity"
            type="number"
            {...register('unit_quantity', { 
              required: true,
              min: 0
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            {...register('temperature', { 
              required: true,
              min: -10,
              max: 30
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="humidity">Humidity (%)</Label>
          <Input
            id="humidity"
            type="number"
            step="0.1"
            {...register('humidity', { 
              required: true,
              min: 0,
              max: 100
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="movement_action">Movement Action</Label>
          <Select onValueChange={(value) => setValue('movement_action', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In">In</SelectItem>
              <SelectItem value="Out">Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            {...register('remarks')}
            placeholder="Enter any additional remarks"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default DataEntryForm;
