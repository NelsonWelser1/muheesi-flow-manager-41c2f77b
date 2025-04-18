import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewTaskDialog from './tasks/NewTaskDialog';

const TaskManager = ({ selectedEntity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState(allTasks);
  
  const handleCreateTask = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  // Mock task data
  const allTasks = [
    {
      id: 1,
      title: "Review Quarterly Report",
      entity: "Grand Berna Dairies",
      entityId: "grand-berna",
      status: "pending",
      priority: "high",
      dueDate: "2025-04-17",
      assignedTo: "Self",
      description: "Review and approve Q1 2025 financial report before board meeting."
    },
    {
      id: 2,
      title: "Schedule Meeting with Suppliers",
      entity: "KAJON Coffee Limited",
      entityId: "kajon-coffee",
      status: "pending",
      priority: "medium",
      dueDate: "2025-04-18",
      assignedTo: "Self",
      description: "Coordinate with top suppliers for annual contract negotiation."
    },
    {
      id: 3,
      title: "Follow-up on Export Documentation",
      entity: "Fresheco Farming Limited",
      entityId: "fresheco",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-04-18",
      assignedTo: "Logistics Team",
      description: "Ensure all export permits and certifications are in order for shipment."
    },
    {
      id: 4,
      title: "Prepare Budget Presentation",
      entity: "Kyalima Farmers",
      entityId: "kyalima-farmers",
      status: "in-progress",
      priority: "medium",
      dueDate: "2025-04-20",
      assignedTo: "Finance Team",
      description: "Compile budget projections for next quarter."
    },
    {
      id: 5,
      title: "Organize Farm Visit",
      entity: "Bukomero Dairy Farm",
      entityId: "bukomero-dairy",
      status: "completed",
      priority: "low",
      dueDate: "2025-04-15",
      assignedTo: "Farm Manager",
      description: "Schedule CEO visit to inspect new equipment installation."
    },
    {
      id: 6,
      title: "Process Staff Payroll",
      entity: "Grand Berna Dairies",
      entityId: "grand-berna",
      status: "completed",
      priority: "high",
      dueDate: "2025-04-15",
      assignedTo: "HR Department",
      description: "Ensure monthly salaries are processed on time."
    }
  ];
  
  // Filter tasks based on the selected entity
  const filteredTasks = selectedEntity === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.entityId === selectedEntity);

  // Filter based on search query if present
  const searchedTasks = searchQuery.trim() === '' 
    ? filteredTasks 
    : filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Group tasks by status
  const pendingTasks = searchedTasks.filter(task => task.status === 'pending');
  const inProgressTasks = searchedTasks.filter(task => task.status === 'in-progress');
  const completedTasks = searchedTasks.filter(task => task.status === 'completed');

  const renderTaskCard = (task) => (
    <Card key={task.id} className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'outline'}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">{task.entity}</span>
            </div>
            <h3 className="font-medium mt-2">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            <div className="flex items-center mt-3 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
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
              <DropdownMenuItem>Mark Complete</DropdownMenuItem>
              <DropdownMenuItem>Reassign</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <NewTaskDialog onTaskCreate={handleCreateTask} />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center">
            Pending
            {pendingTasks.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {pendingTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center">
            In Progress
            {inProgressTasks.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {inProgressTasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            Completed
            {completedTasks.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {completedTasks.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length > 0 ? (
            pendingTasks.map(renderTaskCard)
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No pending tasks found
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map(renderTaskCard)
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No in-progress tasks found
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length > 0 ? (
            completedTasks.map(renderTaskCard)
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No completed tasks found
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManager;
