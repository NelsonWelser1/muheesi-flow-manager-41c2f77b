import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const SalesProposalForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([{ name: '', description: '', quantity: '1', price: '', total: '0' }]);

  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      proposal_date: new Date().toISOString().split('T')[0],
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
      grand_total: '0'
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', description: '', quantity: '1', price: '', total: '0' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
      updateGrandTotal(newProducts);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(newProducts[index].quantity) || 0;
      const price = parseFloat(newProducts[index].price) || 0;
      newProducts[index].total = (quantity * price).toFixed(2);
    }
    
    setProducts(newProducts);
    updateGrandTotal(newProducts);
  };

  const updateGrandTotal = (productsList) => {
    const total = productsList.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0);
    
    form.setValue('grand_total', total.toFixed(2));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const proposalId = `PRO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      const formattedData = {
        proposal_id: proposalId,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        proposal_date: data.proposal_date,
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        products: products,
        grand_total: data.grand_total,
        status: 'draft',
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('sales_proposals')
        .insert([formattedData]);

      if (error) throw error;

      showSuccessToast(toast, "Sales proposal created successfully");

      form.reset({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        proposal_date: new Date().toISOString().split('T')[0],
        validity_period: '30',
        terms_conditions: 'Payment due within 30 days of invoice date.\nPrices are subject to change based on market conditions.\nDelivery will be arranged upon confirmation of order.',
        grand_total: '0'
      });
      setProducts([{ name: '', description: '', quantity: '1', price: '', total: '0' }]);
    } catch (error) {
      console.error('Error creating sales proposal:', error);
      showErrorToast(toast, "Failed to create sales proposal: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
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
          <CardTitle>Sales Proposal Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proposal_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validity_period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity Period (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grand_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grand Total</FormLabel>
                      <FormControl>
                        <Input readOnly className="bg-gray-100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Products</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProduct}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </div>

                {products.map((product, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Product {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        disabled={products.length <= 1}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <FormLabel>Product Name</FormLabel>
                        <Input
                          placeholder="Enter product name"
                          value={product.name}
                          onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          placeholder="Enter product description"
                          value={product.description}
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Unit Price</FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter unit price"
                          value={product.price}
                          onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Total</FormLabel>
                        <Input
                          readOnly
                          className="bg-gray-100"
                          value={product.total}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <FormField
                control={form.control}
                name="terms_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter terms and conditions"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Sales Proposal"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProposalForm;
