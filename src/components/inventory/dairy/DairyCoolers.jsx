import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, AlertCircle, Package, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReceiveMilkForm from './ReceiveMilkForm';
import OffloadMilkForm from './OffloadMilkForm';
import MilkReceptionHistory from './MilkReceptionHistory';
import { useTimer } from '@/hooks/useTimer';

const DairyCoolers = () => {
  const navigate = useNavigate();
  const currentTime = useTimer();
  
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Reception & Milk Coolers Management</CardTitle>
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <TabsTrigger 
                value="dashboard"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="receive" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Receive Milk
              </TabsTrigger>
              <TabsTrigger 
                value="offload"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Offload Milk
              </TabsTrigger>
            </TabsList>
            
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <TabsContent value="dashboard" className="mt-0">
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Grand Berna Dairies</h1>
                      <p className="text-gray-500">Milk Coolers Management Dashboard</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Current Time</p>
                      <p className="text-lg font-semibold">{currentTime}</p>
                    </div>
                  </div>

                  {/* Key Metrics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-blue-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <RefreshCcw className="h-5 w-5 text-blue-600" />
                          <p className="text-sm font-medium">Active Coolers</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">2/2</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-5 w-5 text-green-600" />
                          <p className="text-sm font-medium">Avg Temperature</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">4.2°C</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-purple-600" />
                          <p className="text-sm font-medium">Total Storage</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">75%</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <p className="text-sm font-medium">Active Alerts</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">1</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Milk Cooler Status Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Milk Cooler Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2].map((room) => (
                          <div key={room} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${
                                room === 2 ? 'bg-yellow-400' : 'bg-green-500'
                              }`} />
                              <div>
                                <p className="font-medium">{room === 1 ? 'Reception Milk Cooler' : 'Factory Milk Cooler'}</p>
                                <p className="text-sm text-gray-500">Manager: John Doe</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">4.5°C</p>
                              <p className="text-sm text-gray-500">80% Capacity</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alerts Section */}
                  <Card className="bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-700">Critical Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-yellow-700">
                          <AlertCircle className="h-4 w-4" />
                          <p>Factory Milk Cooler maintenance due in 2 days</p>
                          <span className="text-sm">1:30 PM</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="receive" className="mt-0">
                <ReceiveMilkForm />
                <MilkReceptionHistory />
              </TabsContent>
              <TabsContent value="offload" className="mt-0">
                <OffloadMilkForm />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DairyCoolers;
