
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
import { CalendarIcon, ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PricingSheetsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', category: '', unit_price: '', discount: '', bulk_price: '', effective_date: new Date() }
  ]);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      currency: 'USD',
      effective_date: new Date(),
      expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      status: 'draft'
    }
  });

  const addProduct = () => {
    setProducts([...products, { 
      name: '', 
      category: '', 
      unit_price: '', 
      discount: '', 
      bulk_price: '', 
      effective_date: new Date() 
    }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const onSubmit = async (data) => {
    // Validate products
    if (products.length === 0 || !products.some(p => p.name.trim() !== '')) {
      toast({
        title: "Validation Error",
        description: "At least one product must be added to the pricing sheet",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a pricing sheet ID
      const pricingSheetId = `PRC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        pricing_sheet_id: pricingSheetId,
        title: data.title,
        description: data.description,
        products: JSON.stringify(products),
        currency: data.currency,
        effective_date: data.effective_date.toISOString(),
        expiry_date: data.expiry_date.toISOString(),
        status: data.status,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('pricing_sheets')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing sheet created successfully"
      });

      // Reset form
      form.reset();
      setProducts([{ name: '', category: '', unit_price: '', discount: '', bulk_price: '', effective_date: new Date() }]);
    } catch (error) {
      console.error('Error creating pricing sheet:', error);
      toast({
        title: "Error",
        description: "Failed to create pricing sheet: " + error.message,
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
          <CardTitle>Create Pricing Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Sheet Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pricing sheet title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="UGX">UGX (USh)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effective_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Effective Date</FormLabel>
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
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry Date</FormLabel>
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
                            <Badge variant="info" className="ml-2">Draft</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="active">
                          <div className="flex items-center">
                            <span>Active</span>
                            <Badge variant="success" className="ml-2">Active</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="expired">
                          <div className="flex items-center">
                            <span>Expired</span>
                            <Badge variant="destructive" className="ml-2">Expired</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="pending_approval">
                          <div className="flex items-center">
                            <span>Pending Approval</span>
                            <Badge variant="warning" className="ml-2">Pending</Badge>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter pricing sheet description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <FormLabel>Product Name</FormLabel>
                        <Input 
                          value={product.name} 
                          onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Category</FormLabel>
                        <Input 
                          value={product.category} 
                          onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                          placeholder="E.g. Cheese, Milk, Yogurt"
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
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Discount (%)</FormLabel>
                        <Input 
                          value={product.discount} 
                          onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
                          placeholder="Enter discount percentage"
                          type="number"
                          step="0.1"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Bulk Price (per unit)</FormLabel>
                        <Input 
                          value={product.bulk_price} 
                          onChange={(e) => handleProductChange(index, 'bulk_price', e.target.value)}
                          placeholder="Enter bulk price per unit"
                          type="number"
                          step="0.01"
                        />
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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Pricing Sheet"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSheetsForm;
