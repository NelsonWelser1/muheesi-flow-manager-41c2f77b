
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Truck, Loader2 } from "lucide-react";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';

const SalesOrderForm = ({ onBack }) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'pending',
      deliveryRequired: 'no'
    }
  });
  
  const { toast } = useToast();
  const { createSalesOrder } = useSalesOrders();
  const [isSaving, setIsSaving] = useState(false);
  
  const onSubmit = async (data) => {
    try {
      console.log("Preparing to submit sales order data:", data);
      setIsSaving(true);
      
      // Format the data to match the database schema
      const formattedData = {
        customer_name: data.customerName,
        order_date: data.orderDate,
        product: data.product,
        quantity: Number(data.quantity),
        unit_price: Number(data.unitPrice),
        discount: data.discount ? Number(data.discount) : null,
        payment_status: data.paymentStatus,
        sales_rep: data.salesRep || null,
        delivery_required: data.deliveryRequired,
        notes: data.notes || null
      };
      
      console.log("Formatted sales order data for Supabase:", formattedData);
      
      const { success, error } = await createSalesOrder(formattedData);
      
      if (success) {
        toast({
          title: "Success",
          description: "Sales order created successfully",
        });
        reset(); // Reset form after successful submission
      } else {
        console.error("Error creating sales order:", error);
        toast({
          title: "Error",
          description: "Failed to create sales order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Unexpected error in form submission:", err);
      toast({
        title: "Unexpected Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Debug handler for testing
  const handleDebug = () => {
    const currentValues = watch();
    console.log("Current form values:", currentValues);
    toast({
      title: "Debug Info",
      description: "Form values logged to console",
    });
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Sales Order Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input {...register("customerName", { required: "Customer name is required" })} />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input type="date" {...register("orderDate", { required: "Order date is required" })} />
                {errors.orderDate && (
                  <p className="text-sm text-red-500">{errors.orderDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Product</Label>
                <Select onValueChange={(value) => setValue("product", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cheese">Cheese</SelectItem>
                    <SelectItem value="yogurt">Yogurt</SelectItem>
                    <SelectItem value="milk">Fresh Milk</SelectItem>
                    <SelectItem value="processed_milk">Processed Milk</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("product", { required: "Product is required" })} />
                {errors.product && (
                  <p className="text-sm text-red-500">{errors.product.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  {...register("quantity", { 
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" }
                  })} 
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Unit Price (UGX)</Label>
                <Input 
                  type="number" 
                  {...register("unitPrice", { 
                    required: "Unit price is required",
                    min: { value: 0, message: "Price cannot be negative" }
                  })} 
                />
                {errors.unitPrice && (
                  <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input 
                  type="number" 
                  {...register("discount", { 
                    min: { value: 0, message: "Discount cannot be negative" },
                    max: { value: 100, message: "Discount cannot exceed 100%" }
                  })} 
                />
                {errors.discount && (
                  <p className="text-sm text-red-500">{errors.discount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setValue("paymentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("paymentStatus")} />
              </div>

              <div className="space-y-2">
                <Label>Sales Representative</Label>
                <Input {...register("salesRep")} />
              </div>

              <div className="space-y-2">
                <Label>Delivery Required?</Label>
                <Select 
                  defaultValue="no"
                  onValueChange={(value) => setValue("deliveryRequired", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("deliveryRequired")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register("notes")} />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                type="submit" 
                className="bg-[#0000a0] hover:bg-[#00008b]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : "Submit Order"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleDebug}
              >
                <Save className="h-4 w-4" />
                Debug Form
              </Button>
              
              {watch("deliveryRequired") === "yes" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => console.log("Creating delivery note...")}
                >
                  <Truck className="h-4 w-4" />
                  Create Delivery Note
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderForm;
