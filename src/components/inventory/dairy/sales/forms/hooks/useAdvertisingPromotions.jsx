
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useAdvertisingPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch all advertising promotions
  const fetchPromotions = async () => {
    console.log('Fetching advertising promotions...');
    setIsLoading(true);
    try {
      // Check if table exists
      const { error: checkError } = await supabase
        .from('advertising_promotions')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Table does not exist, creating advertising_promotions table...');
        const { error: createError } = await supabase.rpc('create_advertising_promotions_table');
        if (createError) throw createError;
        console.log('Advertising promotions table created successfully');
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('advertising_promotions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Advertising promotions fetched:', data);
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching advertising promotions:', error);
      toast({
        title: "Error",
        description: "Failed to load advertising promotions data: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Handle form submission
  const submitPromotion = async (formData, files) => {
    console.log('Submitting promotion data:', formData);
    console.log('Files to upload:', files);
    
    setIsSubmitting(true);
    try {
      // Generate a promotion ID
      const promotionId = `PROM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Upload files if any
      let fileUrls = [];
      if (files && files.length > 0) {
        try {
          fileUrls = await uploadFiles(promotionId, files);
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          throw new Error('Failed to upload promotional materials: ' + uploadError.message);
        }
      }
      
      // Format data for Supabase
      const submissionData = {
        promotion_id: promotionId,
        title: formData.promotion_title,
        promotion_type: formData.promotion_type,
        material_type: formData.material_type,
        target_audience: formData.target_audience,
        objectives: formData.objectives,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        channels: formData.channels || [],
        assets_urls: fileUrls,
        status: formData.status,
        created_by: userData?.user?.id || null
      };

      const { error } = await supabase
        .from('advertising_promotions')
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Advertising/Promotion campaign created successfully"
      });
      
      // Refresh data
      await fetchPromotions();
      
      return true;
    } catch (error) {
      console.error('Error creating advertising/promotion:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign: " + error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to upload files
  const uploadFiles = async (promotionId, files) => {
    console.log(`Uploading ${files.length} files for promotion ${promotionId}...`);
    
    const uploadPromises = files.map(async (fileObj) => {
      const fileExt = fileObj.name.split('.').pop();
      const fileName = `${promotionId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `promotions/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('marketing')
        .upload(filePath, fileObj.file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('marketing')
        .getPublicUrl(filePath);
      
      return {
        name: fileObj.name,
        path: filePath,
        type: fileObj.type,
        size: fileObj.size,
        url: urlData.publicUrl
      };
    });
    
    return Promise.all(uploadPromises);
  };

  // Debug function to log current state
  const debugState = () => {
    console.log('Current promotions state:', promotions);
    console.log('isLoading:', isLoading);
    console.log('isSubmitting:', isSubmitting);
    return { promotions, isLoading, isSubmitting };
  };

  return {
    promotions,
    isLoading,
    isSubmitting,
    fetchPromotions,
    submitPromotion,
    debugState
  };
};
