
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
import { CalendarIcon, ArrowLeft, Plus, X, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PricingSheetsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', base_price: '', bulk_price: '', wholesale_price: '', retail_price: '' }
  ]);
  
  const form = useForm({
    defaultValues: {
      title: '',
      effective_date: new Date(),
      expiry_date: null,
      pricing_strategy: 'standard',
      notes: '',
      status: 'active'
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', base_price: '', bulk_price: '', wholesale_price: '', retail_price: '' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
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
    setProducts(newProducts);
  };

  const cloneRow = (index) => {
    const productToCopy = { ...products[index] };
    setProducts([...products, productToCopy]);
  };

  const calculateRetailPrice = (index) => {
    const product = products[index];
    if (product.base_price) {
      const basePrice = parseFloat(product.base_price);
      if (!isNaN(basePrice)) {
        // Apply a standard markup (30% for retail)
        const retailPrice = (basePrice * 1.3).toFixed(2);
        updateProduct(index, 'retail_price', retailPrice);
        
        // Calculate other prices as well
        updateProduct(index, 'bulk_price', (basePrice * 1.1).toFixed(2));
        updateProduct(index, 'wholesale_price', (basePrice * 1.2).toFixed(2));
      }
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a sheet ID
      const sheetId = `PRC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format dates for Supabase
      const formattedData = {
        sheet_id: sheetId,
        title: data.title,
        effective_date: data.effective_date.toISOString(),
        expiry_date: data.expiry_date ? data.expiry_date.toISOString() : null,
        products: JSON.stringify(products),
        pricing_strategy: data.pricing_strategy,
        notes: data.notes,
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
      setProducts([{ name: '', base_price: '', bulk_price: '', wholesale_price: '', retail_price: '' }]);
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Q2 2024 Pricing" {...field} />
                      </FormControl>
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
                      <FormLabel>Expiry Date (Optional)</FormLabel>
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricing_strategy"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pricing Strategy</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="standard" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Standard
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="promotional" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Promotional
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="seasonal" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Seasonal
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about this pricing sheet"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Product Pricing</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-2 text-left">Product Name</th>
                        <th className="p-2 text-left">Base Price (USD)</th>
                        <th className="p-2 text-left">Bulk Price (USD)</th>
                        <th className="p-2 text-left">Wholesale Price (USD)</th>
                        <th className="p-2 text-left">Retail Price (USD)</th>
                        <th className="p-2 text-left">Actions</th>
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
                              value={product.base_price}
                              onChange={(e) => updateProduct(index, 'base_price', e.target.value)}
                              onBlur={() => calculateRetailPrice(index)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={product.bulk_price}
                              onChange={(e) => updateProduct(index, 'bulk_price', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={product.wholesale_price}
                              onChange={(e) => updateProduct(index, 'wholesale_price', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={product.retail_price}
                              onChange={(e) => updateProduct(index, 'retail_price', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => cloneRow(index)}
                                title="Clone row"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProduct(index)}
                                title="Remove row"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
