import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Tank, Milk, History, AlertCircle } from "lucide-react";
import MilkReception from './cheese-factory/milk-reception/MilkReception';
import { useDairyCoolerData } from '@/hooks/useDairyCoolerData';

const DairyCoolers = () => {
  const { data: coolerData, isLoading } = useDairyCoolerData();
  console.log('Cooler data:', coolerData);

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

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dairy Coolers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {renderMetricCard('Average Temperature', '4.2°C', Thermometer)}
            {renderMetricCard('Storage Capacity', '78%', Tank, 'warning')}
            {renderMetricCard('Daily Reception', '2,450L', Milk)}
            {renderMetricCard('Active Alerts', '2', AlertCircle, 'critical')}
          </div>

          <Tabs defaultValue="reception" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <TabsTrigger value="reception">Milk Reception</TabsTrigger>
              <TabsTrigger value="storage">Storage Management</TabsTrigger>
              <TabsTrigger value="monitoring">Temperature Monitoring</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="reception">
              <MilkReception />
            </TabsContent>

            <TabsContent value="storage">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Tanks Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((tank) => (
                        <div key={tank} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">Tank {tank}</h4>
                            <p className="text-sm text-gray-500">Last cleaned: 2 hours ago</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{Math.floor(Math.random() * 2000 + 1000)}L</div>
                            <div className="text-sm text-gray-500">Capacity: 5000L</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">Tank {i + 1}</h4>
                            <p className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</p>
                          </div>
                          <div className="font-bold">{(4 + Math.random()).toFixed(1)}°C</div>
                        </div>
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
                    {[
                      { time: '10:30 AM', action: 'Temperature check completed', status: 'normal' },
                      { time: '09:45 AM', action: 'New milk batch received', status: 'normal' },
                      { time: '09:15 AM', action: 'Tank 2 cleaning scheduled', status: 'warning' },
                      { time: '08:30 AM', action: 'Temperature alert resolved', status: 'critical' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{activity.action}</h4>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-sm ${
                          activity.status === 'normal' ? 'bg-green-100 text-green-800' :
                          activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.status}
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