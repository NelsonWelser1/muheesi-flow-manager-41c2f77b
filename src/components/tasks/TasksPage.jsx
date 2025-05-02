
import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, List, Loader2, PlusCircle, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskCreate = async (taskData) => {
    await createTask(taskData);
    setShowNewTaskForm(false);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">Manage your tasks and track your progress</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64 lg:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-8 pr-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleSearchClear}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button 
          onClick={() => setShowNewTaskForm(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      
      <Tabs defaultValue="list" onValueChange={setViewMode} className="mb-6">
        <TabsList>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" /> List
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" /> Calendar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md text-center text-destructive">
              Failed to load tasks: {error}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? 'No tasks match your search' : 'No tasks yet. Create your first task!'}
            </div>
          ) : (
            <TaskList 
              tasks={filteredTasks} 
              onUpdateTask={updateTask} 
              onDeleteTask={deleteTask} 
            />
          )}
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <div className="bg-muted/40 p-8 rounded-md text-center text-muted-foreground">
            Calendar view will be implemented soon
          </div>
        </TabsContent>
      </Tabs>

      {/* Create task form modal */}
      {showNewTaskForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewTaskForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-background rounded-lg shadow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateTaskForm
              onCancel={() => setShowNewTaskForm(false)}
              onSubmit={handleTaskCreate}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
