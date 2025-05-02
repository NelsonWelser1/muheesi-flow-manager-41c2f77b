
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import TaskSearchBar from './tasks/TaskSearchBar';
import TaskList from './tasks/TaskList';
import NewTaskDialog from './tasks/NewTaskDialog';
import TaskCalendarView from './tasks/TaskCalendarView';
import TaskBoardView from './tasks/TaskBoardView';
import { useTasksData } from './hooks/useTasksData';

const TaskManager = ({ selectedEntity, view = 'list' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { tasks, isLoading, fetchTasks, updateTask, deleteTask } = useTasksData();

  const handleCompleteTask = async (taskId) => {
    await updateTask(taskId, { status: 'completed' });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
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
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

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
              <NewTaskDialog 
                onTaskCreate={() => {
                  setShowForm(false);
                  fetchTasks();
                }} 
              />
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
