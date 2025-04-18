
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import TaskSearchBar from './tasks/TaskSearchBar';
import TaskList from './tasks/TaskList';
import NewTaskDialog from './tasks/NewTaskDialog';
import TaskCalendarView from './tasks/TaskCalendarView';
import TaskBoardView from './tasks/TaskBoardView';

const TaskManager = ({ selectedEntity, view = 'list' }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Mock data for tasks
    const mockTasks = [
      {
        id: 1,
        title: "Prepare Quarterly Report",
        description: "Gather data and create the quarterly financial report.",
        priority: "high",
        status: "pending",
        dueDate: "2024-08-15",
        assignedTo: "John Doe",
        entity: "Finance",
      },
      {
        id: 2,
        title: "Update Client Database",
        description: "Clean and update the client contact information in the CRM.",
        priority: "medium",
        status: "in-progress",
        dueDate: "2024-08-22",
        assignedTo: "Jane Smith",
        entity: "Sales",
      },
      {
        id: 3,
        title: "Schedule Team Training",
        description: "Coordinate and schedule a training session for the marketing team.",
        priority: "low",
        status: "completed",
        dueDate: "2024-08-01",
        assignedTo: "Alice Johnson",
        entity: "Marketing",
      },
    ];

    setTasks(mockTasks);
  }, []);

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {...task, status: 'completed'} 
        : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

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

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "text-gray-500";
      case "in-progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "postponed":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedEntity === 'all' || task.entity === selectedEntity)
  );

  const renderView = () => {
    switch (view) {
      case 'calendar':
        return <TaskCalendarView tasks={filteredTasks} />;
      case 'board':
        return (
          <TaskBoardView 
            tasks={filteredTasks} 
            handleCompleteTask={handleCompleteTask} 
            handleDeleteTask={handleDeleteTask} 
          />
        );
      case 'list':
      default:
        return (
          <>
            <TaskSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {showForm && (
              <NewTaskDialog onTaskCreate={handleCreateTask} />
            )}
            <TaskList
              tasks={filteredTasks}
              handleCompleteTask={handleCompleteTask}
              handleDeleteTask={handleDeleteTask}
              getPriorityClass={getPriorityClass}
              getStatusClass={getStatusClass}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-4">
      {!showForm && view === 'list' && (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      )}
      {renderView()}
    </div>
  );
};

export default TaskManager;
