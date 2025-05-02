
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MoreHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const TaskList = ({ tasks, handleCompleteTask, handleDeleteTask, getPriorityClass, getStatusClass }) => {
  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const renderEmptyState = () => (
    <Card className="text-center p-10">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="rounded-full bg-muted p-4">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">No tasks yet</h3>
          <p className="text-muted-foreground">Create your first task to get started.</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderTaskCard = (task) => (
    <motion.div 
      key={task.id}
      variants={itemVariants}
      initial="hidden" 
      animate="show"
    >
      <Card className="mb-3 hover:shadow-md transition-shadow overflow-hidden border-l-4" style={{ borderLeftColor: getPriorityColorHex(task.priority) }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityClass(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                {task.status === 'completed' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{task.entity || 'General'}</span>
                )}
              </div>
              
              <div className="mt-2 flex items-start">
                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h3>
              </div>
              
              <p className={`text-sm text-muted-foreground mt-1 ${task.status === 'completed' ? 'line-through' : ''}`}>{task.description}</p>
              
              <div className="flex items-center mt-3 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                <span className="mx-2">•</span>
                <span>Assigned to: {task.assignedTo || 'Unassigned'}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${getStatusIndicator(task.status)}`}></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                    {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Reassign</DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Helper function for status indicator color
  const getStatusIndicator = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-400";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "postponed":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  // Helper function to get hex color for priority border
  const getPriorityColorHex = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#94a3b8";
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {tasks.map(renderTaskCard)}
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;
