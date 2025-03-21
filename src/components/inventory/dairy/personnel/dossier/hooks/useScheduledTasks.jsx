
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useScheduledTasks = (employeeId = null) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch tasks for a specific employee or all tasks if no employeeId provided
  const fetchTasks = async (employeeIdToFetch = employeeId) => {
    if (!employeeIdToFetch) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build the query
      let query = supabase
        .from('personnel_scheduled_tasks')
        .select('*');
      
      // If an employee ID is provided, filter by it
      if (employeeIdToFetch) {
        query = query.eq('employee_id', employeeIdToFetch);
      }
      
      // Execute the query
      const { data, error: fetchError } = await query
        .order('scheduled_date', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to fetch tasks: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new task
  const saveTask = async (taskData) => {
    if (!taskData.employee_id) {
      toast({
        title: "Employee Required",
        description: "Please select an employee for this task.",
        variant: "destructive",
      });
      return null;
    }
    
    if (!taskData.scheduled_date) {
      toast({
        title: "Date Required",
        description: "Please select a date for this task.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      // Format the data for insertion
      const newTask = {
        employee_id: taskData.employee_id,
        task_type: taskData.task_type || 'Other',
        scheduled_date: taskData.scheduled_date,
        scheduled_time: taskData.time || null,
        location: taskData.location || null,
        assigned_to: taskData.assigned_to || null,
        notes: taskData.notes || null,
        completed: false,
        // Note: created_by is null since we're not using authentication currently
      };
      
      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('personnel_scheduled_tasks')
        .insert([newTask])
        .select();
      
      if (insertError) throw insertError;
      
      // Success! 
      toast({
        title: "Task Scheduled",
        description: "Successfully scheduled new task.",
      });
      
      // Refresh the task list
      await fetchTasks(taskData.employee_id);
      
      return data?.[0] || null;
    } catch (err) {
      console.error('Error saving task:', err);
      toast({
        title: "Error",
        description: `Failed to schedule task: ${err.message}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('personnel_scheduled_tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      ));
      
      toast({
        title: currentStatus ? "Task Marked Incomplete" : "Task Marked Complete",
        description: currentStatus 
          ? "Task has been marked as incomplete." 
          : "Task has been marked as complete.",
      });
    } catch (err) {
      console.error('Error toggling task completion:', err);
      toast({
        title: "Error",
        description: `Failed to update task: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('personnel_scheduled_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update local state to remove the deleted task
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted.",
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      toast({
        title: "Error",
        description: `Failed to delete task: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load tasks when employeeId changes
  useEffect(() => {
    if (employeeId) {
      fetchTasks(employeeId);
    }
  }, [employeeId]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    saveTask,
    toggleTaskCompletion,
    deleteTask
  };
};
