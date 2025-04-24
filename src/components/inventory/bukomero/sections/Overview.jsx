
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBukomeroDairyData } from '@/hooks/useBukomeroDairyData';

const Overview = () => {
  const { farmMetrics, isLoading, error } = useBukomeroDairyData();

  // Example data for upcoming tasks
  const upcomingTasks = [
    { id: 1, title: "Cattle Vaccination", dueDate: "2024-04-30", priority: "High" },
    { id: 2, title: "Silage Preparation", dueDate: "2024-05-05", priority: "Medium" },
    { id: 3, title: "Equipment Maintenance", dueDate: "2024-05-10", priority: "Low" },
  ];

  // Example data for recent activities
  const recentActivities = [
    { id: 1, activity: "Milk Production Recorded", date: "2024-04-24", user: "Manager Boaz" },
    { id: 2, activity: "New Cattle Registered", date: "2024-04-23", user: "John Smith" },
    { id: 3, activity: "Feed Stock Updated", date: "2024-04-22", user: "Jane Doe" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bukomero Dairy Farm Overview</h2>
      
      {/* Farm Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : farmMetrics?.totalCattle || "0"}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Milk Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : farmMetrics?.milkProduction || "N/A"}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cattle in Fattening</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : farmMetrics?.activeFattening || "0"}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Farm Details */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Contact Details</h4>
              <p className="text-sm text-muted-foreground">Manager: Manager Boaz</p>
              <p className="text-sm text-muted-foreground">Phone: +256 772 674060</p>
              <p className="text-sm text-muted-foreground">Location: Bukomero, Kyiboga District</p>
            </div>
            <div>
              <h4 className="font-medium">Farm Operations</h4>
              <p className="text-sm text-muted-foreground">Primary Focus: Dairy Production</p>
              <p className="text-sm text-muted-foreground">Secondary: Cattle Fattening</p>
              <p className="text-sm text-muted-foreground">Established: 2019</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tasks and Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks scheduled for the next 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingTasks.map(task => (
                <li key={task.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full
                    ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest farm operations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map(activity => (
                <li key={activity.id} className="border-b pb-2 last:border-0">
                  <p className="font-medium">{activity.activity}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{activity.date}</span>
                    <span>{activity.user}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
