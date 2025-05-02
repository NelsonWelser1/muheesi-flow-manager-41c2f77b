
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
import { Plus, Clock, X, Save } from 'lucide-react';
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

const NewTaskDialog = ({ onTaskCreate }) => {
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
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title is required");
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
      resetForm();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(`Failed to create task: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    );
  }

  return (
    <div className="w-full bg-background rounded-lg shadow-sm border p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create New Task</h3>
        <Button variant="ghost" size="icon" onClick={resetForm}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-24"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TaskPriorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {TaskStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <DatePicker
                date={formData.due_date}
                setDate={(date) => setFormData({ ...formData, due_date: date })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reminderTime">Reminder Time</Label>
              <div className="relative">
                <Input
                  id="reminderTime"
                  type="time"
                  value={formData.reminder_time}
                  onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                  className="pl-9"
                />
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              placeholder="Enter assignee name"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={resetForm} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
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
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskDialog;
