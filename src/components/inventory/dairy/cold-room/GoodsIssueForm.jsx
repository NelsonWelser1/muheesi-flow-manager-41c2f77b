
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

const GoodsIssueForm = ({ userId, username }) => {
  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { session } = useSupabaseAuth();

  const [productCategory, setProductCategory] = useState('');
  const [selectedColdRoom, setSelectedColdRoom] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [availableProductCategories, setAvailableProductCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cold Room options
  const coldRoomOptions = [
    { id: 'FACTORY-CR1', name: 'Factory Cold Room' },
    { id: 'KAMPALA-RTL', name: 'Kampala Retail' }
  ];

  // Fetch available product categories from stored inventory
  const fetchAvailableCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('product_category')
        .eq('movement_action', 'In') // Only get records that were stored
        .order('storage_date_time', { ascending: false });

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map(item => item.product_category))];
      console.log('Available product categories:', categories);
      setAvailableProductCategories(categories);
    } catch (error) {
      console.error('Error fetching product categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product categories",
        variant: "destructive",
      });
    }
  };

  // Fetch available batches based on selected product category and cold room
  const fetchAvailableBatches = async () => {
    setIsLoading(true);
    try {
      if (!productCategory || !selectedColdRoom) return;

      console.log('Fetching available batches for category:', productCategory, 'and cold room:', selectedColdRoom);
      
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .eq('product_category', productCategory)
        .eq('cold_room_id', selectedColdRoom)
        .eq('movement_action', 'In') // Only consider items that were received
        .order('storage_date_time', { ascending: false });

      if (error) throw error;

      // Check current stock levels - you might need to implement a more sophisticated inventory tracking system
      // For now, we'll assume all received items are available for issue
      console.log('Available batches:', data);
      setAvailableBatches(data || []);
    } catch (error) {
      console.error('Error fetching available batches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available batches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCategories();
  }, []);

  useEffect(() => {
    fetchAvailableBatches();
  }, [productCategory, selectedColdRoom]);

  const handleColdRoomChange = (coldRoomId) => {
    console.log('Cold Room changed:', coldRoomId);
    setSelectedColdRoom(coldRoomId);
    setValue('cold_room_id', coldRoomId);
    setSelectedBatch(null);
    setValue('batch_id', '');
    setValue('production_batch_id', '');
    setValue('product_type', '');
    setValue('unit_weight', '');
    setValue('unit_quantity', '');
  };

  const handleProductCategoryChange = (category) => {
    console.log('Product category changed:', category);
    setProductCategory(category);
    setSelectedBatch(null);
    setValue('batch_id', '');
    setValue('production_batch_id', '');
    setValue('product_type', '');
    setValue('unit_weight', '');
    setValue('unit_quantity', '');
  };

  const handleBatchSelect = (batchId) => {
    console.log('Batch selected:', batchId);
    const selected = availableBatches.find(b => b.batch_id === batchId);
    
    if (selected) {
      setSelectedBatch(selected);
      
      // Populate form fields
      setValue('batch_id', selected.batch_id);
      setValue('production_batch_id', selected.production_batch_id);
      setValue('product_type', selected.product_type);
      setValue('unit_weight', selected.unit_weight);
      
      // Default issue quantity to the stored quantity
      // In a real app, you might want to allow partial issues
      setValue('unit_quantity', selected.unit_quantity);
      setValue('cold_room_id', selected.cold_room_id);
      
      toast({
        title: "Batch Selected",
        description: `Selected batch: ${selected.batch_id} (${selected.product_type})`,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!session) {
        console.log('Proceeding without authentication for testing');
      }

      // Validate the issue quantity doesn't exceed the available quantity
      if (data.unit_quantity > selectedBatch.unit_quantity) {
        toast({
          title: "Error",
          description: "Issue quantity cannot exceed available quantity",
          variant: "destructive",
        });
        return;
      }

      // Debug log to verify data being sent to Supabase
      console.log('Submitting goods issue data to Supabase:', {
        ...data,
        product_category: productCategory,
        operator_id: session?.user?.id || 'test-user',
        storage_date_time: new Date().toISOString(),
        movement_action: 'Out' // Hardcoded to "Out" for Goods Issue
      });

      const { error } = await supabase
        .from('cold_room_inventory')
        .insert([{
          ...data,
          product_category: productCategory,
          operator_id: session?.user?.id || 'test-user',
          storage_date_time: new Date().toISOString(),
          movement_action: 'Out' // Always "Out" for goods issue
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Goods issue has been successfully recorded",
      });

      reset();
      setSelectedBatch(null);
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: "Error",
        description: "Failed to submit goods issue. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cold_room_id">Cold Room ID</Label>
          <Select onValueChange={handleColdRoomChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Cold Room" />
            </SelectTrigger>
            <SelectContent>
              {coldRoomOptions.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} ({room.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_category">Product Category</Label>
          <Select onValueChange={handleProductCategoryChange} disabled={!selectedColdRoom}>
            <SelectTrigger>
              <SelectValue placeholder={!selectedColdRoom ? "Select Cold Room first" : "Select product category"} />
            </SelectTrigger>
            <SelectContent>
              {availableProductCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_selection">Select Batch</Label>
          <Select 
            onValueChange={handleBatchSelect}
            disabled={!productCategory || !selectedColdRoom || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading batches..." : "Select a batch"} />
            </SelectTrigger>
            <SelectContent>
              {availableBatches.map((batch) => (
                <SelectItem key={batch.id} value={batch.batch_id}>
                  {`${batch.batch_id} - ${batch.product_type} (${batch.unit_quantity} units)`}
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
            placeholder="Batch ID will be auto-filled"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="production_batch_id">Production Batch ID</Label>
          <Input
            id="production_batch_id"
            {...register('production_batch_id', { required: true })}
            placeholder="Production batch ID will be auto-filled"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_type">Product Type</Label>
          <Input
            id="product_type"
            {...register('product_type', { required: true })}
            placeholder="Product type will be auto-filled"
            readOnly
          />
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
            placeholder="Unit weight will be auto-filled"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_quantity">Unit Quantity to Issue</Label>
          <Input
            id="unit_quantity"
            type="number"
            {...register('unit_quantity', { 
              required: true,
              min: 1,
              max: selectedBatch?.unit_quantity || 999999
            })}
          />
          {selectedBatch && (
            <p className="text-sm text-muted-foreground mt-1">
              Available: {selectedBatch.unit_quantity} units
            </p>
          )}
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

        <div className="space-y-2 col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            {...register('remarks')}
            placeholder="Enter any additional remarks"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!selectedBatch}
      >
        Submit Goods Issue
      </Button>
    </form>
  );
};

export default GoodsIssueForm;
