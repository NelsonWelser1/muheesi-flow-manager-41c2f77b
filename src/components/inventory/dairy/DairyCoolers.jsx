import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Thermometer, Container, Milk, History, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MilkReception from './cheese-factory/milk-reception/MilkReception';
import { useDairyCoolerData } from '@/hooks/useDairyCoolerData';

const renderMetricCard = (title, value, icon, status = 'normal') => {
  const Icon = icon;
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${status === 'warning' ? 'text-yellow-500' : status === 'critical' ? 'text-red-500' : 'text-gray-500'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const DairyCoolers = () => {
  const { data: coolerData, isLoading } = useDairyCoolerData();
  const { toast } = useToast();
  console.log('Cooler data:', coolerData);

  const handleActionChange = (value, activityId) => {
    console.log(`Activity ${activityId} status changed to: ${value}`);
    toast({
      title: "Status Updated",
      description: `Activity status has been updated to: ${value}`,
    });
  };

  const activities = [
    { id: 1, time: '10:30 AM', action: 'Temperature check completed', status: 'normal' },
    { id: 2, time: '09:45 AM', action: 'New milk batch received', status: 'normal' },
    { id: 3, time: '09:15 AM', action: 'Tank A cleaning scheduled', status: 'warning' },
    { id: 4, time: '08:30 AM', action: 'Temperature alert resolved', status: 'critical' },
  ];

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dairy Coolers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {renderMetricCard('Average Temperature', '4.2°C', Thermometer)}
            {renderMetricCard('Storage Capacity', '78%', Container, 'warning')}
            {renderMetricCard('Daily Reception', '2,450L', Milk)}
            {renderMetricCard('Active Alerts', '2', AlertCircle, 'critical')}
          </div>

          <Tabs defaultValue="reception" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <TabsTrigger value="reception">Milk Reception</TabsTrigger>
              <TabsTrigger value="monitoring">Temperature Monitoring</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="reception">
              <MilkReception />
            </TabsContent>

            <TabsContent value="monitoring">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {['Tank A', 'Tank B'].map((tankName, i) => (
                        <Card key={tankName} className="bg-gray-50 border-none shadow-sm">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{tankName}</span>
                              </div>
                              <span className="text-lg font-bold text-blue-600">
                                {(4 + Math.random()).toFixed(1)}°C
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date().toLocaleTimeString()}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-grow">
                          <h4 className="font-semibold">{activity.action}</h4>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Select onValueChange={(value) => handleActionChange(value, activity.id)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Set status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="done">Done</SelectItem>
                              <SelectItem value="not-done">Not Done</SelectItem>
                              <SelectItem value="to-be-redone">To Be Redone</SelectItem>
                              <SelectItem value="rescheduled">Rescheduled</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className={`px-2 py-1 rounded text-sm ${
                            activity.status === 'normal' ? 'bg-green-100 text-green-800' :
                            activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {activity.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DairyCoolers;
