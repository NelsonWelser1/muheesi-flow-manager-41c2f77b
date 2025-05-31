
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '../milk-reception/hooks/useMilkReceptionForm';

const ProductionLineForm = () => {
  const [formData, setFormData] = useState({
    productionLineName: '',
    cheeseType: '',
    batchNumber: '',
    startDate: '',
    endDate: '',
    status: '',
    notes: '',
  });

  // Get milk reception data for batch selection
  const { data: milkReceptionData, isLoading: isMilkDataLoading } = useMilkReception();

  // Backend logic to fetch and process available offload batches
  const getAvailableOffloadBatches = () => {
    if (!milkReceptionData || !Array.isArray(milkReceptionData)) {
      console.log('No milk reception data available for offload batch selection');
      return [];
    }

    try {
      // Filter for milk tank offload records (negative volumes indicate offloads)
      const offloadRecords = milkReceptionData.filter(record => {
        const hasValidBatchId = record.batch_id && typeof record.batch_id === 'string';
        const isOffloadRecord = record.milk_volume < 0 || record.volume_offloaded > 0;
        
        return hasValidBatchId && isOffloadRecord;
      });

      // Process and transform offload records for batch selection
      const processedBatches = offloadRecords.map(record => {
        const batchId = record.batch_id;
        const supplierName = record.supplier_name || 'Unknown Supplier';
        const volume = Math.abs(record.milk_volume || record.volume_offloaded || 0);
        const tankNumber = record.tank_number || record.storage_tank || 'Unknown Tank';
        const createdDate = record.created_at || record.datetime;

        return {
          id: record.id,
          batch_id: batchId,
          supplier_name: supplierName,
          volume: volume,
          tank_number: tankNumber,
          created_at: createdDate,
          label: `${batchId} - ${supplierName} (${volume}L from ${tankNumber})`,
          value: batchId
        };
      });

      // Remove duplicates and sort by creation date (newest first)
      const uniqueBatches = processedBatches.reduce((acc, current) => {
        const existingBatch = acc.find(batch => batch.batch_id === current.batch_id);
        if (!existingBatch) {
          acc.push(current);
        }
        return acc;
      }, []);

      const sortedBatches = uniqueBatches.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });

      console.log('Processed offload batches for selection:', sortedBatches);
      return sortedBatches;

    } catch (error) {
      console.error('Error processing offload batch data:', error);
      return [];
    }
  };

  // Backend logic to fetch available milk batches for production
  const getAvailableMilkBatches = () => {
    if (!milkReceptionData || !Array.isArray(milkReceptionData)) {
      console.log('No milk reception data available for batch selection');
      return [];
    }

    try {
      // Filter for valid milk reception records (positive volumes)
      const receptionRecords = milkReceptionData.filter(record => {
        const hasValidBatchId = record.batch_id && typeof record.batch_id === 'string';
        const isReceptionRecord = record.milk_volume > 0;
        
        return hasValidBatchId && isReceptionRecord;
      });

      // Process records for batch selection
      const processedBatches = receptionRecords.map(record => {
        return {
          id: record.id,
          batch_id: record.batch_id,
          supplier_name: record.supplier_name || 'Unknown Supplier',
          volume: record.milk_volume || 0,
          tank_number: record.tank_number || 'Unknown Tank',
          created_at: record.created_at,
          label: `${record.batch_id} - ${record.supplier_name || 'Unknown Supplier'} (${record.milk_volume || 0}L)`,
          value: record.batch_id
        };
      });

      // Remove duplicates and sort
      const uniqueBatches = processedBatches.reduce((acc, current) => {
        const existingBatch = acc.find(batch => batch.batch_id === current.batch_id);
        if (!existingBatch) {
          acc.push(current);
        }
        return acc;
      }, []);

      return uniqueBatches.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    } catch (error) {
      console.error('Error processing milk batch data:', error);
      return [];
    }
  };

  // Get processed batch data
  const availableOffloadBatches = getAvailableOffloadBatches();
  const availableMilkBatches = getAvailableMilkBatches();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Here you would typically handle the form submission,
    // such as sending the data to an API endpoint.
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Line Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productionLineName">Production Line Name</Label>
            <Input
              type="text"
              id="productionLineName"
              name="productionLineName"
              value={formData.productionLineName}
              onChange={handleChange}
              placeholder="Enter production line name"
              required
            />
          </div>

          <div>
            <Label htmlFor="cheeseType">Cheese Type</Label>
            <Select onValueChange={(value) => handleChange({ target: { name: 'cheeseType', value } })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cheese type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cheddar">Cheddar</SelectItem>
                <SelectItem value="mozzarella">Mozzarella</SelectItem>
                <SelectItem value="gouda">Gouda</SelectItem>
                <SelectItem value="feta">Feta</SelectItem>
                <SelectItem value="brie">Brie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="batchNumber">Select Milk Batch</Label>
            <Select 
              onValueChange={(value) => handleChange({ target: { name: 'batchNumber', value } })}
              disabled={isMilkDataLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isMilkDataLoading ? "Loading batches..." : "Select milk batch"} />
              </SelectTrigger>
              <SelectContent>
                {availableMilkBatches.length > 0 ? (
                  availableMilkBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.value}>
                      {batch.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-batches" disabled>
                    No milk batches available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="offloadBatch">Select Offload Batch</Label>
            <Select 
              onValueChange={(value) => handleChange({ target: { name: 'offloadBatch', value } })}
              disabled={isMilkDataLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isMilkDataLoading ? "Loading offload batches..." : "Select offload batch"} />
              </SelectTrigger>
              <SelectContent>
                {availableOffloadBatches.length > 0 ? (
                  availableOffloadBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.value}>
                      {batch.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-offloads" disabled>
                    No offload batches available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => handleChange({ target: { name: 'status', value } })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionLineForm;
