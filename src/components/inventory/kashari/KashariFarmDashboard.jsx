
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Calendar, Users, Tractor, PieChart, DollarSign, BookOpen, Clock } from "lucide-react";
import DairyManagement from './modules/DairyManagement';
import ProductionManagement from './modules/LivestockManagement';
import BananaPlantation from './modules/BananaPlantation';
import SalesExpenditure from './modules/SalesExpenditure';
import EmployeeManagement from './modules/EmployeeManagement';
import ScholarshipProgram from './modules/ScholarshipProgram';
import FinanceAccounts from './modules/FinanceAccounts';
import { format } from 'date-fns';

const KashariFarmDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState({ temp: '24°C', condition: 'Partly Cloudy' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { title: 'Milk Production', value: '245 Liters', change: '+12%', icon: <BarChart2 className="h-4 w-4 text-blue-500" /> },
    { title: 'Banana Harvest', value: '680 Bunches', change: '+5%', icon: <Tractor className="h-4 w-4 text-green-500" /> },
    { title: 'Active Employees', value: '32', change: '-2', icon: <Users className="h-4 w-4 text-purple-500" /> },
    { title: 'Scholarships', value: '15 Active', change: '+3', icon: <BookOpen className="h-4 w-4 text-amber-500" /> }
  ];

  // Upcoming events
  const events = [
    { title: 'Cattle Vaccination', date: '2023-07-15', type: 'health' },
    { title: 'Banana Field Inspection', date: '2023-07-18', type: 'inspection' },
    { title: 'Staff Meeting', date: '2023-07-20', type: 'meeting' }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Kashari Mixed Farm Management System</CardTitle>
            <CardDescription>
              Integrated management for dairy, crops, and community programs
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{weather.temp}</p>
              <p className="text-xs text-muted-foreground">{weather.condition}</p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{format(currentTime, 'h:mm a')}</p>
              <p className="text-xs text-muted-foreground">{format(currentTime, 'MMM d, yyyy')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full justify-start overflow-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="dairy">Dairy Products</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="banana">Banana Plantation</TabsTrigger>
              <TabsTrigger value="sales">Sales & Expenditure</TabsTrigger>
              <TabsTrigger value="employees">Employees & Contractors</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="finance">Finance & Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              {/* Farm Overview Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className="p-2 bg-muted rounded-full">{stat.icon}</div>
                      </div>
                      <div className="mt-4 text-xs font-medium">
                        <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                          {stat.change} from last week
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calendar Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" /> Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.map((event, i) => (
                        <div key={i} className="flex items-center border-b pb-2">
                          <div className={`w-2 h-10 rounded-full mr-3 ${
                            event.type === 'health' ? 'bg-red-500' : 
                            event.type === 'inspection' ? 'bg-blue-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Calendar className="mr-2 h-4 w-4" /> View Full Calendar
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Daily Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> Daily Farm Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" id="task-1" />
                        <label htmlFor="task-1" className="flex-1">Morning milk collection (6:00 AM)</label>
                        <span className="text-amber-500 text-sm">High</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" id="task-2" />
                        <label htmlFor="task-2" className="flex-1">Cattle feeding schedule (8:00 AM)</label>
                        <span className="text-amber-500 text-sm">High</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" id="task-3" />
                        <label htmlFor="task-3" className="flex-1">Banana plantation watering</label>
                        <span className="text-blue-500 text-sm">Medium</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" id="task-4" />
                        <label htmlFor="task-4" className="flex-1">Evening milk collection (5:00 PM)</label>
                        <span className="text-amber-500 text-sm">High</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" id="task-5" />
                        <label htmlFor="task-5" className="flex-1">Update production records</label>
                        <span className="text-blue-500 text-sm">Medium</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Clock className="mr-2 h-4 w-4" /> Manage Tasks
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dairy">
              <DairyManagement />
            </TabsContent>

            <TabsContent value="production">
              <ProductionManagement />
            </TabsContent>

            <TabsContent value="banana">
              <BananaPlantation />
            </TabsContent>

            <TabsContent value="sales">
              <SalesExpenditure />
            </TabsContent>

            <TabsContent value="employees">
              <EmployeeManagement />
            </TabsContent>

            <TabsContent value="scholarships">
              <ScholarshipProgram />
            </TabsContent>

            <TabsContent value="finance">
              <FinanceAccounts />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KashariFarmDashboard;
