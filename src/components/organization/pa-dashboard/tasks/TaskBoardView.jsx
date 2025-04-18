
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/dateUtils";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";

const TaskBoardView = ({ tasks, handleCompleteTask, handleDeleteTask }) => {
  const [columns, setColumns] = useState([
    { id: 'pending', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' },
    { id: 'postponed', title: 'Postponed', color: 'bg-orange-100' },
  ]);

  // Group tasks by status
  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {});

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to handle drag start
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  // Function to handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle drop
  const handleDrop = (e, columnId) => {
    const taskId = e.dataTransfer.getData('taskId');
    
    // This is a placeholder for an actual state update function
    // In a real implementation, you would update the task status in your state management
    console.log(`Task ${taskId} moved to ${columnId}`);
    
    // For this demo, we'll just log the action
    alert(`Moved task to ${columnId}. In a real implementation, this would update the task status.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Task Board</h2>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
        {columns.map((column, index) => (
          <React.Fragment key={column.id}>
            <ResizablePanel defaultSize={25} minSize={20}>
              <div 
                className={`h-full p-4 flex flex-col ${column.color} rounded-md`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{column.title}</h3>
                  <Badge variant="outline">{tasksByStatus[column.id]?.length || 0}</Badge>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3">
                  {tasksByStatus[column.id]?.map(task => (
                    <Card 
                      key={task.id}
                      className="bg-white cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(task.dueDate)}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Badge className={`mt-2 ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}

                  {tasksByStatus[column.id]?.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
            {index < columns.length - 1 && <ResizableHandle withHandle />}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>

      <div className="p-4">
        <p className="text-sm text-gray-500 italic">
          Tip: Drag and drop tasks between columns to change their status
        </p>
      </div>
    </div>
  );
};

export default TaskBoardView;
