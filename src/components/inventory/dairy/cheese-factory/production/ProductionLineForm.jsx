
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilkReception } from '@/hooks/useMilkReception';

const ProductionLineForm = () => {
  const { data: milkReceptionData, isLoading: milkDataLoading } = useMilkReception();
  const [availableBatches, setAvailableBatches] = useState([]);
  
  const [formData, setFormData] = useState({
    productionLineName: '',
    cheeseType: '',
    batchNumber: '',
    milkBatchId: '',
    startDate: '',
    endDate: '',
    status: '',
    notes: '',
  });

  // Extract unique batch numbers from milk reception data
  useEffect(() => {
    if (milkReceptionData && milkReceptionData.length > 0) {
      const batches = milkReceptionData
        .filter(record => record.tank_number || record.batch_number)
        .map(record => ({
          id: record.id,
          batchNumber: record.tank_number || record.batch_number || `Batch-${record.id}`,
          volume: record.milk_volume,
          supplier: record.supplier_name,
          quality: record.quality_score || record.quality_check,
          date: record.created_at || record.datetime
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAvailableBatches(batches);
    }
  }, [milkReceptionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMilkBatchSelection = (value) => {
    const selectedBatch = availableBatches.find(batch => batch.id.toString() === value);
    setFormData(prevState => ({
      ...prevState,
      milkBatchId: value,
      batchNumber: selectedBatch ? selectedBatch.batchNumber : ''
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
            <Label htmlFor="milkBatchId">Select Milk Batch</Label>
            <Select onValueChange={handleMilkBatchSelection} disabled={milkDataLoading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={milkDataLoading ? "Loading batches..." : "Select milk batch"} />
              </SelectTrigger>
              <SelectContent>
                {availableBatches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.batchNumber} - {batch.supplier} ({batch.volume}L) - {batch.quality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="Auto-filled from milk batch selection"
              required
            />
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
