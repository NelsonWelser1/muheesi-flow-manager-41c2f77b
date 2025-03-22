
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast 
} from '@/components/ui/notifications';

export const useCoffeeStock = () => {
  const [loading, setLoading] = useState(false);
  const [recentCoffeeStocks, setRecentCoffeeStocks] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { toast } = useToast();

  // Fetch recent coffee stock entries
  const fetchRecentCoffeeStocks = async () => {
    setFetchLoading(true);
    try {
      const { data, error } = await supabase
        .from('coffee_stock')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent coffee stock:', error);
        return [];
      }

      setRecentCoffeeStocks(data || []);
      return data;
    } catch (err) {
      console.error('Exception when fetching coffee stock:', err);
      return [];
    } finally {
      setFetchLoading(false);
    }
  };

  // Submit coffee stock to Supabase
  const submitCoffeeStock = async (formData) => {
    setLoading(true);
    try {
      // Validate required fields
      const requiredFields = [
        'manager', 'location', 'coffeeType', 'qualityGrade', 
        'source', 'humidity', 'buyingPrice', 'quantity'
      ];
      
      for (const field of requiredFields) {
        if (!formData[field]) {
          showWarningToast(toast, `${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
          setLoading(false);
          return { success: false, error: 'Missing required fields' };
        }
      }

      // Ensure numeric fields are valid numbers
      const numericFields = ['humidity', 'buyingPrice', 'quantity'];
      for (const field of numericFields) {
        const value = parseFloat(formData[field]);
        if (isNaN(value) || value <= 0) {
          showWarningToast(toast, `${field.replace(/([A-Z])/g, ' $1').trim()} must be a positive number`);
          setLoading(false);
          return { success: false, error: `Invalid ${field}` };
        }
      }

      // Prepare data for submission
      const coffeeStockData = {
        manager: formData.manager,
        location: formData.location,
        coffee_type: formData.coffeeType,
        quality_grade: formData.qualityGrade,
        source: formData.source,
        humidity: parseFloat(formData.humidity),
        buying_price: parseFloat(formData.buyingPrice),
        currency: formData.currency || 'UGX',
        quantity: parseFloat(formData.quantity),
        unit: formData.unit || 'kg',
        notes: formData.notes || '',
        status: 'active'
      };

      // Debug information
      console.log('Submitting coffee stock data:', coffeeStockData);

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('coffee_stock')
        .insert([coffeeStockData])
        .select();

      if (error) {
        console.error('Error submitting coffee stock:', error);
        showErrorToast(toast, `Failed to submit coffee stock: ${error.message}`);
        return { success: false, error: error.message };
      }

      // Show success notification
      showSuccessToast(toast, 'Coffee stock added successfully!');
      
      // Refresh the recent entries
      await fetchRecentCoffeeStocks();
      
      return { success: true, data };
    } catch (err) {
      console.error('Exception when submitting coffee stock:', err);
      showErrorToast(toast, `An unexpected error occurred: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Load recent entries on mount
  useEffect(() => {
    fetchRecentCoffeeStocks();
  }, []);

  return {
    submitCoffeeStock,
    fetchRecentCoffeeStocks,
    recentCoffeeStocks,
    loading,
    fetchLoading
  };
};
