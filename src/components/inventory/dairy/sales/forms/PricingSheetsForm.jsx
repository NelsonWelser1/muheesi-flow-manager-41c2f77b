
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

const PricingSheetsForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricingItems, setPricingItems] = useState([{ 
    product_name: '', 
    standard_price: '', 
    wholesale_price: '',
    min_order_qty: '1',
    discount_percentage: '0',
    currency: 'USD'
  }]);

  const form = useForm({
    defaultValues: {
      pricing_sheet_name: '',
      pricing_sheet_description: '',
      effective_date: '',
      expiry_date: '',
      region: 'global',
      customer_category: 'all',
      status: 'draft'
    }
  });

  const addPricingItem = () => {
    setPricingItems([...pricingItems, { 
      product_name: '', 
      standard_price: '', 
      wholesale_price: '',
      min_order_qty: '1',
      discount_percentage: '0',
      currency: 'USD'
    }]);
  };

  const removePricingItem = (index) => {
    if (pricingItems.length > 1) {
      const newPricingItems = [...pricingItems];
      newPricingItems.splice(index, 1);
      setPricingItems(newPricingItems);
    }
  };

  const handlePricingItemChange = (index, field, value) => {
    const newPricingItems = [...pricingItems];
    newPricingItems[index][field] = value;
    setPricingItems(newPricingItems);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a pricing sheet ID
      const pricingSheetId = `PRC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format pricing sheet data for Supabase
      const pricingSheetData = {
        pricing_sheet_id: pricingSheetId,
        pricing_sheet_name: data.pricing_sheet_name,
        pricing_sheet_description: data.pricing_sheet_description,
        effective_date: data.effective_date,
        expiry_date: data.expiry_date || null,
        region: data.region,
        customer_category: data.customer_category,
        status: data.status,
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null,
        pricing_items: pricingItems
      };

      const { error } = await supabase
        .from('pricing_sheets')
        .insert([pricingSheetData]);

      if (error) throw error;

      showSuccessToast(toast, "Pricing sheet created successfully");

      // Reset form
      form.reset({
        pricing_sheet_name: '',
        pricing_sheet_description: '',
        effective_date: '',
        expiry_date: '',
        region: 'global',
        customer_category: 'all',
        status: 'draft'
      });
      setPricingItems([{ 
        product_name: '', 
        standard_price: '', 
        wholesale_price: '',
        min_order_qty: '1',
        discount_percentage: '0',
        currency: 'USD'
      }]);
    } catch (error) {
      console.error('Error creating pricing sheet:', error);
      showErrorToast(toast, "Failed to create pricing sheet: " + error.message);
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
          <CardTitle>Pricing Sheet Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pricing_sheet_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Sheet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pricing sheet name" {...field} />
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
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="africa">Africa</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="north_america">North America</SelectItem>
                          <SelectItem value="south_america">South America</SelectItem>
                          <SelectItem value="oceania">Oceania</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Category</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Customers</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="preferred">Preferred</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pricing_sheet_description"
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
                  <h3 className="text-lg font-medium">Pricing Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPricingItem}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </Button>
                </div>

                {pricingItems.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Price Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePricingItem(index)}
                        disabled={pricingItems.length <= 1}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-3">
                        <FormLabel>Product Name</FormLabel>
                        <Input
                          placeholder="Enter product name"
                          value={item.product_name}
                          onChange={(e) => handlePricingItemChange(index, 'product_name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Standard Price</FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter standard price"
                          value={item.standard_price}
                          onChange={(e) => handlePricingItemChange(index, 'standard_price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Wholesale Price</FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter wholesale price"
                          value={item.wholesale_price}
                          onChange={(e) => handlePricingItemChange(index, 'wholesale_price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Currency</FormLabel>
                        <Select
                          value={item.currency}
                          onValueChange={(value) => handlePricingItemChange(index, 'currency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="UGX">UGX (USh)</SelectItem>
                            <SelectItem value="KES">KES (KSh)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Min. Order Quantity</FormLabel>
                        <Input
                          type="number"
                          placeholder="Enter minimum order quantity"
                          value={item.min_order_qty}
                          onChange={(e) => handlePricingItemChange(index, 'min_order_qty', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Discount %</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter discount percentage"
                          value={item.discount_percentage}
                          onChange={(e) => handlePricingItemChange(index, 'discount_percentage', e.target.value)}
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
