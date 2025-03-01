
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

const ProductCatalogForm = ({ onBack }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([
    { name: '', description: '', category: '', price: '', unit: '', image_url: '' }
  ]);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      published_date: new Date(),
      version: '1.0',
    }
  });

  const addProduct = () => {
    setProducts([...products, { name: '', description: '', category: '', price: '', unit: '', image_url: '' }]);
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
        description: "At least one product must be added to the catalogue",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a catalogue ID
      const catalogueId = `CAT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Format data for Supabase
      const formattedData = {
        catalogue_id: catalogueId,
        title: data.title,
        description: data.description,
        products: JSON.stringify(products),
        published_date: data.published_date.toISOString(),
        version: data.version,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('product_catalogues')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product catalogue created successfully"
      });

      // Reset form
      form.reset();
      setProducts([{ name: '', description: '', category: '', price: '', unit: '', image_url: '' }]);
    } catch (error) {
      console.error('Error creating product catalogue:', error);
      toast({
        title: "Error",
        description: "Failed to create product catalogue: " + error.message,
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
          <CardTitle>Create Product Catalogue</CardTitle>
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
                      <FormLabel>Catalogue Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter catalogue title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Publication Date</FormLabel>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catalogue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter catalogue description"
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
                        <FormLabel>Price</FormLabel>
                        <Input 
                          value={product.price} 
                          onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                          placeholder="Enter price"
                          type="number"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <FormLabel>Unit</FormLabel>
                        <Input 
                          value={product.unit} 
                          onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                          placeholder="E.g. kg, L, piece"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormLabel>Image URL (optional)</FormLabel>
                        <Input 
                          value={product.image_url} 
                          onChange={(e) => handleProductChange(index, 'image_url', e.target.value)}
                          placeholder="Enter image URL"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <Textarea 
                          value={product.description} 
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                          placeholder="Enter product description"
                          rows={2}
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
                  {isSubmitting ? "Creating..." : "Create Catalogue"}
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
