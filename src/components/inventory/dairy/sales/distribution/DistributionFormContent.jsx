
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDistributionForm } from './hooks/useDistributionForm';
import { useToast } from "@/components/ui/use-toast";

const DistributionFormContent = () => {
  const { toast } = useToast();
  const { formState, handleChange, handleSubmit, resetForm } = useDistributionForm();

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit();
    
    if (success) {
      toast({
        title: "Distribution record created",
        description: "The sales distribution record has been saved successfully.",
        variant: "default",
      });
      resetForm();
    } else {
      toast({
        title: "Error creating record",
        description: "There was an error saving the distribution record. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="customer" className="text-sm font-medium">Customer</label>
          <Input
            id="customer"
            name="customer"
            value={formState.customer}
            onChange={handleChange}
            placeholder="Customer name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="product" className="text-sm font-medium">Product</label>
          <Select name="product" value={formState.product} onValueChange={(value) => handleChange({ target: { name: 'product', value }})}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="milk">Milk</SelectItem>
              <SelectItem value="yogurt">Yogurt</SelectItem>
              <SelectItem value="cheese">Cheese</SelectItem>
              <SelectItem value="butter">Butter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={formState.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="unit" className="text-sm font-medium">Unit</label>
          <Select name="unit" value={formState.unit} onValueChange={(value) => handleChange({ target: { name: 'unit', value }})}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="liters">Liters</SelectItem>
              <SelectItem value="kg">Kilograms</SelectItem>
              <SelectItem value="pcs">Pieces</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price (UGX)</label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formState.price}
            onChange={handleChange}
            placeholder="Price per unit"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="destination" className="text-sm font-medium">Destination</label>
          <Input
            id="destination"
            name="destination"
            value={formState.destination}
            onChange={handleChange}
            placeholder="Delivery destination"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="deliveryDate" className="text-sm font-medium">Delivery Date</label>
          <Input
            id="deliveryDate"
            name="deliveryDate"
            type="date"
            value={formState.deliveryDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={resetForm}
        >
          Reset
        </Button>
        <Button type="submit">Save Distribution Record</Button>
      </div>
    </form>
  );
};

export default DistributionFormContent;
