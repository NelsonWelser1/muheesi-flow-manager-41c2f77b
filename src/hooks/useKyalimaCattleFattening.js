
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, differenceInDays } from 'date-fns';

export const useKyalimaCattleFattening = () => {
  const [fatteningData, setFatteningData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalActive: 0,
    averageDailyGain: 0,
    averageProgress: 0,
    feedConsumption: 0,
    breedDistribution: [],
    weightGainByBreed: []
  });
  const { toast } = useToast();

  // Fetch data
  const fetchFatteningData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cattle_fattening')
        .select('*')
        .eq('farm_id', 'kyalima')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      
      setFatteningData(data || []);
      calculateAnalytics(data || []);
    } catch (err) {
      console.error('Error fetching fattening data:', err);
      toast({
        title: "Error",
        description: "Failed to load cattle fattening data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate analytics from data
  const calculateAnalytics = (data) => {
    if (!data.length) return;

    const activePrograms = data.filter(item => item.status === 'active');
    const totalActive = activePrograms.length;
    
    // Calculate average daily gain
    let totalDailyGain = 0;
    let validDailyGainCount = 0;
    
    activePrograms.forEach(program => {
      if (program.daily_gain && program.daily_gain > 0) {
        totalDailyGain += Number(program.daily_gain);
        validDailyGainCount++;
      }
    });
    
    const averageDailyGain = validDailyGainCount > 0 ? totalDailyGain / validDailyGainCount : 0;
    
    // Calculate average progress to target weights
    let totalProgressPercentage = 0;
    activePrograms.forEach(program => {
      if (program.current_weight && program.target_weight) {
        const progress = (Number(program.current_weight) / Number(program.target_weight)) * 100;
        totalProgressPercentage += progress;
      }
    });
    
    const averageProgress = activePrograms.length > 0 ? totalProgressPercentage / activePrograms.length : 0;
    
    // Feed consumption (sample calculation - this would normally come from actual feed records)
    const feedConsumption = totalActive * (6 + Math.random() * 2); // Average kg per animal per day * number of animals * 30 days
    const monthlyFeedConsumption = feedConsumption * 30;
    
    // Calculate breed distribution
    const breedCounts = {};
    activePrograms.forEach(program => {
      breedCounts[program.breed] = (breedCounts[program.breed] || 0) + 1;
    });
    
    const breedDistribution = Object.entries(breedCounts).map(([breed, count]) => ({
      breed,
      count,
      percentage: (count / totalActive) * 100
    }));
    
    // Calculate weight gain by breed
    const weightGainByBreed = {};
    activePrograms.forEach(program => {
      if (!weightGainByBreed[program.breed]) {
        weightGainByBreed[program.breed] = { 
          totalGain: 0, 
          count: 0,
          averageGain: 0
        };
      }
      
      if (program.current_weight && program.entry_weight) {
        weightGainByBreed[program.breed].totalGain += (Number(program.current_weight) - Number(program.entry_weight));
        weightGainByBreed[program.breed].count += 1;
      }
    });
    
    Object.keys(weightGainByBreed).forEach(breed => {
      const { totalGain, count } = weightGainByBreed[breed];
      weightGainByBreed[breed].averageGain = count > 0 ? totalGain / count : 0;
    });
    
    const weightGainData = Object.entries(weightGainByBreed).map(([breed, data]) => ({
      breed,
      averageGain: data.averageGain,
      count: data.count
    }));
    
    setAnalytics({
      totalActive,
      averageDailyGain,
      averageProgress,
      feedConsumption: Math.round(monthlyFeedConsumption / 4), // Weekly average
      breedDistribution,
      weightGainByBreed: weightGainData
    });
  };

  // Add new fattening program
  const addFatteningProgram = async (programData) => {
    setIsSubmitting(true);
    try {
      // Check if tag_number already exists
      const { data: existingTag, error: tagError } = await supabase
        .from('cattle_fattening')
        .select('id')
        .eq('tag_number', programData.tag_number)
        .eq('farm_id', 'kyalima')
        .eq('status', 'active')
        .single();

      if (tagError && tagError.code !== 'PGRST116') {
        throw tagError;
      }

      if (existingTag) {
        toast({
          title: "Duplicate Tag",
          description: "This tag number already exists in the fattening program",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return false;
      }

      // Calculate daily gain
      const entryDate = new Date(programData.entry_date);
      const today = new Date();
      const daysDiff = differenceInDays(today, entryDate);
      
      const dailyGain = daysDiff > 0 
        ? (programData.current_weight - programData.entry_weight) / daysDiff 
        : null;
        
      // Calculate expected completion date based on current gain rate
      let expectedCompletionDate = null;
      if (dailyGain && dailyGain > 0) {
        const remainingGain = programData.target_weight - programData.current_weight;
        const daysToTarget = Math.ceil(remainingGain / dailyGain);
        expectedCompletionDate = format(addDays(today, daysToTarget), 'yyyy-MM-dd');
      }

      const newProgram = {
        ...programData,
        farm_id: 'kyalima',
        daily_gain: dailyGain,
        expected_completion_date: expectedCompletionDate
      };

      const { data, error } = await supabase
        .from('cattle_fattening')
        .insert([newProgram])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Cattle added to fattening program successfully",
      });
      
      fetchFatteningData();
      return true;
    } catch (err) {
      console.error('Error adding fattening program:', err);
      toast({
        title: "Error",
        description: "Failed to add to fattening program: " + err.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update fattening program
  const updateFatteningProgram = async (id, updatedData) => {
    setIsSubmitting(true);
    try {
      // Get current data
      const { data: currentData, error: fetchError } = await supabase
        .from('cattle_fattening')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Calculate new daily gain if weight changed
      let dailyGain = currentData.daily_gain;
      let expectedCompletionDate = currentData.expected_completion_date;
      
      if (updatedData.current_weight && updatedData.current_weight !== currentData.current_weight) {
        const entryDate = new Date(currentData.entry_date);
        const today = new Date();
        const daysDiff = differenceInDays(today, entryDate);
        
        if (daysDiff > 0) {
          dailyGain = (updatedData.current_weight - currentData.entry_weight) / daysDiff;
          
          // Update expected completion date
          if (dailyGain > 0) {
            const remainingGain = currentData.target_weight - updatedData.current_weight;
            const daysToTarget = Math.ceil(remainingGain / dailyGain);
            expectedCompletionDate = format(addDays(today, daysToTarget), 'yyyy-MM-dd');
          }
        }
      }

      const dataToUpdate = {
        ...updatedData,
        daily_gain: dailyGain,
        expected_completion_date: expectedCompletionDate,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('cattle_fattening')
        .update(dataToUpdate)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fattening program updated successfully",
      });
      
      fetchFatteningData();
      return true;
    } catch (err) {
      console.error('Error updating fattening program:', err);
      toast({
        title: "Error",
        description: "Failed to update fattening program: " + err.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete fattening program record
  const deleteFatteningProgram = async (id) => {
    try {
      const { error } = await supabase
        .from('cattle_fattening')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fattening program record deleted successfully"
      });
      
      fetchFatteningData();
      return true;
    } catch (err) {
      console.error('Error deleting fattening program:', err);
      toast({
        title: "Error",
        description: "Failed to delete record: " + err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Complete fattening program (mark as sold or transferred)
  const completeFatteningProgram = async (id, status, notes) => {
    try {
      const { error } = await supabase
        .from('cattle_fattening')
        .update({ 
          status, 
          notes: notes || undefined,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Cattle marked as ${status} successfully`
      });
      
      fetchFatteningData();
      return true;
    } catch (err) {
      console.error('Error completing fattening program:', err);
      toast({
        title: "Error",
        description: "Failed to update status: " + err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      if (!fatteningData.length) {
        toast({
          title: "No Data",
          description: "No fattening program data available to export",
          variant: "destructive"
        });
        return;
      }
      
      // Format data for CSV
      const headers = [
        'Tag Number', 'Name', 'Breed', 'DOB', 'Entry Date', 'Entry Weight (kg)', 
        'Current Weight (kg)', 'Target Weight (kg)', 'Daily Gain (kg)', 
        'Expected Completion', 'Feeding Regime', 'Status', 'Notes'
      ];
      
      const csvRows = [
        headers.join(',')
      ];
      
      fatteningData.forEach(item => {
        const row = [
          item.tag_number,
          `"${item.name || ''}"`,
          item.breed,
          item.date_of_birth || '',
          item.entry_date,
          item.entry_weight,
          item.current_weight,
          item.target_weight,
          item.daily_gain?.toFixed(2) || '',
          item.expected_completion_date || '',
          item.feeding_regime,
          item.status,
          `"${item.notes?.replace(/"/g, '""') || ''}"`
        ];
        
        csvRows.push(row.join(','));
      });
      
      // Create and download CSV
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `cattle_fattening_kyalima_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Complete",
        description: "Fattening program data has been exported to CSV"
      });
    } catch (err) {
      console.error('Error exporting to CSV:', err);
      toast({
        title: "Export Failed",
        description: "Failed to export data: " + err.message,
        variant: "destructive"
      });
    }
  };

  // Set up data fetching on mount
  useEffect(() => {
    fetchFatteningData();
  }, []);

  return {
    fatteningData,
    isLoading,
    isSubmitting,
    analytics,
    addFatteningProgram,
    updateFatteningProgram,
    deleteFatteningProgram,
    completeFatteningProgram,
    refreshData: fetchFatteningData,
    exportToCSV
  };
};
