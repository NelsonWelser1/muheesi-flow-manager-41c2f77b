
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { CalendarIcon, ArrowLeft, PlusCircle, Trash2, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalesProposalForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', quantity: '1', unit_price: '0', total: '0' }
  ]);
  
  const form = useForm({
    defaultValues: {
      customer_name: '',
      contact_email: '',
      contact_phone: '',
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nPrices valid for the duration specified in this proposal.\nDelivery terms to be agreed upon acceptance.',
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '1', unit_price: '0', total: '0' }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    
    // Recalculate total for this product
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = parseFloat(updatedProducts[index].quantity) || 0;
      const unitPrice = parseFloat(updatedProducts[index].unit_price) || 0;
      updatedProducts[index].total = (quantity * unitPrice).toFixed(2);
    }
    
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const [subTotal, setSubTotal] = useState('0.00');
  const [taxRate, setTaxRate] = useState('18');
  const [taxAmount, setTaxAmount] = useState('0.00');
  const [grandTotal, setGrandTotal] = useState('0.00');

  const calculateTotals = (productList) => {
    const subtotal = productList.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0);
    
    const tax = (subtotal * parseFloat(taxRate || 0)) / 100;
    const total = subtotal + tax;
    
    setSubTotal(subtotal.toFixed(2));
    setTaxAmount(tax.toFixed(2));
    setGrandTotal(total.toFixed(2));
  };

  const handleTaxRateChange = (e) => {
    const newTaxRate = e.target.value;
    setTaxRate(newTaxRate);
    
    const subtotal = parseFloat(subTotal);
    const tax = (subtotal * parseFloat(newTaxRate || 0)) / 100;
    const total = subtotal + tax;
    
    setTaxAmount(tax.toFixed(2));
    setGrandTotal(total.toFixed(2));
  };

  const onSubmit = async (data) => {
    // Validate products
    if (products.length === 0 || !products.some(p => p.name.trim() !== '')) {
      toast({
        title: "Validation Error",
        description: "At least one product must be added to the proposal",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a proposal ID
      const proposalId = `PROP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        proposal_id: proposalId,
        customer_name: data.customer_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        products: JSON.stringify(products),
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        grand_total: grandTotal,
        tax_amount: taxAmount,
        sub_total: subTotal,
        tax_rate: taxRate,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('sales_proposals')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales proposal created successfully"
      });

      // Reset form
      form.reset();
      setProducts([{ name: '', quantity: '1', unit_price: '0', total: '0' }]);
      setSubTotal('0.00');
      setTaxAmount('0.00');
      setGrandTotal('0.00');
    } catch (error) {
      console.error('Error creating sales proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create sales proposal: " + error.message,
        variant: "destructive",
      });
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
          <CardTitle>Create Sales Proposal</CardTitle>
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
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter contact email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Products</h3>
                
                {products.map((product, index) => (
                  <div key={index} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Product {index + 1}</h4>
                      {products.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeProduct(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <FormLabel>Product Name</FormLabel>
                        <Input 
                          value={product.name} 
                          onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Quantity</FormLabel>
                        <Input 
                          value={product.quantity} 
                          onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                          placeholder="Quantity"
                          type="number"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Unit Price</FormLabel>
                        <Input 
                          value={product.unit_price} 
                          onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
                          placeholder="Enter unit price"
                          type="number"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormLabel>Line Total</FormLabel>
                        <div className="flex items-center">
                          <Input 
                            value={product.total} 
                            readOnly 
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProduct}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add Product
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Pricing Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subTotal}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Tax Rate (%):</span>
                      <Input 
                        value={taxRate}
                        onChange={handleTaxRateChange}
                        className="w-20"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <span>${taxAmount}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Grand Total:</span>
                    <span>${grandTotal}</span>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="terms_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter terms and conditions"
                        className="min-h-[120px]"
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
                  {isSubmitting ? "Creating..." : "Create Proposal"}
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
