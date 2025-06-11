import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const useSilageInventory = (farmId) => {
  const [silageData, setSilageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('silage_inventory')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSilageData(data || []);
    } catch (err) {
      console.error('Error fetching silage data:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load silage inventory data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSilageRecord = async (record) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('silage_inventory')
        .insert([{
          farm_id: farmId,
          type: record.type,
          amount: record.amount,
          unit: record.unit,
          production_date: record.productionDate,
          expiry_date: record.expiryDate || null,
          storage_location: record.storageLocation || null,
          quality: record.quality,
          notes: record.notes || null,
          ingredients: record.ingredients || [],
          expenses_incurred: record.expensesIncurred || null,
          person_in_charge: record.personInCharge || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Silage record has been added",
        variant: "default"
      });
      
      // Refresh the data to include the new record
      refreshData();
      return true;
    } catch (err) {
      console.error('Error adding silage record:', err);
      toast({
        title: "Error",
        description: `Failed to add silage record: ${err.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSilageRecord = async (id, record) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('silage_inventory')
        .update({
          type: record.type,
          amount: record.amount,
          unit: record.unit,
          production_date: record.productionDate,
          expiry_date: record.expiryDate || null,
          storage_location: record.storageLocation || null,
          quality: record.quality,
          notes: record.notes || null,
          ingredients: record.ingredients || [],
          expenses_incurred: record.expensesIncurred || null,
          person_in_charge: record.personInCharge || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('farm_id', farmId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Silage record has been updated",
        variant: "default"
      });
      
      // Refresh the data to include the updated record
      refreshData();
      return true;
    } catch (err) {
      console.error('Error updating silage record:', err);
      toast({
        title: "Error",
        description: `Failed to update silage record: ${err.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSilageRecord = async (id) => {
    try {
      const { error } = await supabase
        .from('silage_inventory')
        .delete()
        .eq('id', id)
        .eq('farm_id', farmId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Silage record has been deleted",
        variant: "default"
      });
      
      // Update the local state without making another API call
      setSilageData(silageData.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting silage record:', err);
      toast({
        title: "Error",
        description: `Failed to delete silage record: ${err.message}`,
        variant: "destructive"
      });
      return false;
    }
  };

  const exportToCSV = () => {
    try {
      // Convert data to CSV
      const headers = ['Type', 'Amount', 'Unit', 'Production Date', 'Expiry Date', 'Location', 'Quality', 'Ingredients', 'Notes'];
      const csvRows = [headers];
      
      silageData.forEach(item => {
        const row = [
          item.type,
          item.amount,
          item.unit,
          item.production_date,
          item.expiry_date || '',
          item.storage_location || '',
          item.quality,
          Array.isArray(item.ingredients) ? item.ingredients.join(', ') : '',
          item.notes || ''
        ];
        csvRows.push(row);
      });
      
      const csvData = csvRows.map(row => row.join(',')).join('\n');
      
      // Create and download the CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `silage_inventory_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: "Silage inventory data has been exported to CSV",
        variant: "default"
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        title: "Export Failed",
        description: "Could not export silage inventory data",
        variant: "destructive"
      });
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    if (farmId) {
      refreshData();
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
    refreshData,
    exportToCSV
  };
};
