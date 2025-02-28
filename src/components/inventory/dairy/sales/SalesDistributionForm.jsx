
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import QRCodeGenerator from '../qr/QRCodeGenerator';
import { useAutoFill } from '@/contexts/AutoFillContext';

const SalesDistributionForm = ({ onBack }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  const formData = watch();
  const [batchOptions, setBatchOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { autoFillData, updateAutoFillData } = useAutoFill();

  const getUsedBatchIds = async () => {
    try {
      const { data: columns, error: columnsError } = await supabase
        .from('sales_records')
        .select('*')
        .limit(1);
      
      if (columnsError) {
        console.error('Error checking sales_records schema:', columnsError);
        return new Set();
      }
      
      if (columns && columns.length > 0 && 'batch_id' in columns[0]) {
        const { data, error } = await supabase
          .from('sales_records')
          .select('batch_id')
          .not('batch_id', 'is', null);

        if (error) throw error;
        return new Set(data.map(record => record.batch_id));
      } else {
        console.log('batch_id column does not exist in sales_records yet');
        return new Set();
      }
    } catch (error) {
      console.error('Error fetching used batch IDs:', error);
      return new Set();
    }
  };

  useEffect(() => {
    const fetchBatchIds = async () => {
      setLoading(true);
      try {
        console.log("Fetching inventory data for batch selection...");
        
        const usedBatchIds = await getUsedBatchIds();
        console.log("Used batch IDs:", usedBatchIds);

        // Create an array to store all found batch data
        let allBatchData = [];
        
        // Define all possible movement action variations
        const movementActions = [
          'Goods Issue', 
          'goods issue', 
          'GOODS ISSUE', 
          'Out',
          'out',
          'Goods_Issue'
        ];
        
        // Query for each movement action and combine results
        for (const action of movementActions) {
          console.log(`Trying to fetch with movement_action = '${action}'`);
          
          const { data, error } = await supabase
            .from('cold_room_inventory')
            .select('batch_id, product_type, unit_quantity')
            .eq('movement_action', action)
            .order('batch_id', { ascending: true });
            
          if (error) {
            console.error(`Error fetching with movement_action '${action}':`, error);
            continue;
          }
          
          if (data && data.length > 0) {
            console.log(`Found ${data.length} records with movement_action '${action}'`);
            allBatchData = [...allBatchData, ...data];
          }
        }
        
        console.log("Total batch data found:", allBatchData.length);
        console.log("All fetched batch data:", allBatchData);
        
        // If no data found in any query, provide sample data
        if (allBatchData.length === 0) {
          console.log("No inventory data found, using sample data");
          setBatchOptions([
            { id: "BATCH-001", productType: "Cheese", quantity: 50 },
            { id: "BATCH-002", productType: "Milk", quantity: 100 }
          ]);
          setLoading(false);
          return;
        }
        
        // Process combined data to create unique batch options
        // Remove the quantity filter to include all batches
        const uniqueBatchOptions = allBatchData.reduce((unique, item) => {
          // Filter out already used batch IDs
          if (usedBatchIds.has(item.batch_id)) return unique;
          
          // Check if this batch ID is already in our unique list
          const existingIndex = unique.findIndex(u => u.id === item.batch_id);
          
          if (existingIndex === -1) {
            // This is a new batch ID, add it to our list
            unique.push({
              id: item.batch_id,
              productType: item.product_type || "Unknown",
              quantity: item.unit_quantity || 0
            });
          }
          
          return unique;
        }, []);
        
        // Sort the batch options by ID for consistent display
        uniqueBatchOptions.sort((a, b) => a.id.localeCompare(b.id));
        
        console.log("Final unique batch options:", uniqueBatchOptions);
        console.log("Number of unique batch options:", uniqueBatchOptions.length);
        
        setBatchOptions(uniqueBatchOptions);
      } catch (error) {
        console.error('Error fetching batch IDs:', error);
        toast({
          title: "Error",
          description: "Failed to load batch IDs: " + error.message,
          variant: "destructive",
        });
        // Only use sample data if there was an actual error
        setBatchOptions([
          { id: "BATCH-001", productType: "Cheese", quantity: 50 },
          { id: "BATCH-002", productType: "Milk", quantity: 100 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchIds();
  }, [toast]);

  const handleBatchSelect = (batchId) => {
    console.log("Selected batch ID:", batchId);
    const selectedBatch = batchOptions.find(batch => batch.id === batchId);
    if (selectedBatch) {
      console.log("Auto-filling with batch data:", selectedBatch);
      setValue('batch_id', selectedBatch.id);
      setValue('product_type', selectedBatch.productType);
      setValue('quantity', selectedBatch.quantity);
      
      updateAutoFillData('selectedBatch', selectedBatch);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit sales records",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('sales_records')
        .insert([{
          ...data,
          batch_id: data.batch_id,
          created_by: user.id,
          date_time: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales record saved successfully",
      });
      
      // Refresh batch options after submission to reflect the newly used batch
      fetchBatchIds();
      
      reset();
    } catch (error) {
      console.error('Error saving sales record:', error);
      toast({
        title: "Error",
        description: "Failed to save sales record",
        variant: "destructive",
      });
    }
  };

  // Separate function for fetching batch IDs to use both in useEffect and after form submission
  const fetchBatchIds = async () => {
    setLoading(true);
    try {
      console.log("Fetching inventory data for batch selection...");
      
      const usedBatchIds = await getUsedBatchIds();
      console.log("Used batch IDs:", usedBatchIds);

      // Create an array to store all found batch data
      let allBatchData = [];
      
      // Define all possible movement action variations
      const movementActions = [
        'Goods Issue', 
        'goods issue', 
        'GOODS ISSUE', 
        'Out',
        'out',
        'Goods_Issue'
      ];
      
      // Query for each movement action and combine results
      for (const action of movementActions) {
        console.log(`Trying to fetch with movement_action = '${action}'`);
        
        const { data, error } = await supabase
          .from('cold_room_inventory')
          .select('batch_id, product_type, unit_quantity')
          .eq('movement_action', action)
          .order('batch_id', { ascending: true });
          
        if (error) {
          console.error(`Error fetching with movement_action '${action}':`, error);
          continue;
        }
        
        if (data && data.length > 0) {
          console.log(`Found ${data.length} records with movement_action '${action}'`);
          allBatchData = [...allBatchData, ...data];
        }
      }
      
      console.log("Total batch data found:", allBatchData.length);
      console.log("All fetched batch data:", allBatchData);
      
      // If no data found in any query, provide sample data
      if (allBatchData.length === 0) {
        console.log("No inventory data found, using sample data");
        setBatchOptions([
          { id: "BATCH-001", productType: "Cheese", quantity: 50 },
          { id: "BATCH-002", productType: "Milk", quantity: 100 }
        ]);
        setLoading(false);
        return;
      }
      
      // Process combined data to create unique batch options
      // Remove the quantity filter to include all batches
      const uniqueBatchOptions = allBatchData.reduce((unique, item) => {
        // Filter out already used batch IDs
        if (usedBatchIds.has(item.batch_id)) return unique;
        
        // Check if this batch ID is already in our unique list
        const existingIndex = unique.findIndex(u => u.id === item.batch_id);
        
        if (existingIndex === -1) {
          // This is a new batch ID, add it to our list
          unique.push({
            id: item.batch_id,
            productType: item.product_type || "Unknown",
            quantity: item.unit_quantity || 0
          });
        }
        
        return unique;
      }, []);
      
      // Sort the batch options by ID for consistent display
      uniqueBatchOptions.sort((a, b) => a.id.localeCompare(b.id));
      
      console.log("Final unique batch options:", uniqueBatchOptions);
      console.log("Number of unique batch options:", uniqueBatchOptions.length);
      
      setBatchOptions(uniqueBatchOptions);
    } catch (error) {
      console.error('Error fetching batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to load batch IDs: " + error.message,
        variant: "destructive",
      });
      // Only use sample data if there was an actual error
      setBatchOptions([
        { id: "BATCH-001", productType: "Cheese", quantity: 50 },
        { id: "BATCH-002", productType: "Milk", quantity: 100 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (showQR) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowQR(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <QRCodeGenerator 
          data={formData} 
          title="Sales Distribution"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sales & Marketing
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Sales & Distribution Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name/ID</Label>
                <Input {...register("customer_name", { required: true })} />
              </div>

              <div className="space-y-2">
                <Label>Product Batch ID</Label>
                <Select onValueChange={handleBatchSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch from goods issues" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : batchOptions.length > 0 ? (
                      batchOptions.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.id} - {batch.productType}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-batches" disabled>No available batch IDs found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("batch_id")} />
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <Input {...register("product_type", { required: true })} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Quantity Sold</Label>
                <Input type="number" {...register("quantity", { required: true, min: 1 })} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Price Per Unit</Label>
                <Input type="number" step="0.01" {...register("price_per_unit", { required: true, min: 0 })} />
              </div>

              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input {...register("invoice_number", { required: true })} />
              </div>

              <div className="space-y-2">
                <Label>Driver ID</Label>
                <Input {...register("driver_id")} />
              </div>

              <div className="space-y-2">
                <Label>Vehicle ID</Label>
                <Input {...register("vehicle_id")} />
              </div>

              <div className="space-y-2">
                <Label>Destination</Label>
                <Input {...register("destination")} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">Submit Sales Record</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowQR(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Generate QR
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDistributionForm;
