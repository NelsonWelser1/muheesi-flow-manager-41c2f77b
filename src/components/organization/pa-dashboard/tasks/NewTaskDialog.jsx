
import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Clock, X, Save, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/supabase";
import { useTasksData } from '../hooks/useTasksData';

const TaskPriorityOptions = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const TaskStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "postponed", label: "Postponed" },
];

const NewTaskDialog = ({ onTaskCreate, isSlideOver = false }) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTask } = useTasksData();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: new Date(),
    assigned_to: "",
    reminder_time: "",
  });
  
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      due_date: new Date(),
      assigned_to: "",
      reminder_time: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date and time for Supabase
      const taskData = {
        ...formData,
        due_date: format(formData.due_date, 'yyyy-MM-dd'),
      };
      
      const result = await addTask(taskData);
      
      // Call onTaskCreate callback if provided (for local state update)
      if (onTaskCreate) {
        onTaskCreate(result);
      }
      
      toast.success("Task created successfully");
      
      // Only reset the form if not in slide-over mode
      if (!isSlideOver) {
        resetForm();
      } else {
        // Just clear the form without hiding it for slide-over mode
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          status: "pending",
          due_date: new Date(),
          assigned_to: "",
          reminder_time: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(`Failed to create task: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If in slide-over mode, always show the form
  useEffect(() => {
    if (isSlideOver) {
      setShowForm(true);
    }
  }, [isSlideOver]);

  if (!showForm && !isSlideOver) {
    return (
      <Button 
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
      >
        <Plus className="h-4 w-4" />
        New Task
      </Button>
    );
  }

  // Different styling based on whether it's a slide-over or not
  const formClassName = isSlideOver 
    ? "w-full space-y-4" 
    : "w-full bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4 animate-fade-in";

  return (
    <div className={formClassName}>
      {!isSlideOver && (
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center">
            <div className="h-6 w-1.5 bg-blue-500 rounded mr-3"></div>
            Create New Task
          </h3>
          <Button variant="ghost" size="icon" onClick={resetForm} className="rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-slate-700 font-medium">
              Task Title {errors.title && <span className="text-red-500 text-sm ml-1">*</span>}
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`rounded-lg border ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:border-blue-400 focus-visible:ring-blue-400`}
            />
            {errors.title && (
              <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-24 rounded-lg border-slate-200 focus:border-blue-400 focus-visible:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label className="text-slate-700 font-medium">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="rounded-lg border-slate-200 bg-white hover:bg-slate-50 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                  {TaskPriorityOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className={`rounded ${
                        option.value === 'high' ? 'hover:bg-red-50' : 
                        option.value === 'medium' ? 'hover:bg-yellow-50' : 
                        'hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            option.value === 'high' ? 'bg-red-500' : 
                            option.value === 'medium' ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                        ></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-700 font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="rounded-lg border-slate-200 bg-white hover:bg-slate-50 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200 shadow-lg">
                  {TaskStatusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className={`rounded ${
                        option.value === 'pending' ? 'hover:bg-slate-50' : 
                        option.value === 'in-progress' ? 'hover:bg-blue-50' : 
                        option.value === 'completed' ? 'hover:bg-green-50' : 
                        'hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            option.value === 'pending' ? 'bg-slate-500' : 
                            option.value === 'in-progress' ? 'bg-blue-500' : 
                            option.value === 'completed' ? 'bg-green-500' : 
                            'bg-orange-500'
                          }`}
                        ></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label className={`text-slate-700 font-medium ${errors.due_date ? 'text-red-500' : ''}`}>
                Due Date {errors.due_date && <span className="text-red-500 text-sm ml-1">*</span>}
              </Label>
              <div className={`border rounded-lg ${errors.due_date ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                <DatePicker
                  date={formData.due_date}
                  setDate={(date) => setFormData({ ...formData, due_date: date })}
                  className="w-full"
                />
              </div>
              {errors.due_date && (
                <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.due_date}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reminderTime" className="text-slate-700 font-medium">Reminder Time</Label>
              <div className="relative">
                <Input
                  id="reminderTime"
                  type="time"
                  value={formData.reminder_time}
                  onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                  className="pl-9 rounded-lg border-slate-200 focus:border-blue-400 focus-visible:ring-blue-400"
                />
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedTo" className="text-slate-700 font-medium">Assigned To</Label>
            <Input
              id="assignedTo"
              placeholder="Enter assignee name"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              className="rounded-lg border-slate-200 focus:border-blue-400 focus-visible:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          {!isSlideOver && (
            <Button 
              variant="outline" 
              type="button" 
              onClick={resetForm} 
              disabled={isSubmitting}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isSlideOver ? 'Add Task' : 'Create Task'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskDialog;
