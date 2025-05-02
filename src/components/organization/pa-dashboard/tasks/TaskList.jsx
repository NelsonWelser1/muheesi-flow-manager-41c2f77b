
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MoreHorizontal } from 'lucide-react';
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import styles from './tasks.module.css';

const TaskList = ({ tasks, handleCompleteTask, handleDeleteTask, getPriorityClass, getStatusClass }) => {
  const renderTaskCard = (task) => (
    <Card key={task.id} className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityClass(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">{task.entity}</span>
            </div>
            <h3 className="font-medium mt-2">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            <div className="flex items-center mt-3 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
              <span className="mx-2">•</span>
              <span>Assigned to: {task.assignedTo}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem>Reassign</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {tasks.map(renderTaskCard)}
    </div>
  );
};

export default TaskList;
