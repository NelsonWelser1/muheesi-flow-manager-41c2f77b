
import React from 'react';
import { format, isPast, isFuture } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, Clock, MoreHorizontal, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const [taskToDelete, setTaskToDelete] = React.useState(null);

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await onUpdateTask(taskId, { status: newStatus });
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'postponed':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getDueDateClass = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && date.toDateString() !== new Date().toDateString()) {
      return 'text-red-600';
    }
    if (date.toDateString() === new Date().toDateString()) {
      return 'text-amber-600 font-medium';
    }
    return 'text-gray-500';
  };

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`overflow-hidden border-l-4 ${task.status === 'completed' ? 'border-l-emerald-500' : task.priority === 'high' ? 'border-l-red-500' : task.priority === 'medium' ? 'border-l-amber-500' : 'border-l-green-500'}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-4">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <Badge className={getPriorityClass(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Badge className={getStatusClass(task.status)}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                      </Badge>
                      {task.assignedTo && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`font-medium text-lg mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    
                    <div className="flex items-center text-xs space-x-4 mt-2">
                      <div className={`flex items-center ${getDueDateClass(task.dueDate)}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                      </div>
                      
                      <span className="text-gray-400 text-xs">
                        Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 p-4 bg-gray-50 md:bg-transparent">
                    {task.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                        onClick={() => handleStatusChange(task.id, 'completed')}
                      >
                        <Check className="h-4 w-4 mr-1" /> Complete
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {task.status === 'completed' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'pending')}>
                            Mark as Pending
                          </DropdownMenuItem>
                        ) : (
                          <>
                            {task.status !== 'in-progress' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                                Mark as In Progress
                              </DropdownMenuItem>
                            )}
                            {task.status !== 'postponed' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'postponed')}>
                                Mark as Postponed
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(task)}
                        >
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{taskToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
