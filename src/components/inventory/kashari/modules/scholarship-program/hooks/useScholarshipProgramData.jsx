
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";

// Define schema for form validation
const formSchema = z.object({
  student_name: z.string().min(1, { message: "Student name is required" }),
  student_id: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.date().nullable(),
  school_name: z.string().min(1, { message: "School name is required" }),
  education_level: z.string().min(1, { message: "Education level is required" }),
  scholarship_type: z.string().min(1, { message: "Scholarship type is required" }),
  scholarship_amount: z.string().min(1, { message: "Scholarship amount is required" }),
  start_date: z.date(),
  end_date: z.date().nullable(),
  status: z.string().default("Active"),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  notes: z.string().optional(),
});

export const useScholarshipProgramData = () => {
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_name: '',
      student_id: '',
      gender: '',
      date_of_birth: null,
      school_name: '',
      education_level: '',
      scholarship_type: '',
      scholarship_amount: '',
      start_date: new Date(),
      end_date: null,
      status: 'Active',
      contact_person: '',
      contact_phone: '',
      notes: '',
    },
  });

  // Fetch scholarship program records from Supabase
  const fetchScholarships = async () => {
    console.log('Fetching scholarship program records...');
    setIsLoading(true);
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('scholarship_program')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Table does not exist, creating scholarship_program table...');
        const { error: createError } = await supabase.rpc('create_scholarship_program_table');
        if (createError) throw createError;
        console.log('Scholarship program table created successfully');
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('scholarship_program')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      console.log('Scholarship program records fetched:', data);
      setScholarships(data || []);
    } catch (error) {
      console.error('Error fetching scholarship program records:', error);
      toast.error('Failed to load scholarship program data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchScholarships();
  }, []);

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log('Submitting scholarship program data:', data);
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const submissionData = {
        student_name: data.student_name,
        student_id: data.student_id || null,
        gender: data.gender || null,
        date_of_birth: data.date_of_birth,
        school_name: data.school_name,
        education_level: data.education_level,
        scholarship_type: data.scholarship_type,
        scholarship_amount: parseFloat(data.scholarship_amount),
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        contact_person: data.contact_person || null,
        contact_phone: data.contact_phone || null,
        notes: data.notes || null,
      };

      if (editingScholarship) {
        // Update existing record
        const { error } = await supabase
          .from('scholarship_program')
          .update(submissionData)
          .eq('id', editingScholarship.id);
        
        if (error) throw error;
        toast.success('Scholarship record updated successfully');
        setEditingScholarship(null);
      } else {
        // Insert new record
        const { error } = await supabase
          .from('scholarship_program')
          .insert([submissionData]);
        
        if (error) throw error;
        toast.success('Scholarship record added successfully');
      }
      
      // Reset form
      form.reset({
        student_name: '',
        student_id: '',
        gender: '',
        date_of_birth: null,
        school_name: '',
        education_level: '',
        scholarship_type: '',
        scholarship_amount: '',
        start_date: new Date(),
        end_date: null,
        status: 'Active',
        contact_person: '',
        contact_phone: '',
        notes: '',
      });
      
      // Refresh data
      fetchScholarships();
    } catch (error) {
      console.error('Error saving scholarship record:', error);
      toast.error('Failed to save scholarship record');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit operation
  const handleEdit = (scholarship) => {
    console.log('Editing scholarship:', scholarship);
    setEditingScholarship(scholarship);
    
    form.reset({
      student_name: scholarship.student_name,
      student_id: scholarship.student_id || '',
      gender: scholarship.gender || '',
      date_of_birth: scholarship.date_of_birth ? new Date(scholarship.date_of_birth) : null,
      school_name: scholarship.school_name,
      education_level: scholarship.education_level,
      scholarship_type: scholarship.scholarship_type,
      scholarship_amount: String(scholarship.scholarship_amount),
      start_date: new Date(scholarship.start_date),
      end_date: scholarship.end_date ? new Date(scholarship.end_date) : null,
      status: scholarship.status,
      contact_person: scholarship.contact_person || '',
      contact_phone: scholarship.contact_phone || '',
      notes: scholarship.notes || '',
    });
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this scholarship record?')) {
      try {
        const { error } = await supabase
          .from('scholarship_program')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Scholarship record deleted successfully');
        fetchScholarships();
      } catch (error) {
        console.error('Error deleting scholarship record:', error);
        toast.error('Failed to delete scholarship record');
      }
    }
  };

  // Debug function to log current form state
  const debugForm = () => {
    const formValues = form.getValues();
    console.log('Current form state:', formValues);
    return formValues;
  };

  // Calculate summary statistics
  const getScholarshipSummary = () => {
    const totalAmount = scholarships.reduce((sum, s) => sum + s.scholarship_amount, 0);
    const activeScholarships = scholarships.filter(s => s.status === 'Active').length;
    const completedScholarships = scholarships.filter(s => s.status === 'Completed').length;
    const scholarshipsByLevel = {};
    const scholarshipsByType = {};
    
    scholarships.forEach(s => {
      // Count by education level
      if (!scholarshipsByLevel[s.education_level]) {
        scholarshipsByLevel[s.education_level] = 0;
      }
      scholarshipsByLevel[s.education_level]++;
      
      // Count by scholarship type
      if (!scholarshipsByType[s.scholarship_type]) {
        scholarshipsByType[s.scholarship_type] = 0;
      }
      scholarshipsByType[s.scholarship_type]++;
    });
    
    return {
      totalAmount,
      activeScholarships,
      completedScholarships,
      totalScholarships: scholarships.length,
      scholarshipsByLevel,
      scholarshipsByType
    };
  };

  return {
    scholarships,
    isLoading,
    isSubmitting,
    form,
    handleSubmit,
    handleEdit,
    handleDelete,
    fetchScholarships,
    debugForm,
    editingScholarship,
    setEditingScholarship,
    getScholarshipSummary
  };
};
