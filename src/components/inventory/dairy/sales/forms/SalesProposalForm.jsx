
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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, Plus, X, Calculator } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalesProposalForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', quantity: '', unit_price: '', total: '0.00' }
  ]);
  
  const form = useForm({
    defaultValues: {
      customer_name: '',
      contact_email: '',
      contact_phone: '',
      validity_period: '30',
      terms_conditions: 'Payment due within 30 days of invoice date.\nDelivery within 7 working days of order confirmation.\nPrices subject to change without notice.',
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: '', unit_price: '', total: '0.00' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
      calculateGrandTotal(newProducts);
    } else {
      toast({
        title: "Cannot Remove",
        description: "At least one product is required",
        variant: "destructive",
      });
    }
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    
    // Calculate total for this product
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = parseFloat(newProducts[index].quantity) || 0;
      const price = parseFloat(newProducts[index].unit_price) || 0;
      newProducts[index].total = (quantity * price).toFixed(2);
    }
    
    setProducts(newProducts);
    calculateGrandTotal(newProducts);
  };

  const [grandTotal, setGrandTotal] = useState('0.00');
  
  const calculateGrandTotal = (productsList) => {
    const total = productsList.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0);
    setGrandTotal(total.toFixed(2));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a proposal ID
      const proposalId = `PRO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      const formattedData = {
        proposal_id: proposalId,
        customer_name: data.customer_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        products: JSON.stringify(products),
        validity_period: parseInt(data.validity_period),
        terms_conditions: data.terms_conditions,
        grand_total: grandTotal,
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
      setProducts([{ name: '', quantity: '', unit_price: '', total: '0.00' }]);
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

  const calculateAllTotals = () => {
    const newProducts = [...products];
    
    newProducts.forEach((product, index) => {
      const quantity = parseFloat(product.quantity) || 0;
      const price = parseFloat(product.unit_price) || 0;
      newProducts[index].total = (quantity * price).toFixed(2);
    });
    
    setProducts(newProducts);
    calculateGrandTotal(newProducts);
  };

  const autoPopulateProducts = () => {
    setProducts([
      { 
        name: 'Fresh Milk (1L)', 
        quantity: '100', 
        unit_price: '2.50', 
        total: '250.00' 
      },
      { 
        name: 'Yogurt (500g)', 
        quantity: '50', 
        unit_price: '3.75', 
        total: '187.50' 
      },
      { 
        name: 'Cheese (250g)', 
        quantity: '25', 
        unit_price: '4.99', 
        total: '124.75' 
      }
    ]);
    
    calculateAllTotals();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline" 
          onClick={autoPopulateProducts}
          className="flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" /> Auto-fill Sample
        </Button>
      </div>

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
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="customer@example.com" {...field} />
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
                        <Input placeholder="+1 234 567 8900" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select validity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="45">45 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Products & Services</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-2 text-left">Product Name</th>
                        <th className="p-2 text-right">Quantity</th>
                        <th className="p-2 text-right">Unit Price (USD)</th>
                        <th className="p-2 text-right">Total (USD)</th>
                        <th className="p-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">
                            <Input
                              value={product.name}
                              onChange={(e) => updateProduct(index, 'name', e.target.value)}
                              placeholder="Product name"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                              placeholder="0"
                              min="0"
                              className="text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={product.unit_price}
                              onChange={(e) => updateProduct(index, 'unit_price', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              readOnly
                              value={product.total}
                              className="bg-muted/30 text-right"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProduct(index)}
                              title="Remove row"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-muted/20">
                        <td colSpan="3" className="p-2 text-right">Grand Total:</td>
                        <td className="p-2 text-right">${grandTotal}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProduct}
                  className="flex items-center gap-2 mt-4"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
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
