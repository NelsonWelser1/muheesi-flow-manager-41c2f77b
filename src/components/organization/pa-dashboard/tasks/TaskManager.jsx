
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import TaskSearchBar from './tasks/TaskSearchBar';
import TaskList from './tasks/TaskList';
import NewTaskDialog from './tasks/NewTaskDialog';
import TaskCalendarView from './tasks/TaskCalendarView';
import TaskBoardView from './tasks/TaskBoardView';
import { useTasksData } from './hooks/useTasksData';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
            <div className="transition-all duration-300">
              {showForm && (
                <div className="mb-6 animate-fade-in">
                  <NewTaskDialog 
                    onTaskCreate={() => {
                      setShowForm(false);
                      fetchTasks();
                    }} 
                  />
                </div>
              )}
              <TaskList
                tasks={filteredTasks}
                handleCompleteTask={handleCompleteTask}
                handleDeleteTask={handleDeleteTask}
                getPriorityClass={getPriorityClass}
                getStatusClass={getStatusClass}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-4">
      {view === 'list' && (
        <div className="flex justify-between items-center">
          {!showForm ? (
            <div className="flex space-x-2">
              {/* Button for inline form */}
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                New Task
              </Button>
              
              {/* Slide-out sheet for task creation */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-blue-700">Create New Task</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <NewTaskDialog 
                      onTaskCreate={() => {
                        fetchTasks();
                      }} 
                      isSlideOver={true}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
          )}
          
          <div className="text-sm text-slate-500">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
          </div>
        </div>
      )}
      {renderView()}
    </div>
  );
};

export default TaskManager;
