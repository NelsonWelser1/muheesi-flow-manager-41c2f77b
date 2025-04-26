
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const BatchScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProduct, setSelectedProduct] = useState('');
  const [batchSize, setBatchSize] = useState('');
  const { toast } = useToast();

  const handleScheduleBatch = () => {
    if (!selectedProduct || !batchSize) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here we would integrate with the backend to schedule the batch
    console.log('Scheduling batch:', {
      date: selectedDate,
      product: selectedProduct,
      size: batchSize
    });

    toast({
      title: "Batch Scheduled",
      description: `New batch scheduled for ${selectedDate.toLocaleDateString()}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Product Type</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select cheese type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mozzarella">Mozzarella</SelectItem>
                <SelectItem value="gouda">Gouda</SelectItem>
                <SelectItem value="cheddar">Cheddar</SelectItem>
                <SelectItem value="parmesan">Parmesan</SelectItem>
                <SelectItem value="edam">Edam</SelectItem>
                <SelectItem value="feta">Feta</SelectItem>
                <SelectItem value="colby">Colby</SelectItem>
                <SelectItem value="jack">Jack Cheese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Batch Size (kg)</label>
            <Input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              placeholder="Enter batch size"
            />
          </div>

          <Button onClick={handleScheduleBatch} className="w-full">
            Schedule Batch
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchScheduler;
