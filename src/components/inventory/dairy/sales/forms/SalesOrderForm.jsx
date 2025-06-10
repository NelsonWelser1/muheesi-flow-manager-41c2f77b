import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSalesOrders } from '@/integrations/supabase/hooks/useSalesOrders';
import { PRODUCT_TYPES } from './utils/productTypes';
import CustomerInfoSection from './components/CustomerInfoSection';
import ProductSection from './components/ProductSection';
import PricingSection from './components/PricingSection';
import OrderDetailsSection from './components/OrderDetailsSection';
import FormActions from './components/FormActions';
import SalesOrderList from '../../sales/SalesOrderList';

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
  const [productTypes, setProductTypes] = useState([]);
  const [showOrderList, setShowOrderList] = useState(false);
  
  // Watch the product field to update product types
  const selectedProduct = watch("product");
  
  // Update product types when product changes
  useEffect(() => {
    if (selectedProduct && PRODUCT_TYPES[selectedProduct]) {
      setProductTypes(PRODUCT_TYPES[selectedProduct]);
      // Reset the product type selection when product changes
      setValue("productType", "");
    } else {
      setProductTypes([]);
    }
  }, [selectedProduct, setValue]);
  
  const onSubmit = async (data) => {
    try {
      console.log("Preparing to submit sales order data:", data);
      setIsSaving(true);
      
      // Format the data to match the database schema
      const formattedData = {
        customer_name: data.customerName,
        order_date: data.orderDate,
        product: data.product,
        product_type: data.productType,
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
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowOrderList(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> View Sales Orders
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales Order Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomerInfoSection register={register} errors={errors} />
              
              <ProductSection 
                register={register} 
                errors={errors} 
                setValue={setValue}
                selectedProduct={selectedProduct}
                productTypes={productTypes}
              />

              <PricingSection register={register} errors={errors} />
              
              <OrderDetailsSection register={register} setValue={setValue} />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register("notes")} />
            </div>

            <FormActions 
              isSaving={isSaving} 
              onDebug={handleDebug}
              showDeliveryButton={watch("deliveryRequired") === "yes"}
            />
          </form>
        </CardContent>
      </Card>
      
      <SalesOrderList 
        isOpen={showOrderList} 
        onClose={() => setShowOrderList(false)}
      />
    </div>
  );
};

export default SalesOrderForm;
