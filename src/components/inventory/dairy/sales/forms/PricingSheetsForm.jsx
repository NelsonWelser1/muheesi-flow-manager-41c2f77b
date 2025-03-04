
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, Plus, Trash, FileText, Bug } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import { PricingSheetsDisplay } from './displays/PricingSheetsDisplay';

const PricingSheetsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [products, setProducts] = useState([{ 
    name: '', 
    category: '', 
    base_price: '', 
    discount: '0', 
    final_price: '0' 
  }]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      effective_date: '',
      expiry_date: '',
      status: 'draft'
    }
  });

  const addProduct = () => {
    setProducts([...products, { 
      name: '', 
      category: '', 
      base_price: '', 
      discount: '0', 
      final_price: '0' 
    }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    
    // Calculate final price when base_price or discount changes
    if (field === 'base_price' || field === 'discount') {
      const basePrice = parseFloat(newProducts[index].base_price) || 0;
      const discount = parseFloat(newProducts[index].discount) || 0;
      const finalPrice = basePrice * (1 - discount / 100);
      newProducts[index].final_price = finalPrice.toFixed(2);
    }
    
    setProducts(newProducts);
  };

  // Debug handler to print form data to console
  const handleDebug = () => {
    const formData = form.getValues();
    console.log('Current form values:', formData);
    console.log('Products:', products);
  };

  const onSubmit = async (data) => {
    if (products.some(product => !product.name || !product.base_price)) {
      showErrorToast(toast, "Please fill in all required product fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a sheet ID
      const sheetId = `PS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user data:', userData);
      
      // Format data for Supabase
      const formattedData = {
        sheet_id: sheetId,
        title: data.title,
        description: data.description,
        effective_date: data.effective_date,
        expiry_date: data.expiry_date || null,
        products: products,
        status: data.status,
        created_by: userData?.user?.id || null
      };

      console.log('Submitting pricing sheet data:', formattedData);

      const { data: insertData, error } = await supabase
        .from('pricing_sheets')
        .insert([formattedData])
        .select();

      if (error) {
        console.error('Error creating pricing sheet:', error);
        throw error;
      }

      console.log('Pricing sheet created successfully:', insertData);
      showSuccessToast(toast, "Pricing sheet created successfully");

      // Reset form
      form.reset({
        title: '',
        description: '',
        effective_date: '',
        expiry_date: '',
        status: 'draft'
      });
      setProducts([{ 
        name: '', 
        category: '', 
        base_price: '', 
        discount: '0', 
        final_price: '0' 
      }]);
    } catch (error) {
      console.error('Error creating pricing sheet:', error);
      showErrorToast(toast, "Failed to create pricing sheet: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showDisplay) {
    return <PricingSheetsDisplay onBack={() => setShowDisplay(false)} />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing Sheets Form</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleDebug}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" /> Debug Form
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDisplay(true)}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> View Reports
            </Button>
          </div>
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
                        <Input placeholder="Enter pricing sheet title" {...field} />
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
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
                  name="effective_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effective Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <FormLabel>Category</FormLabel>
                        <Input
                          placeholder="Enter product category"
                          value={product.category}
                          onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Base Price ($)</FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter base price"
                          value={product.base_price}
                          onChange={(e) => handleProductChange(index, 'base_price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Discount (%)</FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter discount percentage"
                          value={product.discount}
                          onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Final Price ($)</FormLabel>
                        <Input
                          readOnly
                          className="bg-gray-100"
                          value={product.final_price}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Pricing Sheet"}
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
