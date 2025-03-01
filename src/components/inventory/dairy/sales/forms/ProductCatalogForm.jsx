
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

const ProductCatalogForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([{ name: '', category: '', description: '', price: '', unit: 'kg' }]);

  const form = useForm({
    defaultValues: {
      catalog_name: '',
      catalog_description: '',
      effective_date: '',
      expiry_date: '',
      status: 'draft'
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', category: '', description: '', price: '', unit: 'kg' }]);
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
    setProducts(newProducts);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Generate a catalog ID
      const catalogId = `CAT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format catalog data for Supabase
      const catalogData = {
        catalog_id: catalogId,
        catalog_name: data.catalog_name,
        catalog_description: data.catalog_description,
        effective_date: data.effective_date,
        expiry_date: data.expiry_date || null,
        status: data.status,
        created_at: new Date().toISOString(),
        created_by: userData?.user?.id || null,
        products: products
      };

      const { error } = await supabase
        .from('product_catalogs')
        .insert([catalogData]);

      if (error) throw error;

      showSuccessToast(toast, "Product catalog created successfully");

      // Reset form
      form.reset({
        catalog_name: '',
        catalog_description: '',
        effective_date: '',
        expiry_date: '',
        status: 'draft'
      });
      setProducts([{ name: '', category: '', description: '', price: '', unit: 'kg' }]);
    } catch (error) {
      console.error('Error creating product catalog:', error);
      showErrorToast(toast, "Failed to create product catalog: " + error.message);
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
          <CardTitle>Product Catalog Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="catalog_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catalog Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter catalog name" {...field} />
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
                          <SelectItem value="published">
                            <div className="flex items-center">
                              <span>Published</span>
                              <Badge variant="success" className="ml-2">Published</Badge>
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
              </div>

              <FormField
                control={form.control}
                name="catalog_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catalog Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter catalog description"
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
                      <div className="space-y-2">
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
                      <div className="space-y-2 md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          placeholder="Enter product description"
                          value={product.description}
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Price</FormLabel>
                        <Input
                          type="number"
                          placeholder="Enter product price"
                          value={product.price}
                          onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Unit</FormLabel>
                        <Select
                          value={product.unit}
                          onValueChange={(value) => handleProductChange(index, 'unit', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
                            <SelectItem value="g">Gram (g)</SelectItem>
                            <SelectItem value="l">Liter (l)</SelectItem>
                            <SelectItem value="ml">Milliliter (ml)</SelectItem>
                            <SelectItem value="pcs">Piece (pcs)</SelectItem>
                            <SelectItem value="pack">Pack</SelectItem>
                          </SelectContent>
                        </Select>
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
                  {isSubmitting ? "Submitting..." : "Create Product Catalog"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCatalogForm;
