
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { showSuccessToast, showErrorToast, showInfoToast } from "@/components/ui/notifications";

export const useAdvertisingPromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch promotions on component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Fetch all promotions from the database
  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching advertising promotions...');
      const { data, error } = await supabase
        .from('advertising_promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`Fetched ${data?.length || 0} advertising promotions`);
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching advertising promotions:', error);
      showErrorToast(toast, 'Failed to load advertising promotions');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a new promotion to the database
  const submitPromotion = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting advertising promotion:', formData);
      
      // Add additional fields or transformations here if needed
      const promotionData = {
        ...formData,
        promotion_id: `PROMO-${Date.now().toString(36)}`,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('advertising_promotions')
        .insert([promotionData])
        .select();

      if (error) throw error;
      
      console.log('Promotion created successfully:', data);
      showSuccessToast(toast, 'Advertising promotion created successfully');
      
      // Refresh the list after adding
      fetchPromotions();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating promotion:', error);
      showErrorToast(toast, error.message || 'Failed to create advertising promotion');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to log current promotions
  const debugPromotions = () => {
    console.log('Current promotions:', promotions);
    showInfoToast(toast, `${promotions.length} promotions in database`);
    return promotions;
  };

  return {
    promotions,
    isLoading,
    isSubmitting,
    fetchPromotions,
    submitPromotion,
    debugPromotions
  };
};

export default useAdvertisingPromotion;
