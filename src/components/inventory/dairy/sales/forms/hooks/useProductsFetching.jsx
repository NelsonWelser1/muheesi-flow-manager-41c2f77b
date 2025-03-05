
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";

export const useProductsFetching = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();

  // Fetch products from cold_room_inventory for auto-fill
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

  return {
    loading,
    products
  };
};

export default useProductsFetching;
