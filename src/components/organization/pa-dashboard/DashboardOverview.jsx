
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, CheckSquare, BellRing, Clock, Users } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";

const DashboardOverview = ({ selectedEntity }) => {
  // Mock data for upcoming tasks
  const upcomingTasks = [
    { id: 1, title: "Review Quarterly Report", entity: "Grand Berna Dairies", dueDate: "Today, 2:00 PM", priority: "high" },
    { id: 2, title: "Schedule Meeting with Suppliers", entity: "KAJON Coffee Limited", dueDate: "Tomorrow", priority: "medium" },
    { id: 3, title: "Follow-up on Export Documentation", entity: "Fresheco Farming Limited", dueDate: "Apr 18, 2025", priority: "high" },
    { id: 4, title: "Prepare Budget Presentation", entity: "Kyalima Farmers", dueDate: "Apr 20, 2025", priority: "medium" }
  ];
  
  // Filter tasks based on selected entity if not "all"
  const filteredTasks = selectedEntity === 'all' 
    ? upcomingTasks 
    : upcomingTasks.filter(task => {
        const entityMap = {
          'grand-berna': 'Grand Berna Dairies',
          'kajon-coffee': 'KAJON Coffee Limited',
          'kazo-coffee': 'Kazo Coffee Development Association',
          'kyalima-farmers': 'Kyalima Farmers',
          'bukomero-dairy': 'Bukomero Dairy Farm',
          'kakyinga-farm': 'Kakyinga Mixed Farm',
          'fresheco': 'Fresheco Farming Limited',
          'personal': 'Personal Ventures'
        };
        return task.entity === entityMap[selectedEntity];
      });

  // Mock data for notifications
  const notifications = [
    { id: 1, title: "Loan Payment Due", entity: "Kyalima Farmers", time: "Tomorrow", type: "warning" },
    { id: 2, title: "New Export Order", entity: "Fresheco Farming Limited", time: "1 hour ago", type: "info" },
    { id: 3, title: "Stock Level Low: Packaging Materials", entity: "Grand Berna Dairies", time: "3 hours ago", type: "alert" }
  ];
  
  // Filter notifications based on selected entity if not "all"
  const filteredNotifications = selectedEntity === 'all' 
    ? notifications 
    : notifications.filter(notification => {
        const entityMap = {
          'grand-berna': 'Grand Berna Dairies',
          'kajon-coffee': 'KAJON Coffee Limited',
          'kazo-coffee': 'Kazo Coffee Development Association',
          'kyalima-farmers': 'Kyalima Farmers',
          'bukomero-dairy': 'Bukomero Dairy Farm',
          'kakyinga-farm': 'Kakyinga Mixed Farm',
          'fresheco': 'Fresheco Farming Limited',
          'personal': 'Personal Ventures'
        };
        return notification.entity === entityMap[selectedEntity];
      });

  // Mock data for KPIs by entity
  const entityKPIs = {
    'grand-berna': [
      { title: "Daily Production", value: "1,250 L", change: "+4.5%" },
      { title: "Inventory Value", value: "UGX 82.4M", change: "+2.1%" },
      { title: "Sales MTD", value: "UGX 34.2M", change: "+7.8%" },
      { title: "Production Efficiency", value: "94%", change: "+1.2%" }
    ],
    'kajon-coffee': [
      { title: "Coffee Stock", value: "24.5 tons", change: "-2.3%" },
      { title: "Export Orders", value: "3 pending", change: "+1" },
      { title: "Revenue MTD", value: "USD 45.2K", change: "+12.4%" },
      { title: "Quality Score", value: "86/100", change: "+2 pts" }
    ],
    // Add other entities...
    'all': [
      { title: "Total Revenue MTD", value: "UGX 143.5M", change: "+5.2%" },
      { title: "Pending Tasks", value: "18", change: "-3" },
      { title: "Upcoming Meetings", value: "6", change: "+2" },
      { title: "Documents Pending", value: "7", change: "-1" }
    ]
  };

  // Get KPIs based on selected entity
  const kpis = entityKPIs[selectedEntity] || entityKPIs['all'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kpis.map((kpi, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kpi.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {kpi.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Calendar Widget */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Calendar</span>
              </CardTitle>
              <CardDescription>Your schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" className="rounded-md border" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tasks and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5" />
              <span>Upcoming Tasks</span>
            </CardTitle>
            <CardDescription>
              Tasks due soon across {selectedEntity === 'all' ? 'all entities' : 'this entity'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`mt-1 h-3 w-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{task.entity}</p>
                        <div className="flex items-center text-xs">
                          <Clock className="h-3 w-3 mr-1" /> 
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming tasks found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BellRing className="h-5 w-5" />
              <span>Recent Notifications</span>
            </CardTitle>
            <CardDescription>
              Important alerts and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`mt-1 h-3 w-3 rounded-full ${
                      notification.type === 'warning' ? 'bg-yellow-500' : 
                      notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{notification.entity}</p>
                        <div className="flex items-center text-xs">
                          <Clock className="h-3 w-3 mr-1" /> 
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No notifications found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Today's Schedule</span>
          </CardTitle>
          <CardDescription>Meetings and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l space-y-6">
            {/* Morning Schedule */}
            <div className="relative">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[25px]"></div>
              <div className="mb-1 text-sm font-semibold">9:00 AM - Executive Brief</div>
              <div className="text-xs text-muted-foreground">Meeting with CEO to review weekly targets</div>
              <div className="mt-1 text-xs flex items-center text-blue-600">
                <Users className="h-3 w-3 mr-1" />
                <span>Muheesi's Office, Grand Berna HQ</span>
              </div>
            </div>
            
            {/* Afternoon Schedule */}
            <div className="relative">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[25px]"></div>
              <div className="mb-1 text-sm font-semibold">2:30 PM - Supplier Negotiation</div>
              <div className="text-xs text-muted-foreground">Review packaging materials contract with Eco Packaging Ltd</div>
              <div className="mt-1 text-xs flex items-center text-green-600">
                <Users className="h-3 w-3 mr-1" />
                <span>Conference Room B, Virtual Call</span>
              </div>
            </div>
            
            {/* Evening Schedule */}
            <div className="relative">
              <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[25px]"></div>
              <div className="mb-1 text-sm font-semibold">5:00 PM - Document Review</div>
              <div className="text-xs text-muted-foreground">Prepare export documentation for Fresheco shipment</div>
              <div className="mt-1 text-xs flex items-center text-purple-600">
                <Users className="h-3 w-3 mr-1" />
                <span>Administrative Office</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
