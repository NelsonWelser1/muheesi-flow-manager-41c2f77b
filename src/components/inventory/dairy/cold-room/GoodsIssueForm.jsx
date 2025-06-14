
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
  const [availableBatches, setAvailableBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [availableProductCategories, setAvailableProductCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usedBatchIds, setUsedBatchIds] = useState(new Set());
  const [currentStock, setCurrentStock] = useState(0);

  // Fetch batches that have already been completely issued
  const fetchUsedBatchIds = async () => {
    try {
      // Get all batches that have been fully issued (Out movement)
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('batch_id, unit_quantity, movement_action')
        .eq('movement_action', 'Out');

      if (error) throw error;

      // Map of batch_id to total issued quantity
      const issuedQuantities = {};
      data.forEach(item => {
        if (!issuedQuantities[item.batch_id]) {
          issuedQuantities[item.batch_id] = 0;
        }
        issuedQuantities[item.batch_id] += item.unit_quantity;
      });

      // Get the "In" movements to compare quantities
      const { data: inData, error: inError } = await supabase
        .from('cold_room_inventory')
        .select('batch_id, unit_quantity')
        .eq('movement_action', 'In');

      if (inError) throw inError;

      // Map of batch_id to total received quantity
      const receivedQuantities = {};
      inData.forEach(item => {
        if (!receivedQuantities[item.batch_id]) {
          receivedQuantities[item.batch_id] = 0;
        }
        receivedQuantities[item.batch_id] += item.unit_quantity;
      });

      // Identify fully issued batches (where issued quantity equals or exceeds received quantity)
      const fullyIssuedBatches = new Set();
      Object.keys(issuedQuantities).forEach(batchId => {
        if (issuedQuantities[batchId] >= (receivedQuantities[batchId] || 0)) {
          fullyIssuedBatches.add(batchId);
        }
      });

      console.log('Fully issued batches:', fullyIssuedBatches);
      setUsedBatchIds(fullyIssuedBatches);
      
      return fullyIssuedBatches;
    } catch (error) {
      console.error('Error fetching used batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch used batch IDs",
        variant: "destructive",
      });
      return new Set();
    }
  };

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

  // Fetch available batches based on selected product category
  const fetchAvailableBatches = async (category) => {
    setIsLoading(true);
    try {
      if (!category) return;

      console.log('Fetching available batches for category:', category);
      
      // First, get all the batches stored (In movements)
      const { data: inData, error: inError } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .eq('product_category', category)
        .eq('movement_action', 'In') // Only consider items that were received
        .order('storage_date_time', { ascending: false });

      if (inError) throw inError;

      // Next, get all the issues (Out movements)
      const { data: outData, error: outError } = await supabase
        .from('cold_room_inventory')
        .select('batch_id, unit_quantity')
        .eq('product_category', category)
        .eq('movement_action', 'Out')
        .order('storage_date_time', { ascending: false });

      if (outError) throw outError;

      // Create a map of batch_id to total issued quantity
      const issuedQuantities = {};
      (outData || []).forEach(item => {
        if (!issuedQuantities[item.batch_id]) {
          issuedQuantities[item.batch_id] = 0;
        }
        issuedQuantities[item.batch_id] += item.unit_quantity;
      });

      // Create a map to track unique batches and their current stock levels
      const batchMap = {};
      
      (inData || []).forEach(item => {
        if (!batchMap[item.batch_id]) {
          batchMap[item.batch_id] = {
            ...item,
            current_stock: item.unit_quantity - (issuedQuantities[item.batch_id] || 0)
          };
        } else {
          // If there are multiple receipts for the same batch, add the quantities
          batchMap[item.batch_id].unit_quantity += item.unit_quantity;
          batchMap[item.batch_id].current_stock += item.unit_quantity - (issuedQuantities[item.batch_id] || 0);
        }
      });

      // Convert to array and filter out batches with no remaining stock
      let availableBatchesArray = Object.values(batchMap)
        .filter(batch => batch.current_stock > 0)
        .filter(batch => !usedBatchIds.has(batch.batch_id));
      
      console.log('Available batches:', availableBatchesArray);
      setAvailableBatches(availableBatchesArray);
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
    const initializeData = async () => {
      await fetchUsedBatchIds();
      await fetchAvailableCategories();
    };
    
    initializeData();
    
    // Set up a refresh interval
    const intervalId = setInterval(fetchUsedBatchIds, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (productCategory) {
      fetchAvailableBatches(productCategory);
    } else {
      setAvailableBatches([]);
    }
  }, [productCategory, usedBatchIds]);

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
      
      // Calculate current stock level by subtracting issued quantity
      const currentStock = selected.current_stock || 0;
      setCurrentStock(currentStock);
      
      // Default issue quantity to 1 or the available stock if less than 1
      setValue('unit_quantity', Math.min(1, currentStock));
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
      if (parseInt(data.unit_quantity) > currentStock) {
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

      // Check if this batch is now fully issued and update local state
      const newRemainingStock = currentStock - parseInt(data.unit_quantity);
      if (newRemainingStock <= 0) {
        setUsedBatchIds(prev => {
          const updated = new Set(prev);
          updated.add(data.batch_id);
          return updated;
        });
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
          <Label htmlFor="product_category">Product Category</Label>
          <Select onValueChange={handleProductCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select product category" />
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
            disabled={!productCategory || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading batches..." : "Select a batch"} />
            </SelectTrigger>
            <SelectContent>
              {availableBatches.map((batch) => (
                <SelectItem key={batch.id} value={batch.batch_id}>
                  {`${batch.batch_id} - ${batch.product_type} (${batch.current_stock} units available)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cold_room_id">Cold Room ID</Label>
          <Input
            id="cold_room_id"
            {...register('cold_room_id', { required: true })}
            placeholder="Cold Room ID will be auto-filled"
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_id">Cold Room Batch ID</Label>
          <Input
            id="batch_id"
            {...register('batch_id', { required: true })}
            placeholder="Batch ID will be auto-filled"
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="production_batch_id">Production Batch ID</Label>
          <Input
            id="production_batch_id"
            {...register('production_batch_id', { required: true })}
            placeholder="Production batch ID will be auto-filled"
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_type">Product Type</Label>
          <Input
            id="product_type"
            {...register('product_type', { required: true })}
            placeholder="Product type will be auto-filled"
            readOnly
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_weight">Unit Weight (g)</Label>
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
            className="bg-gray-100"
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
              max: currentStock
            })}
          />
          {selectedBatch && (
            <p className="text-sm text-muted-foreground mt-1">
              Available: {currentStock} units
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
