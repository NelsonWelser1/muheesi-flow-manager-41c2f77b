import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container, Thermometer, Box, Wrench } from "lucide-react";
import { useMilkReception } from '@/hooks/useMilkReception';

const EquipmentManagement = () => {
  const { data: milkReceptionData } = useMilkReception();

  // Calculate tank volumes from milk reception records
  const calculateTankVolumes = () => {
    if (!milkReceptionData) return { tankA: 0, tankB: 0 };
    
    return milkReceptionData.reduce((acc, record) => {
      if (record.tank_number === 'Tank A') {
        acc.tankA += record.milk_volume;
      } else if (record.tank_number === 'Tank B') {
        acc.tankB += record.milk_volume;
      }
      return acc;
    }, { tankA: 0, tankB: 0 });
  };

  const tankVolumes = calculateTankVolumes();

  const mockData = {
    storageTanks: [
      { 
        id: 'TA', 
        name: 'Tank A', 
        capacity: 5000, 
        currentVolume: tankVolumes.tankA, 
        temperature: 3.5 
      },
      { 
        id: 'TB', 
        name: 'Tank B', 
        capacity: 3000, 
        currentVolume: tankVolumes.tankB, 
        temperature: 3.2 
      }
    ],
    pasteurizers: [
      { id: 'P1', status: 'Active', currentTemp: 72, batchVolume: 1000 },
      { id: 'P2', status: 'Standby', currentTemp: 25, batchVolume: 0 },
    ],
    cheeseVats: [
      { id: 'V1', status: 'In Use', product: 'Cheddar', phase: 'Curd Cutting' },
      { id: 'V2', status: 'Cleaning', product: '-', phase: '-' },
    ],
    agingRooms: [
      { id: 'A1', temp: 12, humidity: 85, occupancy: '75%' },
      { id: 'A2', temp: 13, humidity: 82, occupancy: '60%' },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Tanks</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/2 Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasteurizers</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 Running</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cheese Vats</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1/2 In Use</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Items</div>
          </CardContent>
        </Card>

      </div>

      <Tabs defaultValue="storage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="storage">Storage Tanks</TabsTrigger>
          <TabsTrigger value="pasteurizer">Pasteurizers</TabsTrigger>
          <TabsTrigger value="vats">Cheese Vats</TabsTrigger>
          <TabsTrigger value="aging">Aging Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Tank Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockData.storageTanks.map((tank) => (
                  <Card key={tank.id} className="bg-gray-50 border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{tank.name}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          tank.temperature > 4 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {tank.temperature}°C
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Capacity</span>
                          <span>{tank.capacity}L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Volume</span>
                          <span>{tank.currentVolume.toFixed(2)}L</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Status</span>
                            <span className="text-green-600">Active</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pasteurizer">
          <Card>
            <CardHeader>
              <CardTitle>Pasteurizer Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.pasteurizers.map((unit) => (
                  <div key={unit.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Unit {unit.id}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        unit.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {unit.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Temperature</p>
                        <p>{unit.currentTemp}°C</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Batch Volume</p>
                        <p>{unit.batchVolume}L</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vats">
          <Card>
            <CardHeader>
              <CardTitle>Cheese Vat Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.cheeseVats.map((vat) => (
                  <div key={vat.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Vat {vat.id}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        vat.status === 'In Use' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vat.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Product</p>
                        <p>{vat.product}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Phase</p>
                        <p>{vat.phase}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aging">
          <Card>
            <CardHeader>
              <CardTitle>Aging Room Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.agingRooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Room {room.id}</h3>
                      <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                        {room.occupancy} Full
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Temperature</p>
                        <p>{room.temp}°C</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Humidity</p>
                        <p>{room.humidity}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default EquipmentManagement;