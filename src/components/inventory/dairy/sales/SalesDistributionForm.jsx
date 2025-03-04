
import React, { useState, useEffect, useCallback } from 'react';
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
  const { register, handleSubmit, reset, watch, setValue, getValues } = useForm();
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  const formData = watch();
  const [batchEntries, setBatchEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { autoFillData, updateAutoFillData } = useAutoFill();
  const [batchSelected, setBatchSelected] = useState(false);
  const [currency, setCurrency] = useState('UGX');

  // Watch changes to quantity and price per unit to calculate total price
  const quantity = watch('quantity');
  const pricePerUnit = watch('price_per_unit');

  // Format number with currency symbol and commas
  const formatCurrency = (value) => {
    if (!value) return '';
    // Remove any non-numeric characters except decimal point
    const numericValue = value.toString().replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    // Format with commas
    const parts = number.toFixed(2).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Add currency symbol
    return currency === 'USD' ? `$${parts.join('.')}` : `UGX ${parts.join('.')}`;
  };

  // Parse currency string back to number
  const parseCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9.]/g, '');
  };

  // Auto-calculate total price whenever quantity or pricePerUnit changes
  useEffect(() => {
    if (quantity && pricePerUnit) {
      const numericPrice = parseCurrency(pricePerUnit);
      const totalPrice = Number(quantity) * Number(numericPrice);
      setValue('total_price', formatCurrency(totalPrice));
    }
  }, [quantity, pricePerUnit, setValue, currency]);

  // Update price format when currency changes
  useEffect(() => {
    const currentPrice = getValues('price_per_unit');
    const currentTotal = getValues('total_price');
    
    if (currentPrice) {
      setValue('price_per_unit', formatCurrency(parseCurrency(currentPrice)));
    }
    
    if (currentTotal) {
      setValue('total_price', formatCurrency(parseCurrency(currentTotal)));
    }
  }, [currency, setValue, getValues]);

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

  // Fetch all batch entries matching "Goods Issue" movement action
  // Now returns ALL entries without deduplication
  const fetchBatchEntries = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching inventory data for batch selection...");
      
      const usedBatchIds = await getUsedBatchIds();
      console.log("Used batch IDs:", usedBatchIds);

      // Create an array to store all found batch data
      let allBatchEntries = [];
      
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
          .select('id, batch_id, product_type, unit_quantity, unit_weight')
          .eq('movement_action', action)
          .order('storage_date_time', { ascending: false });
          
        if (error) {
          console.error(`Error fetching with movement_action '${action}':`, error);
          continue;
        }
        
        if (data && data.length > 0) {
          console.log(`Found ${data.length} records with movement_action '${action}'`);
          
          // Filter out already used batch IDs
          const usableEntries = data.filter(item => !usedBatchIds.has(item.batch_id));
          
          allBatchEntries = [...allBatchEntries, ...usableEntries];
        }
      }
      
      console.log("Total batch entries found:", allBatchEntries.length);
      console.log("All fetched batch entries:", allBatchEntries);
      
      // If no data found in any query, provide sample data
      if (allBatchEntries.length === 0) {
        console.log("No inventory data found, using sample data");
        setBatchEntries([
          { 
            id: "sample-1", 
            batch_id: "BATCH-001", 
            product_type: "Cheese", 
            unit_quantity: 50,
            unit_weight: 250 
          },
          { 
            id: "sample-2", 
            batch_id: "BATCH-002", 
            product_type: "Milk", 
            unit_quantity: 100,
            unit_weight: 1000 
          }
        ]);
        setLoading(false);
        return;
      }
      
      // Process entries to add display labels with quantities
      const processedEntries = allBatchEntries.map(item => ({
        id: item.id || `entry-${Math.random().toString(36).substr(2, 9)}`,
        batch_id: item.batch_id,
        product_type: item.product_type || "Unknown",
        unit_quantity: item.unit_quantity || 0,
        unit_weight: item.unit_weight || 0,
        // Create a display label that includes batch ID and quantity for the dropdown
        display_label: `${item.batch_id} - ${item.product_type} (${item.unit_quantity} units)`
      }));
      
      // Sort entries by batch_id for better organization
      processedEntries.sort((a, b) => a.batch_id.localeCompare(b.batch_id));
      
      console.log("Processed batch entries:", processedEntries);
      console.log("Number of batch entries:", processedEntries.length);
      
      setBatchEntries(processedEntries);
    } catch (error) {
      console.error('Error fetching batch entries:', error);
      toast({
        title: "Error",
        description: "Failed to load batch entries: " + error.message,
        variant: "destructive",
      });
      // Only use sample data if there was an actual error
      setBatchEntries([
        { 
          id: "sample-1", 
          batch_id: "BATCH-001", 
          product_type: "Cheese", 
          unit_quantity: 50,
          unit_weight: 250 
        },
        { 
          id: "sample-2", 
          batch_id: "BATCH-002", 
          product_type: "Milk", 
          unit_quantity: 100,
          unit_weight: 1000 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBatchEntries();
  }, [fetchBatchEntries]);

  const handleBatchSelect = (entryId) => {
    console.log("Selected entry ID:", entryId);
    const selectedEntry = batchEntries.find(entry => entry.id === entryId);
    
    if (selectedEntry) {
      console.log("Auto-filling with batch data:", selectedEntry);
      
      // Set form values from selected entry
      setValue('batch_id', selectedEntry.batch_id);
      setValue('product_type', selectedEntry.product_type);
      setValue('quantity', selectedEntry.unit_quantity);
      setValue('unit_weight', selectedEntry.unit_weight);
      
      // Mark that a batch has been selected to make fields read-only
      setBatchSelected(true);
      
      // If price_per_unit is already set, calculate total_price
      const currentPricePerUnit = getValues('price_per_unit');
      if (currentPricePerUnit) {
        const numericPrice = parseCurrency(currentPricePerUnit);
        const totalPrice = Number(selectedEntry.unit_quantity) * Number(numericPrice);
        setValue('total_price', formatCurrency(totalPrice));
      }
      
      updateAutoFillData('selectedBatch', selectedEntry);
    }
  };

  // Handler for price per unit input to format as currency
  const handlePricePerUnitChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    if (numericValue === '' || !isNaN(numericValue)) {
      setValue('price_per_unit', formatCurrency(numericValue));
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

      // Parse currency values to numbers before saving
      const dataToSubmit = {
        ...data,
        price_per_unit: parseFloat(parseCurrency(data.price_per_unit)),
        total_price: parseFloat(parseCurrency(data.total_price)),
        batch_id: data.batch_id,
        created_by: user.id,
        date_time: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('sales_records')
        .insert([dataToSubmit]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales record saved successfully",
      });
      
      // Refresh batch options after submission to reflect the newly used batch
      fetchBatchEntries();
      
      // Reset form and batch selection state
      reset();
      setBatchSelected(false);
    } catch (error) {
      console.error('Error saving sales record:', error);
      toast({
        title: "Error",
        description: "Failed to save sales record",
        variant: "destructive",
      });
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
                    ) : batchEntries.length > 0 ? (
                      batchEntries.map((entry) => (
                        <SelectItem key={entry.id} value={entry.id}>
                          {entry.display_label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-batches" disabled>No available batch entries found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("batch_id")} />
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <Input 
                  {...register("product_type", { required: true })} 
                  readOnly={batchSelected}
                  className={batchSelected ? "bg-gray-100" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  {...register("quantity", { 
                    required: true, 
                    min: 1,
                    valueAsNumber: true 
                  })} 
                  readOnly={batchSelected}
                  className={batchSelected ? "bg-gray-100" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Unit Weight (g)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...register("unit_weight", { 
                    required: true, 
                    min: 0,
                    valueAsNumber: true 
                  })} 
                  readOnly={batchSelected}
                  className={batchSelected ? "bg-gray-100" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  value={currency}
                  onValueChange={setCurrency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="UGX">UGX (Shilling)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Per Unit</Label>
                <Input 
                  {...register("price_per_unit", { required: true })} 
                  onChange={handlePricePerUnitChange}
                  placeholder={currency === 'USD' ? '$0.00' : 'UGX 0'}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Total Price</Label>
                <Input 
                  {...register("total_price")} 
                  readOnly 
                  className="bg-gray-50"
                  placeholder={currency === 'USD' ? '$0.00' : 'UGX 0'}
                />
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
