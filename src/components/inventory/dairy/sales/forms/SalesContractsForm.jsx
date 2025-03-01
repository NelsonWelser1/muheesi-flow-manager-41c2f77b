
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
import { CalendarIcon, ArrowLeft, Plus, X, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SalesContractsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', quantity: '', unit_price: '', total: '0.00' }
  ]);
  
  const form = useForm({
    defaultValues: {
      customer_name: '',
      customer_id: '',
      contract_type: 'standard',
      start_date: new Date(),
      end_date: null,
      terms: '',
      status: 'draft'
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
      calculateTotalValue(newProducts);
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
    calculateTotalValue(newProducts);
  };

  const [totalValue, setTotalValue] = useState('0.00');
  
  const calculateTotalValue = (productsList) => {
    const total = productsList.reduce((sum, product) => {
      return sum + (parseFloat(product.total) || 0);
    }, 0);
    setTotalValue(total.toFixed(2));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a contract ID
      const contractId = `CON-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      const formattedData = {
        contract_id: contractId,
        customer_name: data.customer_name,
        customer_id: data.customer_id || null,
        contract_type: data.contract_type,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : null,
        products: JSON.stringify(products),
        terms: data.terms,
        total_value: parseFloat(totalValue),
        status: data.status,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('sales_contracts')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales contract created successfully"
      });

      // Reset form
      form.reset();
      setProducts([{ name: '', quantity: '', unit_price: '', total: '0.00' }]);
      setTotalValue('0.00');
    } catch (error) {
      console.error('Error creating sales contract:', error);
      toast({
        title: "Error",
        description: "Failed to create sales contract: " + error.message,
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
    calculateTotalValue(newProducts);
  };

  const autoPopulateProducts = () => {
    setProducts([
      { 
        name: 'Fresh Milk (Monthly Supply)', 
        quantity: '1000', 
        unit_price: '2.50', 
        total: '2500.00' 
      },
      { 
        name: 'Yogurt Variety Pack', 
        quantity: '300', 
        unit_price: '3.75', 
        total: '1125.00' 
      },
      { 
        name: 'Cheese Assortment', 
        quantity: '150', 
        unit_price: '4.99', 
        total: '748.50' 
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
          <CardTitle>Create Sales Contract</CardTitle>
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
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer ID if available" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="distributor">Distributor Agreement</SelectItem>
                          <SelectItem value="retail">Retail Agreement</SelectItem>
                          <SelectItem value="wholesale">Wholesale Contract</SelectItem>
                          <SelectItem value="custom">Custom Agreement</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending_approval">Pending Approval</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                        <td colSpan="3" className="p-2 text-right">Contract Value:</td>
                        <td className="p-2 text-right">${totalValue}</td>
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
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Terms & Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter contract terms and conditions"
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
                  {isSubmitting ? "Creating..." : "Create Contract"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesContractsForm;
