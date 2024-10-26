import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFreshecoInventory, useAddFreshecoInventory } from '@/integrations/supabase/hooks/useFreshecoFarming';

const FreshecoInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: inventory, isLoading } = useFreshecoInventory();
  const addInventoryMutation = useAddFreshecoInventory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      product_name: formData.get('product_name'),
      quantity: parseFloat(formData.get('quantity')),
      unit: formData.get('unit'),
      storage_condition: formData.get('storage_condition'),
      harvest_date: formData.get('harvest_date'),
      expiry_date: formData.get('expiry_date'),
    };

    try {
      await addInventoryMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const products = [
    "Cocoa", "Avocados", "Passion fruits", "Pineapples", "Mango",
    "Jack-fruit", "Hot peppers", "Sweet potatoes", "Cassava",
    "Sugarcane", "Ginger", "Culnary Variety Mushrooms"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fresheco Farming Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product_name">Product</Label>
            <Select name="product_name" required>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input type="number" name="quantity" required />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select name="unit" required>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MT">Metric Tons (MT)</SelectItem>
                <SelectItem value="KG">Kilograms (KG)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="storage_condition">Storage Condition</Label>
            <Input name="storage_condition" required />
          </div>
          <div>
            <Label htmlFor="harvest_date">Harvest Date</Label>
            <Input type="date" name="harvest_date" required />
          </div>
          <div>
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input type="date" name="expiry_date" required />
          </div>
          <Button type="submit" disabled={addInventoryMutation.isLoading}>
            {addInventoryMutation.isLoading ? "Updating..." : "Update Inventory"}
          </Button>
        </form>

        {isLoading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
            <div className="grid gap-4">
              {inventory?.map((item) => (
                <Card key={item.product_id}>
                  <CardContent className="p-4">
                    <p><strong>{item.product_name}</strong></p>
                    <p>Quantity: {item.quantity} {item.unit}</p>
                    <p>Storage: {item.storage_condition}</p>
                    <p>Harvest Date: {new Date(item.harvest_date).toLocaleDateString()}</p>
                    <p>Expiry Date: {new Date(item.expiry_date).toLocaleDateString()}</p>
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

export default FreshecoInventory;