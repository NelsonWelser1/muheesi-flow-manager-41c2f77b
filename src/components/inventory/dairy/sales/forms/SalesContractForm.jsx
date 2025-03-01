
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, Plus, Trash, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const SalesContractForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([{ name: '', quantity: '', unit_price: '', total: '0' }]);
  
  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      contract_type: 'standard',
      start_date: '',
      end_date: '',
      delivery_terms: 'Standard delivery within 7 working days from order confirmation.',
      payment_terms: 'Payment due within 30 days of invoice date.',
      special_clauses: '',
      total_value: '0',
      status: 'draft',
      signed_date: ''
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', unit_price: '', total: '0' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
      updateTotalValue(newProducts);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    // Calculate total for the product
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = parseFloat(newProducts[index].quantity) || 0;
      const price = parseFloat(newProducts[index].unit_price) || 0;
      newProducts[index].total = (quantity * price).toFixed(2);
    }
    
    setProducts(newProducts);
    updateTotalValue(newProducts);
  };

  const updateTotalValue = (productsList) => {
    const total = productsList.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0);
    
    form.setValue('total_value', total.toFixed(2));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a contract ID
      const contractId = `CONT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        contract_id: contractId,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        contract_type: data.contract_type,
        start_date: data.start_date,
        end_date: data.end_date,
        delivery_terms: data.delivery_terms,
        payment_terms: data.payment_terms,
        special_clauses: data.special_clauses,
        products: products,
        total_value: parseFloat(data.total_value),
        status: data.status,
        signed_date: data.signed_date || null,
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('sales_contracts')
        .insert([formattedData]);

      if (error) throw error;

      showSuccessToast(toast, "Sales contract created successfully");

      // Reset form
      form.reset({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        contract_type: 'standard',
        start_date: '',
        end_date: '',
        delivery_terms: 'Standard delivery within 7 working days from order confirmation.',
        payment_terms: 'Payment due within 30 days of invoice date.',
        special_clauses: '',
        total_value: '0',
        status: 'draft',
        signed_date: ''
      });
      setProducts([{ name: '', quantity: '', unit_price: '', total: '0' }]);
    } catch (error) {
      console.error('Error creating sales contract:', error);
      showErrorToast(toast, "Failed to create sales contract: " + error.message);
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
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sales Contract Form
          </CardTitle>
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
                  name="contract_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Type</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="volume_based">Volume Based</SelectItem>
                          <SelectItem value="long_term">Long Term</SelectItem>
                          <SelectItem value="exclusive">Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <span>Draft</span>
                              <Badge variant="secondary" className="ml-2">Draft</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="pending_approval">
                            <div className="flex items-center">
                              <span>Pending Approval</span>
                              <Badge variant="warning" className="ml-2">Pending</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="approved">
                            <div className="flex items-center">
                              <span>Approved</span>
                              <Badge variant="success" className="ml-2">Approved</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="active">
                            <div className="flex items-center">
                              <span>Active</span>
                              <Badge variant="info" className="ml-2">Active</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center">
                              <span>Completed</span>
                              <Badge className="ml-2">Completed</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="terminated">
                            <div className="flex items-center">
                              <span>Terminated</span>
                              <Badge variant="destructive" className="ml-2">Terminated</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signed_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signed Date (if applicable)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter payment terms"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Terms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter delivery terms"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="special_clauses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Clauses (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any special clauses or conditions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          value={product.unit_price}
                          onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
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
                name="total_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Total Value</FormLabel>
                    <FormControl>
                      <Input readOnly className="bg-gray-100 font-bold" {...field} />
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
                  {isSubmitting ? "Submitting..." : "Create Sales Contract"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesContractForm;
