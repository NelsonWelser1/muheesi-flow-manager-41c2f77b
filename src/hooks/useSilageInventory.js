
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from 'date-fns';

export const useSilageInventory = (farmId) => {
  const [silageData, setSilageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch silage inventory data
  const fetchSilageData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching silage inventory data for farm: ${farmId}`);
      const { data, error } = await supabase
        .from('silage_inventory')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching silage data:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} silage records`);
      setSilageData(data || []);
    } catch (err) {
      console.error('Error in fetchSilageData:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to load silage data: ${err.message || "Unknown error"}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add new silage record
  const addSilageRecord = async (silageData) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!silageData.type) {
        throw new Error("Silage type is required");
      }
      if (!silageData.amount || silageData.amount <= 0) {
        throw new Error("Valid amount is required");
      }
      if (!silageData.unit) {
        throw new Error("Unit is required");
      }
      if (!silageData.productionDate) {
        throw new Error("Production date is required");
      }
      if (!silageData.quality) {
        throw new Error("Quality rating is required");
      }

      // Format data for insertion
      const recordToInsert = {
        type: silageData.type,
        amount: parseFloat(silageData.amount),
        unit: silageData.unit,
        production_date: silageData.productionDate,
        expiry_date: silageData.expiryDate || null,
        storage_location: silageData.storageLocation || null,
        quality: silageData.quality,
        notes: silageData.notes || null,
        ingredients: silageData.ingredients || null,
        expenses_incurred: silageData.expensesIncurred ? parseFloat(silageData.expensesIncurred) : null,
        person_in_charge: silageData.personInCharge || null,
        farm_id: farmId
      };

      console.log('Adding silage record:', recordToInsert);
      
      const { data, error } = await supabase
        .from('silage_inventory')
        .insert([recordToInsert])
        .select();

      if (error) {
        console.error('Error inserting silage record:', error);
        throw error;
      }
      
      console.log('Successfully added silage record:', data);
      
      toast({
        title: "Success",
        description: "Silage record added successfully",
      });
      
      await fetchSilageData();
      return true;
    } catch (err) {
      console.error('Error adding silage record:', err);
      toast({
        title: "Error",
        description: `Failed to add silage record: ${err.message || "Unknown error"}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing silage record
  const updateSilageRecord = async (id, updatedData) => {
    setIsSubmitting(true);
    try {
      // Format data for update
      const recordToUpdate = {
        type: updatedData.type,
        amount: parseFloat(updatedData.amount),
        unit: updatedData.unit,
        production_date: updatedData.productionDate,
        expiry_date: updatedData.expiryDate || null,
        storage_location: updatedData.storageLocation || null,
        quality: updatedData.quality,
        notes: updatedData.notes || null,
        ingredients: updatedData.ingredients || null,
        expenses_incurred: updatedData.expensesIncurred ? parseFloat(updatedData.expensesIncurred) : null,
        person_in_charge: updatedData.personInCharge || null,
        updated_at: new Date().toISOString()
      };

      console.log('Updating silage record:', recordToUpdate);
      
      const { data, error } = await supabase
        .from('silage_inventory')
        .update(recordToUpdate)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating silage record:', error);
        throw error;
      }
      
      console.log('Successfully updated silage record:', data);
      
      toast({
        title: "Success",
        description: "Silage record updated successfully",
      });
      
      await fetchSilageData();
      return true;
    } catch (err) {
      console.error('Error updating silage record:', err);
      toast({
        title: "Error",
        description: `Failed to update silage record: ${err.message || "Unknown error"}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete silage record
  const deleteSilageRecord = async (id) => {
    try {
      console.log('Deleting silage record:', id);
      
      const { error } = await supabase
        .from('silage_inventory')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting silage record:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Silage record deleted successfully"
      });
      
      await fetchSilageData();
      return true;
    } catch (err) {
      console.error('Error deleting silage record:', err);
      toast({
        title: "Error",
        description: `Failed to delete silage record: ${err.message || "Unknown error"}`,
        variant: "destructive"
      });
      return false;
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      if (!silageData.length) {
        toast({
          title: "No Data",
          description: "No silage data available to export",
          variant: "destructive"
        });
        return;
      }
      
      // Format data for CSV
      const headers = [
        'Type', 'Amount', 'Unit', 'Production Date', 'Expiry Date', 
        'Storage Location', 'Quality', 'Ingredients', 'Expenses Incurred',
        'Person in Charge', 'Notes', 'Created At'
      ];
      
      const csvRows = [
        headers.join(',')
      ];
      
      silageData.forEach(item => {
        const row = [
          item.type,
          item.amount,
          item.unit,
          item.production_date,
          item.expiry_date || '',
          `"${item.storage_location || ''}"`,
          item.quality,
          `"${item.ingredients ? item.ingredients.join(', ') : ''}"`,
          item.expenses_incurred || '',
          `"${item.person_in_charge || ''}"`,
          `"${item.notes?.replace(/"/g, '""') || ''}"`,
          format(parseISO(item.created_at), 'yyyy-MM-dd')
        ];
        
        csvRows.push(row.join(','));
      });
      
      // Create and download CSV
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `silage_inventory_${farmId}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Silage data has been exported to CSV"
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        title: "Export Failed",
        description: `Failed to export data: ${err.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  // Set up data fetching on mount and realtime subscription
  useEffect(() => {
    if (farmId) {
      console.log(`Initializing silage inventory hook for farm: ${farmId}`);
      fetchSilageData();
      
      // Set up real-time subscription
      const subscription = supabase
        .channel(`silage-inventory-changes-${farmId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'silage_inventory',
          filter: `farm_id=eq.${farmId}`
        }, (payload) => {
          console.log('Real-time update received:', payload);
          fetchSilageData();
        })
        .subscribe();
      
      return () => {
        console.log('Cleaning up silage inventory subscription...');
        supabase.removeChannel(subscription);
      };
    }
  }, [farmId]);

  return {
    silageData,
    isLoading,
    isSubmitting,
    error,
    addSilageRecord,
    updateSilageRecord,
    deleteSilageRecord,
    refreshData: fetchSilageData,
    exportToCSV
  };
};
