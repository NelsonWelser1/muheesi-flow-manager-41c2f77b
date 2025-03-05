
/**
 * Livestock Management Data Hook
 * 
 * This hook manages the state and data operations for the Livestock Management feature.
 * 
 * Flow:
 * 1. On component mount, it checks if the livestock table exists and creates it if needed
 * 2. It then fetches all livestock records from Supabase
 * 3. Provides functions for CRUD operations (create, read, update, delete)
 * 4. Handles form state for adding/editing livestock records
 * 
 * Debugging:
 * - Console logs are added throughout to track data flow
 * - The debugForm() function can be called to print current form values
 * - Authentication is temporarily disabled (permissive RLS policies)
 * 
 * Form submission:
 * - Form data is validated using Zod schema
 * - On submit, data is sent to Supabase via the useFormSubmit hook
 * - Success/error toasts provide feedback to the user
 * 
 * Database Schema:
 * - animal_id: TEXT - Unique identifier for the animal
 * - species: TEXT - Type of animal (cow, goat, etc)
 * - breed: TEXT - Specific breed
 * - age: TEXT - Age in months
 * - health_status: TEXT - Current health condition
 * - notes: TEXT - Optional additional information
 */

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  animal_id: z.string().min(1, { message: "Animal ID is required" }),
  species: z.string().min(1, { message: "Species is required" }),
  breed: z.string().min(1, { message: "Breed is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  health_status: z.string().min(1, { message: "Health status is required" }),
  notes: z.string().optional(),
});

export const useLivestockData = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animal_id: "",
      species: "",
      breed: "",
      age: "",
      health_status: "",
      notes: "",
    },
  });

  const fetchAnimals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      console.error('Error fetching livestock:', error);
      toast.error('Failed to load livestock data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Create livestock table if it doesn't exist
    const createLivestockTable = async () => {
      try {
        // Check if table exists first
        const { error: checkError } = await supabase
          .from('livestock')
          .select('count(*)')
          .limit(1);
        
        if (checkError && checkError.code === '42P01') {
          // Table doesn't exist, create it
          const { error: createError } = await supabase.rpc('create_livestock_table');
          if (createError) throw createError;
          console.log('Livestock table created successfully');
        }
        
        fetchAnimals();
      } catch (error) {
        console.error('Error setting up livestock table:', error);
        toast.error('Failed to initialize livestock table');
        setIsLoading(false);
      }
    };
    
    createLivestockTable();
  }, []);

  const handleEdit = (animal) => {
    setIsEditing(true);
    setEditingId(animal.id);
    
    form.reset({
      id: animal.id,
      animal_id: animal.animal_id,
      species: animal.species,
      breed: animal.breed,
      age: animal.age,
      health_status: animal.health_status,
      notes: animal.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        const { error } = await supabase
          .from('livestock')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Livestock record deleted successfully');
        fetchAnimals();
      } catch (error) {
        console.error('Error deleting livestock:', error);
        toast.error('Failed to delete record');
      }
    }
  };

  const resetForm = () => {
    form.reset({
      animal_id: "",
      species: "",
      breed: "",
      age: "",
      health_status: "",
      notes: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return {
    animals,
    isLoading,
    isEditing,
    editingId,
    form,
    fetchAnimals,
    handleEdit,
    handleDelete,
    resetForm
  };
};
