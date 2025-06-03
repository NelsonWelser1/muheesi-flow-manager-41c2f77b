
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Calendar,
  User,
  Building2,
  Filter,
  Search
} from 'lucide-react';

const TaskManager = ({ selectedEntity, view }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Review Q1 Financial Reports",
      description: "Compile and review financial performance across all companies",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-06-05",
      company: "All Companies",
      assignedTo: "PA. Nelson Namanya",
      category: "Financial"
    },
    {
      id: 2,
      title: "Prepare Board Meeting Agenda",
      description: "Draft agenda for upcoming board meeting with strategic items",
      priority: "High",
      status: "Pending",
      dueDate: "2024-06-04",
      company: "All Companies",
      assignedTo: "PA. Nelson Namanya",
      category: "Administrative"
    },
    {
      id: 3,
      title: "KAJON Coffee Export Documentation",
      description: "Review and process export permits and certificates",
      priority: "Urgent",
      status: "In Progress",
      dueDate: "2024-06-03",
      company: "KAJON Coffee Limited",
      assignedTo: "PA. Nelson Namanya",
      category: "Operations"
    },
    {
      id: 4,
      title: "Grand Berna Equipment Maintenance Schedule",
      description: "Coordinate quarterly maintenance for dairy equipment",
      priority: "Medium",
      status: "Completed",
      dueDate: "2024-05-30",
      company: "Grand Berna Dairies",
      assignedTo: "PA. Nelson Namanya",
      category: "Operations"
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    company: 'All Companies',
    category: 'Administrative'
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const addTask = () => {
    const task = {
      id: tasks.length + 1,
      ...newTask,
      status: 'Pending',
      assignedTo: 'PA. Nelson Namanya'
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      company: 'All Companies',
      category: 'Administrative'
    });
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status.toLowerCase() === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = selectedEntity === 'all' || task.company === selectedEntity;
    return matchesStatus && matchesSearch && matchesEntity;
  });

  if (view === 'form') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Task Title</label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title..."
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Task description..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Due Date</label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Company</label>
              <Select value={newTask.company} onValueChange={(value) => setNewTask({...newTask, company: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Companies">All Companies</SelectItem>
                  <SelectItem value="Grand Berna Dairies">Grand Berna Dairies</SelectItem>
                  <SelectItem value="KAJON Coffee Limited">KAJON Coffee Limited</SelectItem>
                  <SelectItem value="Kyalima Farmers Limited">Kyalima Farmers Limited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Strategic">Strategic</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addTask} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Task Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Task List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {task.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignedTo}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {task.status !== 'Completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, task.status === 'Pending' ? 'In Progress' : 'Completed')}
                      >
                        {task.status === 'Pending' ? 'Start' : 'Complete'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Pending', 'In Progress', 'Completed', 'Overdue'].map((status) => (
              <Card key={status}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{status}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {filteredTasks
                    .filter(task => task.status === status)
                    .map(task => (
                      <div key={task.id} className="p-2 border rounded-md bg-white">
                        <h5 className="font-medium text-sm">{task.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{task.company}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge size="sm" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-md">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Calendar integration coming soon</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManager;
