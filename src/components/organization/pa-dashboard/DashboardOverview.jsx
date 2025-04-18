
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Briefcase, TrendingUp, BellRing, Clock } from 'lucide-react';

const DashboardOverview = ({ selectedEntity }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 urgent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 due this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-red-500' : i === 2 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {i === 1 ? 'Review Coffee Purchasing Contract' : 
                       i === 2 ? 'Prepare Quarterly Report' : 
                       i === 3 ? 'Meet with UCDA Officials' : 
                       'Follow up on Milk Delivery Schedules'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due {i === 1 ? 'Today, 5:00 PM' : 
                           i === 2 ? 'Tomorrow, 10:00 AM' : 
                           i === 3 ? 'Apr 20, 2025' : 
                           'Apr 22, 2025'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === 1 ? 'bg-blue-100 text-blue-600' : 
                      i === 2 ? 'bg-green-100 text-green-600' : 
                      i === 3 ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {i === 1 ? <Calendar className="h-4 w-4" /> : 
                       i === 2 ? <CheckSquare className="h-4 w-4" /> : 
                       i === 3 ? <Briefcase className="h-4 w-4" /> : 
                       <Clock className="h-4 w-4" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {i === 1 ? 'Meeting scheduled with UCDA' : 
                       i === 2 ? 'Invoice approved by Finance' : 
                       i === 3 ? 'New order from Cafe Javas' : 
                       'Milk production report due'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i === 1 ? '30 minutes ago' : 
                       i === 2 ? '2 hours ago' : 
                       i === 3 ? 'Yesterday, 4:30 PM' : 
                       'Yesterday, 9:15 AM'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '09:00 AM', event: 'Executive Team Meeting', location: 'Conference Room A' },
                { time: '11:30 AM', event: 'Vendor Negotiation', location: 'Office' },
                { time: '01:00 PM', event: 'Lunch with Ministry Officials', location: 'Serena Hotel' },
                { time: '03:30 PM', event: 'Review Export Documentation', location: 'Office' }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-xs font-medium text-muted-foreground w-16">
                    {item.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Event {i}</p>
                    <p className="text-xs text-muted-foreground">Apr {15 + i}, 2025 • 10:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 hover:bg-accent cursor-pointer">
                <CheckSquare className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">New Task</p>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer">
                <Calendar className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Schedule</p>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer">
                <Briefcase className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Projects</p>
              </Card>
              <Card className="p-4 hover:bg-accent cursor-pointer">
                <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                <p className="text-sm font-medium">Reports</p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
