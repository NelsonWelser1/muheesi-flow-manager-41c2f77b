
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Save, User, Clock, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { useQuery } from '@tanstack/react-query';
import { useScheduledTasks } from './hooks/useScheduledTasks';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const TASK_TYPES = [
  "Performance Review",
  "Training Session",
  "Contract Renewal",
  "Leave",
  "Disciplinary Meeting",
  "Other"
];

const DossierScheduler = ({ dossier, onBack }) => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState(dossier?.employee_id || '');
  const [formData, setFormData] = useState({
    task_type: TASK_TYPES[0],
    scheduled_date: '',
    time: '',
    location: '',
    assigned_to: '',
    notes: '',
  });

  // Use our custom hook to manage scheduled tasks
  const { 
    tasks: scheduledTasks, 
    isLoading, 
    saveTask, 
    toggleTaskCompletion,
    deleteTask 
  } = useScheduledTasks(selectedEmployee);

  // Fetch employees for dropdown if no specific dossier provided
  const { data: employees = [] } = useQuery({
    queryKey: ['employeesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .select('id, employee_id')
        .order('employee_id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !dossier
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For debugging: log the form data to console
    console.log("Submitting task data:", {
      employee_id: selectedEmployee,
      ...formData
    });
    
    // Save the task using our hook
    saveTask({
      employee_id: selectedEmployee,
      ...formData
    });
    
    // Reset form after successful submission
    setFormData({
      task_type: TASK_TYPES[0],
      scheduled_date: '',
      time: '',
      location: '',
      assigned_to: '',
      notes: '',
    });
  };

  const handleTaskDelete = (taskId) => {
    deleteTask(taskId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Schedule Tasks</h2>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !selectedEmployee}
          className="flex items-center gap-1"
        >
          <Save className="h-4 w-4" /> Save Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Employee</CardTitle>
        </CardHeader>
        <CardContent>
          {dossier ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">{dossier.employee_id}</p>
                <p className="text-sm text-gray-500">{dossier.job_title}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.employee_id}>
                      {emp.employee_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Task Type</Label>
                <Select 
                  value={formData.task_type}
                  onValueChange={(value) => handleInputChange('task_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={formData.scheduled_date}
                    onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  placeholder="Enter location (e.g., Meeting Room, Online)"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Input 
                  placeholder="Enter name of person responsible"
                  value={formData.assigned_to}
                  onChange={(e) => handleInputChange('assigned_to', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  placeholder="Enter any additional details or instructions"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scheduled Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading scheduled tasks...</p>
              </div>
            ) : !selectedEmployee ? (
              <div className="text-center py-8 text-gray-500">
                <p>Select an employee to view scheduled tasks.</p>
              </div>
            ) : scheduledTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No tasks scheduled for this employee.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-md border flex items-start gap-3 ${
                      task.completed ? 'bg-green-50 border-green-200' : 
                      new Date(task.scheduled_date) < new Date() ? 'bg-yellow-50 border-yellow-200' : 
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <button 
                      onClick={() => toggleTaskCompletion(task.id, task.completed)} 
                      className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
                        task.completed ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'border-gray-300'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3 text-white" />}
                    </button>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.task_type}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.scheduled_time || 'Any time'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(task.scheduled_date).toLocaleDateString()}</span>
                      </div>
                      
                      {task.location && (
                        <p className="text-sm text-gray-600 mb-1">
                          Location: {task.location}
                        </p>
                      )}
                      
                      {task.assigned_to && (
                        <p className="text-sm text-gray-600 mb-1">
                          Assigned to: {task.assigned_to}
                        </p>
                      )}
                      
                      {task.notes && (
                        <p className="text-sm italic text-gray-500 mt-2">
                          {task.notes}
                        </p>
                      )}
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this task? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleTaskDelete(task.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DossierScheduler;
