
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User,
  Plus,
  Bell,
  CheckCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';

const TaskCalendarTools = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'medium'
  });

  // Sample data
  const upcomingAudits = [
    { id: 1, title: 'HACCP Annual Audit', date: '2024-06-15', time: '09:00', auditor: 'External Auditor', type: 'external', status: 'confirmed' },
    { id: 2, title: 'Cold Chain Temperature Review', date: '2024-06-20', time: '14:00', auditor: 'Jane Doe', type: 'internal', status: 'scheduled' },
    { id: 3, title: 'ISO 22000 Surveillance Audit', date: '2024-07-05', time: '10:00', auditor: 'Certification Body', type: 'external', status: 'pending' },
    { id: 4, title: 'Monthly Quality Review', date: '2024-06-25', time: '11:00', auditor: 'QC Team', type: 'internal', status: 'confirmed' }
  ];

  const inspectionSchedule = [
    { id: 1, product: 'Aged Cheese Batch C-001', date: '2024-06-05', time: '08:00', inspector: 'John Smith', frequency: 'daily', status: 'completed' },
    { id: 2, product: 'Fresh Milk Processing', date: '2024-06-05', time: '10:00', inspector: 'Jane Doe', frequency: 'daily', status: 'pending' },
    { id: 3, product: 'Coffee Bean Quality Check', date: '2024-06-06', time: '09:00', inspector: 'Mike Wilson', frequency: 'weekly', status: 'scheduled' },
    { id: 4, product: 'Cold Room Temperature Audit', date: '2024-06-07', time: '15:00', inspector: 'Sarah Johnson', frequency: 'weekly', status: 'scheduled' }
  ];

  const taskAssignments = [
    { id: 1, title: 'Update HACCP documentation', assignee: 'Jane Doe', dueDate: '2024-06-10', priority: 'high', status: 'in-progress', progress: 75 },
    { id: 2, title: 'Complete supplier audit checklist', assignee: 'John Smith', dueDate: '2024-06-08', priority: 'medium', status: 'pending', progress: 0 },
    { id: 3, title: 'Review and approve new SOP', assignee: 'Mike Wilson', dueDate: '2024-06-12', priority: 'low', status: 'completed', progress: 100 },
    { id: 4, title: 'Prepare monthly quality report', assignee: 'Sarah Johnson', dueDate: '2024-06-15', priority: 'high', status: 'in-progress', progress: 45 }
  ];

  const reminders = [
    { id: 1, title: 'USDA Export License expires in 30 days', type: 'warning', dueDate: '2024-07-05', action: 'Renew license' },
    { id: 2, title: 'Monthly temperature calibration due', type: 'info', dueDate: '2024-06-10', action: 'Schedule calibration' },
    { id: 3, title: 'Staff training on new procedures', type: 'reminder', dueDate: '2024-06-08', action: 'Organize training session' },
    { id: 4, title: 'Quarterly risk assessment review', type: 'info', dueDate: '2024-06-20', action: 'Schedule review meeting' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'scheduled': return 'bg-purple-500';
      case 'confirmed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'reminder': return <Bell className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleTaskSubmit = () => {
    console.log('New task:', newTask);
    setNewTask({ title: '', description: '', dueDate: '', assignee: '', priority: 'medium' });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="audits">Audit Reminders</TabsTrigger>
          <TabsTrigger value="inspections">Inspection Schedule</TabsTrigger>
          <TabsTrigger value="tasks">Task Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Calendar Overview</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Calendar placeholder */}
          <Card>
            <CardContent className="pt-6">
              <div className="h-96 flex items-center justify-center bg-gray-100 rounded-md">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">Interactive Calendar</h4>
                  <p className="text-muted-foreground">Full calendar view with drag-and-drop scheduling would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Today's Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getReminderIcon(reminder.type)}
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-muted-foreground">{reminder.action}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{reminder.dueDate}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Audit Reminders</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </div>

          <div className="grid gap-4">
            {upcomingAudits.map((audit) => (
              <Card key={audit.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{audit.title}</h4>
                      <p className="text-sm text-muted-foreground">Auditor: {audit.auditor}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={audit.type === 'external' ? 'destructive' : 'secondary'}>
                        {audit.type}
                      </Badge>
                      <Badge className={getStatusColor(audit.status)}>
                        {audit.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {audit.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {audit.time}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Inspection Schedule</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Inspection
            </Button>
          </div>

          <div className="grid gap-4">
            {inspectionSchedule.map((inspection) => (
              <Card key={inspection.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{inspection.product}</h4>
                      <p className="text-sm text-muted-foreground">Inspector: {inspection.inspector}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {inspection.frequency}
                      </Badge>
                      <Badge className={getStatusColor(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {inspection.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {inspection.time}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      {inspection.status === 'pending' ? 'Start Inspection' : 'View Results'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Task Assignments</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>

          {/* Quick task creation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input 
                  placeholder="Task title" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
                <Input 
                  placeholder="Assignee" 
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                />
                <Input 
                  type="date" 
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
                <Button onClick={handleTaskSubmit}>Create Task</Button>
              </div>
              <Textarea 
                placeholder="Task description..."
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </CardContent>
          </Card>

          {/* Task list */}
          <div className="grid gap-4">
            {taskAssignments.map((task) => (
              <Card key={task.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Assigned to {task.assignee} • Due: {task.dueDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskCalendarTools;
