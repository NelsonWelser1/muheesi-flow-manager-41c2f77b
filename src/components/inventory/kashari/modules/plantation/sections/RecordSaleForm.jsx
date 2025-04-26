
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const UNITS = ["Bunches", "Kgs", "Tonnes", "Sacks"];

const RecordSaleForm = ({
  inventoryData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    unit: "",
    unitPrice: "",
    customer: "",
  });

  const { toast } = useToast();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product || !form.quantity || !form.unit || !form.unitPrice || !form.customer) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(form);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Record New Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="product">Product</Label>
            <Select onValueChange={(value) => handleChange("product", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {inventoryData.map((item) => (
                  <SelectItem key={item.id} value={item.product}>
                    {item.product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              placeholder="e.g. 10"
              required
            />
          </div>

          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select onValueChange={(value) => handleChange("unit", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unitPrice">Unit Price (UGX)</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              min={0}
              value={form.unitPrice}
              onChange={(e) => handleChange("unitPrice", e.target.value)}
              placeholder="e.g. 6000"
              required
            />
          </div>

          <div>
            <Label htmlFor="customer">Customer</Label>
            <Input
              id="customer"
              name="customer"
              value={form.customer}
              onChange={(e) => handleChange("customer", e.target.value)}
              placeholder="Customer name"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex gap-2 mt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Sale"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecordSaleForm;
