import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Beef, 
  Stethoscope, 
  LineChart, 
  PlusCircle, 
  ChevronLeft, 
  Activity, 
  Scale, 
  TagIcon,
  BarChart2,
  Calendar,
  Tractor,
  BookOpen,
  Clock
} from "lucide-react";
import DairyManagement from './modules/DairyManagement';
import BananaPlantation from './modules/BananaPlantation';
import SalesExpenditure from './modules/SalesExpenditure';
import { format } from 'date-fns';
import { useWeatherData } from '@/utils/weatherService';

const KashariFarmDashboard = () => {
  // Make sure the activeTab state is properly persisted
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('kashariFarmActiveTab') || 'dashboard';
    return savedTab;
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  // Add a key to force re-render of components when tab changes
  const [componentKey, setComponentKey] = useState(Date.now());

  // Fetch real weather data using our custom hook
  const { data: weatherData, isLoading: isWeatherLoading, error: weatherError } = useWeatherData();
  
  // Save active tab to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('kashariFarmActiveTab', activeTab);
    // Generate a new key whenever the tab changes to force re-render
    setComponentKey(Date.now());
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle tab change with proper state management
  const handleTabChange = (value) => {
    setActiveTab(value);
    // Clear any cached dairy section UI state when switching tabs
    if (value === 'dairy') {
      localStorage.removeItem('dairyActiveSection');
      localStorage.removeItem('dairySidebarCollapsed');
    }
  };

  const stats = [
    { title: 'Milk Production', value: '245 Liters', change: '+12%', icon: <BarChart2 className="h-4 w-4 text-blue-500" /> },
    { title: 'Banana Harvest', value: '680 Bunches', change: '+5%', icon: <Tractor className="h-4 w-4 text-green-500" /> },
  ];

  const events = [
    { title: 'Cattle Vaccination', date: '2023-07-15', type: 'health' },
    { title: 'Banana Field Inspection', date: '2023-07-18', type: 'inspection' },
    { title: 'Staff Meeting', date: '2023-07-20', type: 'meeting' }
  ];

  // Weather display data
  const weather = weatherData || { temp: '24°C', condition: 'Partly Cloudy', location: 'Mbarara' };

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
              <p className="text-xs text-muted-foreground">{weather.condition} - {weather.location}</p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{format(currentTime, 'h:mm a')}</p>
              <p className="text-xs text-muted-foreground">{format(currentTime, 'MMM d, yyyy')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="dairy">Dairy Products</TabsTrigger>
              <TabsTrigger value="banana">Plantation Management</TabsTrigger>
              <TabsTrigger value="sales">Sales & Expenditure</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
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
              <DairyManagement key={`dairy-management-${componentKey}`} />
            </TabsContent>

            <TabsContent value="banana">
              <BananaPlantation />
            </TabsContent>

            <TabsContent value="sales">
              <SalesExpenditure />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KashariFarmDashboard;
