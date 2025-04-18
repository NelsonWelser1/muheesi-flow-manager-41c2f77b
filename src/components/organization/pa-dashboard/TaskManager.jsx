import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import NewTaskDialog from './tasks/NewTaskDialog';
import TaskSearchBar from './tasks/TaskSearchBar';
import TaskList from './tasks/TaskList';
import styles from './tasks/tasks.module.css';

const TaskManager = ({ selectedEntity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);

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
    const taskWithEntity = {
      ...newTask,
      entity: selectedEntity === 'all' ? 'All Entities' : getEntityName(selectedEntity),
      entityId: selectedEntity
    };
    setTasks([taskWithEntity, ...tasks]);
  };

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

  const filteredTasks = selectedEntity === 'all' ? tasks : tasks.filter(task => task.entityId === selectedEntity);

  const searchedTasks = searchQuery.trim() === '' ? filteredTasks : filteredTasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const pendingTasks = searchedTasks.filter(task => task.status === 'pending');
  const inProgressTasks = searchedTasks.filter(task => task.status === 'in-progress');
  const completedTasks = searchedTasks.filter(task => task.status === 'completed');

  const getPriorityClass = priority => {
    switch (priority) {
      case 'high': return styles.taskPriorityHigh;
      case 'medium': return styles.taskPriorityMedium;
      case 'low': return styles.taskPriorityLow;
      default: return '';
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'pending': return styles.taskStatusPending;
      case 'in-progress': return styles.taskStatusInProgress;
      case 'completed': return styles.taskStatusCompleted;
      case 'postponed': return styles.taskStatusPostponed;
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:max-w-3xl mx-auto w-full">
        <div className="space-y-4">
          <TaskSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="flex justify-end">
            <Button variant="outline" size="icon" className="mr-2">
              <Filter className="h-4 w-4" />
            </Button>
            <NewTaskDialog onTaskCreate={handleCreateTask} />
          </div>
        </div>

        <Tabs defaultValue="pending" className="mt-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">
              Pending
              {pendingTasks.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {pendingTasks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex-1 sm:flex-none">
              In Progress
              {inProgressTasks.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {inProgressTasks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 sm:flex-none">
              Completed
              {completedTasks.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {completedTasks.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="pending">
              {pendingTasks.length > 0 ? (
                <TaskList
                  tasks={pendingTasks}
                  handleCompleteTask={handleCompleteTask}
                  handleDeleteTask={handleDeleteTask}
                  getPriorityClass={getPriorityClass}
                  getStatusClass={getStatusClass}
                />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No pending tasks found
                </div>
              )}
            </TabsContent>

            <TabsContent value="in-progress">
              {inProgressTasks.length > 0 ? (
                <TaskList
                  tasks={inProgressTasks}
                  handleCompleteTask={handleCompleteTask}
                  handleDeleteTask={handleDeleteTask}
                  getPriorityClass={getPriorityClass}
                  getStatusClass={getStatusClass}
                />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No in-progress tasks found
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedTasks.length > 0 ? (
                <TaskList
                  tasks={completedTasks}
                  handleCompleteTask={handleCompleteTask}
                  handleDeleteTask={handleDeleteTask}
                  getPriorityClass={getPriorityClass}
                  getStatusClass={getStatusClass}
                />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No completed tasks found
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskManager;
