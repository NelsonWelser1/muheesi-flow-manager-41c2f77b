
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const RecordSaleForm = ({
  inventoryData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    unitPrice: "",
    customer: "",
  });

  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (
      !form.product ||
      !form.quantity ||
      !form.unitPrice ||
      !form.customer
    ) {
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
            <select
              id="product"
              name="product"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:ring-offset-2"
              value={form.product}
              onChange={handleChange}
              required
            >
              <option value="">Select product</option>
              {inventoryData.map((item) => (
                <option key={item.id} value={item.product}>
                  {item.product}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity (Bunches)</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 10"
              required
            />
          </div>
          <div>
            <Label htmlFor="unitPrice">Unit Price (UGX)</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              min={0}
              value={form.unitPrice}
              onChange={handleChange}
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
              onChange={handleChange}
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
