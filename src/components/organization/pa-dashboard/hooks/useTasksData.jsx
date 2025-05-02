
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useTasksData = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch all tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

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

  // Function to add a new task
  const addTask = async (taskData) => {
    try {
      // Validate required fields
      if (!taskData.title) {
        throw new Error("Task title is required");
      }
      
      if (!taskData.due_date) {
        throw new Error("Due date is required");
      }

      // Insert task into Supabase
      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (insertError) throw insertError;

      // Update local state with the new task
      const newTask = data[0];
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      toast({
        title: "Error",
        description: `Failed to add task: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Function to update a task
  const updateTask = async (taskId, updatedData) => {
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updatedData)
        .eq('id', taskId)
        .select();
        
      if (updateError) throw updateError;
      
      // Update the task in local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedData } : task))
      );
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      
      return data[0];
    } catch (err) {
      console.error('Error updating task:', err);
      toast({
        title: "Error",
        description: `Failed to update task: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (deleteError) throw deleteError;
      
      // Remove the task from local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      toast({
        title: "Error",
        description: `Failed to delete task: ${err.message}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
};
