import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

import CatalogBasicInfoSection from './sections/CatalogBasicInfoSection';
import ProductsListSection from './sections/ProductsListSection';

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

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const onSubmit = async (data) => {
    if (products.some(product => !product.name || !product.price)) {
      showErrorToast(toast, "Please fill in all required product fields");
      return;
    }
    
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
              <CatalogBasicInfoSection form={form} />
              
              <ProductsListSection 
                products={products} 
                setProducts={setProducts} 
                handleProductChange={handleProductChange}
              />

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
