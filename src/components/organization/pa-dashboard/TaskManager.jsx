import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Clock, MoreHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import styles from './tasks/tasks.module.css';
import NewTaskDialog from './tasks/NewTaskDialog';
import { toast } from "sonner";
const TaskManager = ({
  selectedEntity
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);

  // Mock task data - initialized on component mount
  useEffect(() => {
    const mockTasks = [{
      id: 1,
      title: "Review Quarterly Report",
      entity: "Grand Berna Dairies",
      entityId: "grand-berna",
      status: "pending",
      priority: "high",
      dueDate: new Date("2025-04-17"),
      assignedTo: "Self",
      description: "Review and approve Q1 2025 financial report before board meeting."
    }, {
      id: 2,
      title: "Schedule Meeting with Suppliers",
      entity: "KAJON Coffee Limited",
      entityId: "kajon-coffee",
      status: "pending",
      priority: "medium",
      dueDate: new Date("2025-04-18"),
      assignedTo: "Self",
      description: "Coordinate with top suppliers for annual contract negotiation."
    }, {
      id: 3,
      title: "Follow-up on Export Documentation",
      entity: "Fresheco Farming Limited",
      entityId: "fresheco",
      status: "in-progress",
      priority: "high",
      dueDate: new Date("2025-04-18"),
      assignedTo: "Logistics Team",
      description: "Ensure all export permits and certifications are in order for shipment."
    }, {
      id: 4,
      title: "Prepare Budget Presentation",
      entity: "Kyalima Farmers",
      entityId: "kyalima-farmers",
      status: "in-progress",
      priority: "medium",
      dueDate: new Date("2025-04-20"),
      assignedTo: "Finance Team",
      description: "Compile budget projections for next quarter."
    }, {
      id: 5,
      title: "Organize Farm Visit",
      entity: "Bukomero Dairy Farm",
      entityId: "bukomero-dairy",
      status: "completed",
      priority: "low",
      dueDate: new Date("2025-04-15"),
      assignedTo: "Farm Manager",
      description: "Schedule CEO visit to inspect new equipment installation."
    }, {
      id: 6,
      title: "Process Staff Payroll",
      entity: "Grand Berna Dairies",
      entityId: "grand-berna",
      status: "completed",
      priority: "high",
      dueDate: new Date("2025-04-15"),
      assignedTo: "HR Department",
      description: "Ensure monthly salaries are processed on time."
    }];
    setTasks(mockTasks);
  }, []);
  const handleCreateTask = newTask => {
    // Add entity information to the task
    const taskWithEntity = {
      ...newTask,
      entity: selectedEntity === 'all' ? 'All Entities' : getEntityName(selectedEntity),
      entityId: selectedEntity
    };
    setTasks([taskWithEntity, ...tasks]);
  };

  // Helper to get entity name from id
  const getEntityName = entityId => {
    const entityMap = {
      'grand-berna': 'Grand Berna Dairies',
      'kajon-coffee': 'KAJON Coffee Limited',
      'fresheco': 'Fresheco Farming Limited',
      'kyalima-farmers': 'Kyalima Farmers',
      'bukomero-dairy': 'Bukomero Dairy Farm'
    };
    return entityMap[entityId] || 'Unknown Entity';
  };
  const handleCompleteTask = taskId => {
    setTasks(tasks.map(task => task.id === taskId ? {
      ...task,
      status: 'completed'
    } : task));
    toast.success("Task marked as complete");
  };
  const handleDeleteTask = taskId => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  // Filter tasks based on the selected entity
  const filteredTasks = selectedEntity === 'all' ? tasks : tasks.filter(task => task.entityId === selectedEntity);

  // Filter based on search query if present
  const searchedTasks = searchQuery.trim() === '' ? filteredTasks : filteredTasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group tasks by status
  const pendingTasks = searchedTasks.filter(task => task.status === 'pending');
  const inProgressTasks = searchedTasks.filter(task => task.status === 'in-progress');
  const completedTasks = searchedTasks.filter(task => task.status === 'completed');
  const getPriorityClass = priority => {
    switch (priority) {
      case 'high':
        return styles.taskPriorityHigh;
      case 'medium':
        return styles.taskPriorityMedium;
      case 'low':
        return styles.taskPriorityLow;
      default:
        return '';
    }
  };
  const getStatusClass = status => {
    switch (status) {
      case 'pending':
        return styles.taskStatusPending;
      case 'in-progress':
        return styles.taskStatusInProgress;
      case 'completed':
        return styles.taskStatusCompleted;
      case 'postponed':
        return styles.taskStatusPostponed;
      default:
        return '';
    }
  };
  const renderTaskCard = task => <Card key={task.id} className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
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
    </Card>;
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mx-0 px-0 py-[30px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search tasks..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
            {pendingTasks.length > 0 && <Badge variant="outline" className="ml-2">
                {pendingTasks.length}
              </Badge>}
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center">
            In Progress
            {inProgressTasks.length > 0 && <Badge variant="outline" className="ml-2">
                {inProgressTasks.length}
              </Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            Completed
            {completedTasks.length > 0 && <Badge variant="outline" className="ml-2">
                {completedTasks.length}
              </Badge>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.length > 0 ? pendingTasks.map(renderTaskCard) : <div className="text-center py-10 text-muted-foreground">
              No pending tasks found
            </div>}
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTasks.length > 0 ? inProgressTasks.map(renderTaskCard) : <div className="text-center py-10 text-muted-foreground">
              No in-progress tasks found
            </div>}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length > 0 ? completedTasks.map(renderTaskCard) : <div className="text-center py-10 text-muted-foreground">
              No completed tasks found
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
};
export default TaskManager;