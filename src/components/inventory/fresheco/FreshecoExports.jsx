import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from '@tanstack/react-query';
import { useFreshecoExports, useAddFreshecoExport } from '@/integrations/supabase/hooks/useFreshecoFarming';

const FreshecoExports = () => {
  const { toast } = useToast();
  const { data: exports, isLoading } = useFreshecoExports();
  const addExportMutation = useAddFreshecoExport();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      product_name: formData.get('product_name'),
      quantity: parseFloat(formData.get('quantity')),
      destination_country: formData.get('destination_country'),
      export_date: formData.get('export_date'),
      shipping_method: formData.get('shipping_method'),
      container_number: formData.get('container_number'),
      certification_details: {
        type: formData.get('certification_type'),
        number: formData.get('certification_number')
      }
    };

    try {
      await addExportMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Export record added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fresheco Farming Export Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product_name">Product</Label>
            <Input name="product_name" required />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity (MT)</Label>
            <Input type="number" name="quantity" required />
          </div>
          <div>
            <Label htmlFor="destination_country">Destination Country</Label>
            <Input name="destination_country" required />
          </div>
          <div>
            <Label htmlFor="export_date">Export Date</Label>
            <Input type="date" name="export_date" required />
          </div>
          <div>
            <Label htmlFor="shipping_method">Shipping Method</Label>
            <Select name="shipping_method" required>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sea">Sea Freight</SelectItem>
                <SelectItem value="air">Air Freight</SelectItem>
                <SelectItem value="land">Land Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="container_number">Container Number</Label>
            <Input name="container_number" required />
          </div>
          <div>
            <Label htmlFor="certification_type">Certification Type</Label>
            <Input name="certification_type" required />
          </div>
          <div>
            <Label htmlFor="certification_number">Certification Number</Label>
            <Input name="certification_number" required />
          </div>
          <Button type="submit" disabled={addExportMutation.isLoading}>
            {addExportMutation.isLoading ? "Adding..." : "Add Export Record"}
          </Button>
        </form>

        {isLoading ? (
          <p>Loading export records...</p>
        ) : (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Export Records</h3>
            <div className="grid gap-4">
              {exports?.map((record) => (
                <Card key={record.export_id}>
                  <CardContent className="p-4">
                    <p><strong>{record.product_name}</strong></p>
                    <p>Quantity: {record.quantity} MT</p>
                    <p>Destination: {record.destination_country}</p>
                    <p>Export Date: {new Date(record.export_date).toLocaleDateString()}</p>
                    <p>Shipping: {record.shipping_method}</p>
                    <p>Container: {record.container_number}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FreshecoExports;