
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from 'date-fns';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (fetchError) throw new Error(fetchError.message);
      
      // Format dates and normalize field names for frontend use
      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.due_date,
        reminderTime: task.reminder_time || null,
        assignedTo: task.assigned_to || '',
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
      
      setTasks(formattedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      toast({
        title: "Failed to load tasks",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    try {
      // Prepare data for Supabase (convert frontend field names to DB column names)
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        due_date: format(taskData.dueDate, 'yyyy-MM-dd'),
        reminder_time: taskData.reminderTime,
        assigned_to: taskData.assignedTo,
      };

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([newTask])
        .select();

      if (insertError) throw new Error(insertError.message);
      
      // Format the returned task
      const createdTask = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description || '',
        priority: data[0].priority,
        status: data[0].status,
        dueDate: data[0].due_date,
        reminderTime: data[0].reminder_time || null,
        assignedTo: data[0].assigned_to || '',
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      };
      
      // Update local state
      setTasks(current => [createdTask, ...current]);
      
      toast({
        title: "Task created",
        description: "Your task was created successfully",
      });
      
      return createdTask;
    } catch (err) {
      console.error('Error creating task:', err);
      toast({
        title: "Failed to create task",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update an existing task
  const updateTask = async (id, taskData) => {
    try {
      // Prepare data for Supabase
      const updates = {};
      if (taskData.title !== undefined) updates.title = taskData.title;
      if (taskData.description !== undefined) updates.description = taskData.description;
      if (taskData.priority !== undefined) updates.priority = taskData.priority;
      if (taskData.status !== undefined) updates.status = taskData.status;
      if (taskData.dueDate !== undefined) updates.due_date = format(taskData.dueDate, 'yyyy-MM-dd');
      if (taskData.reminderTime !== undefined) updates.reminder_time = taskData.reminderTime;
      if (taskData.assignedTo !== undefined) updates.assigned_to = taskData.assignedTo;
      
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();

      if (updateError) throw new Error(updateError.message);
      
      // Format the returned task
      const updatedTask = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description || '',
        priority: data[0].priority,
        status: data[0].status,
        dueDate: data[0].due_date,
        reminderTime: data[0].reminder_time || null,
        assignedTo: data[0].assigned_to || '',
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      };
      
      // Update local state
      setTasks(current => 
        current.map(task => task.id === id ? updatedTask : task)
      );
      
      toast({
        title: "Task updated",
        description: "Your task was updated successfully",
      });
      
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      toast({
        title: "Failed to update task",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) throw new Error(deleteError.message);
      
      // Update local state
      setTasks(current => current.filter(task => task.id !== id));
      
      toast({
        title: "Task deleted",
        description: "Your task was deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      toast({
        title: "Failed to delete task",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Load tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}
