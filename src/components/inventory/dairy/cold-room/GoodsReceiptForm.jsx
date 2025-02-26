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

const GoodsReceiptForm = ({ userId, username }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast();
  const { session } = useSupabaseAuth();
  const [productType, setProductType] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [availableProductionBatches, setAvailableProductionBatches] = useState([]);
  const [usedProductionBatchIds, setUsedProductionBatchIds] = useState(new Set());
  const [selectedColdRoom, setSelectedColdRoom] = useState('');
  const [loading, setLoading] = useState(true);

  // Cold Room options
  const coldRoomOptions = [
    { id: 'FACTORY-CR1', name: 'Factory Cold Room' },
    { id: 'KAMPALA-RTL', name: 'Kampala Retail' }
  ];

  // Product type options for reference when generating batch IDs
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

  // Fetch already used production batch IDs to exclude them from the dropdown
  const fetchUsedProductionBatchIds = async () => {
    try {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('production_batch_id')
        .not('production_batch_id', 'is', null);

      if (error) throw error;

      // Create a Set of used batch IDs for efficient lookup
      const batchIdSet = new Set(data.map(item => item.production_batch_id));
      console.log('Used production batch IDs:', batchIdSet);
      setUsedProductionBatchIds(batchIdSet);
    } catch (error) {
      console.error('Error fetching used production batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch used production batch IDs",
        variant: "destructive",
      });
    }
  };

  const fetchProductionBatchIds = async (category) => {
    console.log('Fetching production batch IDs for category:', category);
    setLoading(true);
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
      let allBatches = [
        ...(internationalBatches || []).map(b => ({ ...b, line: 'International' })),
        ...(localBatches || []).map(b => ({ ...b, line: 'Local' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Filter by category if provided
      if (category) {
        // For cheese category, filter out yogurt types and vice versa
        // This is a simplistic approach - you might need to modify based on your actual data structure
        if (category === 'cheese') {
          allBatches = allBatches.filter(b => !b.cheese_type.toLowerCase().includes('yogurt'));
        } else if (category === 'yogurt') {
          allBatches = allBatches.filter(b => b.cheese_type.toLowerCase().includes('yogurt'));
        }
      }

      // Filter out already used production batch IDs
      const filteredBatches = allBatches.filter(batch => !usedProductionBatchIds.has(batch.batch_id));

      console.log('Fetched production batches:', filteredBatches);
      setAvailableProductionBatches(filteredBatches);
    } catch (error) {
      console.error('Error fetching production batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch production batch IDs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      await fetchUsedProductionBatchIds();
      fetchProductionBatchIds();
    };
    
    initializeForm();
    
    // Set up a refresh interval to keep the list of used batch IDs up to date
    const intervalId = setInterval(fetchUsedProductionBatchIds, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Re-fetch production batch IDs when usedProductionBatchIds changes
  useEffect(() => {
    if (usedProductionBatchIds.size > 0) {
      fetchProductionBatchIds(productCategory);
    }
  }, [usedProductionBatchIds, productCategory]);

  const generateBatchId = (type, coldRoomId) => {
    const now = new Date();
    const datePrefix = format(now, 'yyyyMMdd');
    const timeComponent = format(now, 'HHmmss');
    
    // Cold room prefix is "CLD"
    const roomPrefix = 'CLD';
    
    // Get product type prefix
    const allProductTypes = [...cheeseTypes, ...yogurtTypes];
    const selectedType = allProductTypes.find(t => t.value.toLowerCase() === type.toLowerCase());
    const typePrefix = selectedType?.prefix || 'GEN';
    
    // Combine all components
    return `${roomPrefix}${datePrefix}-${typePrefix}-${timeComponent}`;
  };

  const handleColdRoomChange = (coldRoomId) => {
    console.log('Cold Room ID changed:', coldRoomId);
    setSelectedColdRoom(coldRoomId);
    setValue('cold_room_id', coldRoomId);
    
    // If we already have a product type, regenerate the batch ID
    if (productType) {
      const newBatchId = generateBatchId(productType, coldRoomId);
      setValue('batch_id', newBatchId);
    }
  };

  const handleProductionBatchSelect = (batchId) => {
    console.log('Production batch selected:', batchId);
    const selectedBatch = availableProductionBatches.find(b => b.batch_id === batchId);
    
    if (selectedBatch) {
      setValue('production_batch_id', batchId);
      
      // Determine product category based on cheese_type
      const isYogurt = selectedBatch.cheese_type.toLowerCase().includes('yogurt');
      const category = isYogurt ? 'yogurt' : 'cheese';
      
      // Set product category
      setProductCategory(category);
      setValue('product_category', category);
      
      // Set product type
      setProductType(selectedBatch.cheese_type);
      setValue('product_type', selectedBatch.cheese_type);
      
      // Generate batch ID if we have the cold room ID selected
      if (selectedColdRoom) {
        const newBatchId = generateBatchId(selectedBatch.cheese_type, selectedColdRoom);
        setValue('batch_id', newBatchId);
      }
      
      // Auto-fill unit weight and quantity if available
      // Note: This assumes your production_line tables have these fields
      // If they don't, you'll need to adjust this logic
      if (selectedBatch.unit_weight) {
        setValue('unit_weight', selectedBatch.unit_weight);
      }
      
      if (selectedBatch.unit_quantity) {
        setValue('unit_quantity', selectedBatch.unit_quantity);
      }
      
      toast({
        title: "Production Batch Selected",
        description: `Selected batch: ${batchId} from ${selectedBatch.line} line`,
      });
    }
  };

  const handleProductCategoryChange = (e) => {
    const category = e.target.value;
    console.log('Product category changed:', category);
    setProductCategory(category);
  };

  const handleProductTypeChange = (e) => {
    const type = e.target.value;
    console.log('Product type changed:', type);
    setProductType(type);
    
    // Generate batch ID if we have cold room selected
    if (selectedColdRoom) {
      const newBatchId = generateBatchId(type, selectedColdRoom);
      setValue('batch_id', newBatchId);
      
      toast({
        title: "Batch ID Generated",
        description: `New batch ID: ${newBatchId}`,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!session) {
        console.log('Proceeding without authentication for testing');
      }

      // Debug log to verify data being sent to Supabase
      console.log('Submitting goods receipt data to Supabase:', {
        ...data,
        product_category: productCategory || data.product_category,
        operator_id: session?.user?.id || 'test-user',
        storage_date_time: new Date().toISOString(),
        movement_action: 'In' // Hardcoded to "In" for Goods Receipt
      });

      const { error } = await supabase
        .from('cold_room_inventory')
        .insert([{
          ...data,
          product_category: productCategory || data.product_category,
          operator_id: session?.user?.id || 'test-user',
          storage_date_time: new Date().toISOString(),
          movement_action: 'In' // Always "In" for goods receipt
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Update local state of used batch IDs to immediately reflect this change
      setUsedProductionBatchIds(prev => {
        const updated = new Set(prev);
        updated.add(data.production_batch_id);
        return updated;
      });

      toast({
        title: "Success",
        description: "Goods receipt has been successfully recorded",
      });

      reset();
      setProductType('');
      setProductCategory('');
      setSelectedColdRoom('');
    } catch (error) {
      console.error('Error submitting data:', error);
      toast({
        title: "Error",
        description: "Failed to submit goods receipt. Please try again.",
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
            <SelectTrigger id="cold_room_id">
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
          <Label htmlFor="production_batch_id">Production Batch ID</Label>
          <Select onValueChange={handleProductionBatchSelect}>
            <SelectTrigger>
              <SelectValue placeholder={loading ? "Loading batches..." : "Select production batch"} />
            </SelectTrigger>
            <SelectContent>
              {availableProductionBatches.length > 0 ? (
                availableProductionBatches.map((batch) => (
                  <SelectItem key={batch.batch_id} value={batch.batch_id}>
                    {`${batch.line} - ${batch.batch_id} (${batch.cheese_type})`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-batches" disabled>
                  {loading ? "Loading..." : "No available production batches"}
                </SelectItem>
              )}
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
          <Label htmlFor="product_category">Product Category</Label>
          <Input
            id="product_category"
            {...register('product_category', { required: true })}
            placeholder="Enter product category or select batch ID"
            value={productCategory}
            onChange={handleProductCategoryChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_type">Product Type</Label>
          <Input
            id="product_type"
            {...register('product_type', { required: true })}
            placeholder="Enter product type or select batch ID"
            value={productType}
            onChange={handleProductTypeChange}
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
        Submit Goods Receipt
      </Button>
    </form>
  );
};

export default GoodsReceiptForm;
