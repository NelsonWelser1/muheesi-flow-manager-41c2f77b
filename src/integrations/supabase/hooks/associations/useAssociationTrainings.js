
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useToast } from '@/components/ui/use-toast';
import { fromSupabase } from '../../utils/supabaseUtils';

/**
 * Hook for managing association training sessions
 */
export const useAssociationTrainings = (associationId = null) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch trainings
  const fetchTrainings = async () => {
    try {
      setLoading(true);
      console.log('Fetching association trainings from Supabase...');
      
      let query = supabase
        .from('association_trainings')
        .select('*')
        .order('date', { ascending: true });
        
      // Filter by association_id if provided
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const data = await fromSupabase(query);
      
      console.log('Association trainings fetched successfully:', data);
      setTrainings(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching association trainings:', err);
      setError(err.message);
      toast({
        title: "Error fetching trainings",
        description: err.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new training
  const createTraining = async (trainingData) => {
    try {
      setLoading(true);
      console.log('Creating new training with data:', trainingData);
      
      const { data, error } = await supabase
        .from('association_trainings')
        .insert([trainingData])
        .select();
      
      if (error) {
        console.error('Error creating training:', error);
        setError(error.message);
        toast({
          title: "Error creating training",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Training created successfully:', data);
      
      // Update local state
      setTrainings(prev => [...prev, data[0]]);
      
      toast({
        title: "Training scheduled successfully",
        description: `"${trainingData.title}" has been scheduled for ${trainingData.date}`,
      });
      
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Unexpected error creating training:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update an existing training
  const updateTraining = async (id, updates) => {
    try {
      setLoading(true);
      console.log(`Updating training ${id} with:`, updates);
      
      const { data, error } = await supabase
        .from('association_trainings')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating training:', error);
        setError(error.message);
        toast({
          title: "Error updating training",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Training updated successfully:', data);
      
      // Update local state
      setTrainings(prev => prev.map(item => item.id === id ? data[0] : item));
      
      toast({
        title: "Training updated successfully",
        description: `${data[0].title} has been updated`,
      });
      
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Unexpected error updating training:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete a training
  const deleteTraining = async (id) => {
    try {
      setLoading(true);
      console.log(`Deleting training with ID: ${id}`);
      
      const { error } = await supabase
        .from('association_trainings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting training:', error);
        setError(error.message);
        toast({
          title: "Error deleting training",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Training deleted successfully');
      
      // Update local state
      setTrainings(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Training deleted",
        description: "The training has been successfully deleted",
      });
      
      return { success: true };
    } catch (err) {
      console.error('Unexpected error deleting training:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Enroll a member in a training
  const enrollMember = async (trainingId) => {
    try {
      const training = trainings.find(t => t.id === trainingId);
      
      if (!training) {
        throw new Error("Training not found");
      }
      
      if (training.enrolled_members >= training.max_members) {
        toast({
          title: "Enrollment failed",
          description: "This training has reached maximum capacity",
          variant: "destructive"
        });
        return { success: false, error: new Error("Maximum capacity reached") };
      }
      
      return await updateTraining(trainingId, {
        enrolled_members: training.enrolled_members + 1
      });
    } catch (err) {
      console.error('Error enrolling member:', err);
      toast({
        title: "Enrollment failed",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  // Load trainings on initial mount
  useEffect(() => {
    fetchTrainings();
  }, [associationId]);

  return {
    trainings,
    loading,
    error,
    fetchTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    enrollMember
  };
};
