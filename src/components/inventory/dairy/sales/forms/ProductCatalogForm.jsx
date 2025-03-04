
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

import CatalogBasicInfoSection from './sections/CatalogBasicInfoSection';
import ProductsListSection from './sections/ProductsListSection';

const ProductCatalogForm = ({ onBack, onViewReports }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Fetch catalogs from Supabase on component mount
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching product catalogs from Supabase...');
        
        const { data, error } = await supabase
          .from('product_catalogs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) {
          console.error('Error fetching product catalogs:', error);
          throw error;
        }
        
        console.log('Fetched product catalogs:', data);
        
        // If we have data and want to load the most recent catalog for editing
        if (data && data.length > 0) {
          const latestCatalog = data[0];
          console.log('Loading most recent catalog for reference:', latestCatalog.catalog_id);
          
          // Optionally pre-fill the form with the latest catalog data
          // Uncomment this if you want to enable editing of the most recent catalog
          /*
          form.reset({
            catalog_name: latestCatalog.catalog_name,
            catalog_description: latestCatalog.catalog_description,
            effective_date: latestCatalog.effective_date,
            expiry_date: latestCatalog.expiry_date || '',
            status: latestCatalog.status
          });
          
          setProducts(latestCatalog.products || [{ name: '', category: '', description: '', price: '', unit: 'kg' }]);
          */
        }
      } catch (error) {
        console.error('Error in fetchCatalogs:', error);
        showErrorToast(toast, "Failed to fetch product catalogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogs();
  }, [toast]);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  // Debug function for testing form data before submission
  const debugFormData = () => {
    const formData = form.getValues();
    console.log('Form data before submission:', {
      ...formData,
      products: products
    });
  };

  const onSubmit = async (data) => {
    // Debug log for form submission
    console.log('Submitting form with data:', { ...data, products });
    
    if (products.some(product => !product.name || !product.price)) {
      showErrorToast(toast, "Please fill in all required product fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a catalog ID
      const catalogId = `CAT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Get current user (if authentication is enabled)
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.log('No authenticated user, proceeding without user ID');
      }
      
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

      console.log('Saving catalog to Supabase:', catalogData);

      const { error } = await supabase
        .from('product_catalogs')
        .insert([catalogData]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Catalog saved successfully:', catalogId);
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Catalog Form</CardTitle>
          <Button 
            variant="outline" 
            onClick={onViewReports}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" /> View Reports
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <CatalogBasicInfoSection form={form} />
                
                <ProductsListSection 
                  products={products} 
                  setProducts={setProducts} 
                  handleProductChange={handleProductChange}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={debugFormData}
                  >
                    Debug Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Create Product Catalog"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCatalogForm;
