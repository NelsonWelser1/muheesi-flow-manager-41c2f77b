
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Search, Calendar, Image, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import ProductCataloguesDisplay from './displays/ProductCataloguesDisplay';

const ProductCataloguesForm = ({ onBack }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [catalogueId, setCatalogueId] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [catalogueVersion, setCatalogueVersion] = useState('1.0');

  // Generate a unique catalogue ID on component mount
  useEffect(() => {
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const uniqueId = `CAT-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    setCatalogueId(uniqueId);
    setValue('catalogue_id', uniqueId);
    
    // Set default published date to today
    setValue('published_date', format(new Date(), 'yyyy-MM-dd'));
  }, [setValue]);

  // Fetch products from cold_room_inventory
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cold_room_inventory')
          .select('*')
          .order('storage_date_time', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log('Products fetched:', data);
          setProducts(data);
        } else {
          console.log('No products found, using sample data');
          setProducts([
            { id: 1, product_type: 'Cheese', batch_id: 'BATCH-001', unit_quantity: 50, unit_weight: 250 },
            { id: 2, product_type: 'Milk', batch_id: 'BATCH-002', unit_quantity: 100, unit_weight: 1000 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products: " + error.message,
          variant: "destructive",
        });
        // Use sample data on error
        setProducts([
          { id: 1, product_type: 'Cheese', batch_id: 'BATCH-001', unit_quantity: 50, unit_weight: 250 },
          { id: 2, product_type: 'Milk', batch_id: 'BATCH-002', unit_quantity: 100, unit_weight: 1000 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '';
    // Remove any non-numeric characters except decimal point
    const numericValue = value.toString().replace(/[^0-9.]/g, '');
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    // Format with commas
    const parts = number.toFixed(2).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `UGX ${parts.join('.')}`;
  };

  // Parse currency string back to number
  const parseCurrency = (value) => {
    if (!value) return '';
    return value.toString().replace(/[^0-9.]/g, '');
  };

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === Number(productId));
    if (product) {
      setValue('product_type', product.product_type);
      setValue('batch_id', product.batch_id);
      setValue('product_quantity', product.unit_quantity);
      setValue('unit_weight', product.unit_weight);
    }
  };

  // Handle price input formatting
  const handlePriceChange = (e) => {
    const input = e.target.value;
    const numericValue = parseCurrency(input);
    if (numericValue === '' || !isNaN(numericValue)) {
      setValue('product_price', formatCurrency(numericValue));
    }
  };

  // Add product to the catalogue
  const handleAddProduct = () => {
    const productType = watch('product_type');
    const productDescription = watch('product_description');
    const productPrice = watch('product_price');
    const productFeatures = watch('product_features');
    const imageUrl = watch('image_url') || 'https://placeholder.co/400x300';
    
    if (!productType || !productDescription || !productPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required product details",
        variant: "destructive",
      });
      return;
    }
    
    const newProduct = {
      id: selectedProducts.length + 1,
      product_type: productType,
      description: productDescription,
      price: productPrice,
      features: productFeatures,
      image_url: imageUrl
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
    
    // Clear product fields for next entry
    setValue('product_type', '');
    setValue('product_description', '');
    setValue('product_price', '');
    setValue('product_features', '');
    setValue('image_url', '');
  };

  // Remove product from the catalogue
  const handleRemoveProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(product => product.id !== productId);
    // Reassign IDs to maintain sequence
    const reindexedProducts = updatedProducts.map((product, index) => ({
      ...product,
      id: index + 1
    }));
    setSelectedProducts(reindexedProducts);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the catalogue",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Prepare data for submission
      const catalogue = {
        catalogue_id: data.catalogue_id,
        title: data.title,
        description: data.description,
        products: selectedProducts,
        published_date: data.published_date,
        version: catalogueVersion,
        created_by: user?.id || 'anonymous',
        created_at: new Date().toISOString(),
      };
      
      // Insert into product_catalogues table
      const { error } = await supabase
        .from('product_catalogues')
        .insert([catalogue]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product catalogue saved successfully",
      });
      
      // Reset form and state
      reset();
      setSelectedProducts([]);
      
      // Generate new catalogue ID
      const timestamp = format(new Date(), 'yyyyMMddHHmmss');
      const uniqueId = `CAT-${timestamp}-${Math.floor(Math.random() * 1000)}`;
      setCatalogueId(uniqueId);
      setValue('catalogue_id', uniqueId);
      setValue('published_date', format(new Date(), 'yyyy-MM-dd'));
      
    } catch (error) {
      console.error('Error saving catalogue:', error);
      toast({
        title: "Error",
        description: "Failed to save catalogue: " + error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (showDisplay) {
    return <ProductCataloguesDisplay onBack={() => setShowDisplay(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setShowDisplay(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" /> View Catalogues
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Product Catalogue/Brochure</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="catalogue_id">Catalogue ID</Label>
                <Input 
                  id="catalogue_id" 
                  {...register("catalogue_id", { required: true })} 
                  readOnly 
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="published_date">Published Date</Label>
                <div className="relative">
                  <Input 
                    id="published_date" 
                    type="date"
                    {...register("published_date", { required: true })} 
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.published_date && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Catalogue Title</Label>
                <Input 
                  id="title" 
                  {...register("title", { required: true })} 
                  placeholder="Enter catalogue title"
                />
                {errors.title && <p className="text-red-500 text-sm">This field is required</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Catalogue Description</Label>
                <Textarea 
                  id="description" 
                  {...register("description")} 
                  rows={3}
                  placeholder="Enter a description for this catalogue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Select 
                  value={catalogueVersion}
                  onValueChange={setCatalogueVersion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0</SelectItem>
                    <SelectItem value="1.1">1.1</SelectItem>
                    <SelectItem value="1.2">1.2</SelectItem>
                    <SelectItem value="2.0">2.0</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Add Products to Catalogue</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : products.length > 0 ? (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.product_type} - {product.batch_id}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled>No products found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Input 
                    {...register("product_type")} 
                    className="mt-2"
                    placeholder="Or type manually"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product_price">Price</Label>
                  <Input 
                    id="product_price" 
                    {...register("product_price")} 
                    onChange={handlePriceChange}
                    placeholder="UGX 0.00"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product_description">Product Description</Label>
                  <Textarea 
                    id="product_description" 
                    {...register("product_description")} 
                    rows={2}
                    placeholder="Describe the product"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product_features">Product Features (comma separated)</Label>
                  <Textarea 
                    id="product_features" 
                    {...register("product_features")} 
                    rows={2}
                    placeholder="e.g., Organic, High-protein, Premium quality"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="relative">
                    <Input 
                      id="image_url" 
                      {...register("image_url")} 
                      placeholder="Enter image URL or leave empty for placeholder"
                    />
                    <Image className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">If left empty, a placeholder image will be used</p>
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddProduct}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Product to Catalogue
              </Button>
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Products in Catalogue</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="border rounded-md p-3 relative">
                      <Button
                        type="button" 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.product_type}</h4>
                          <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          <p className="text-sm font-medium">{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Catalogue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCataloguesForm;
