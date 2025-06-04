
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, MapPin, Thermometer, Droplets, Package, TrendingUp } from 'lucide-react';

const WarehouseControl = () => {
  const warehouses = [
    {
      id: 'WH001',
      name: 'Main Warehouse',
      location: 'Kampala Industrial Area',
      capacity: '85%',
      totalSpace: '50,000 m²',
      usedSpace: '42,500 m²',
      temperature: '18°C',
      humidity: '65%',
      zones: ['A', 'B', 'C', 'D'],
      activeZones: 4,
      itemsStored: 15420,
      status: 'Operational'
    },
    {
      id: 'WH002',
      name: 'Cold Storage Facility',
      location: 'Kazo Processing Center',
      capacity: '67%',
      totalSpace: '15,000 m²',
      usedSpace: '10,050 m²',
      temperature: '4°C',
      humidity: '85%',
      zones: ['CS1', 'CS2', 'CS3'],
      activeZones: 3,
      itemsStored: 8750,
      status: 'Operational'
    },
    {
      id: 'WH003',
      name: 'Raw Materials Storage',
      location: 'Mbarara Distribution Hub',
      capacity: '92%',
      totalSpace: '30,000 m²',
      usedSpace: '27,600 m²',
      temperature: '22°C',
      humidity: '55%',
      zones: ['RM1', 'RM2', 'RM3', 'RM4'],
      activeZones: 4,
      itemsStored: 12300,
      status: 'Near Capacity'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800';
      case 'Near Capacity': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityColor = (capacity) => {
    const numCapacity = parseInt(capacity);
    if (numCapacity >= 90) return 'text-red-600';
    if (numCapacity >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Warehouse Control Center</h3>
          <p className="text-sm text-muted-foreground">Monitor and control warehouse operations in real-time</p>
        </div>
        <Button className="flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          System Overview
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Combined Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">81%</div>
            <p className="text-xs text-muted-foreground">Average utilization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Items Stored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">36,470</div>
            <p className="text-xs text-muted-foreground">Total inventory items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">11</div>
            <p className="text-xs text-muted-foreground">Across all facilities</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Warehouse className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-lg">{warehouse.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(warehouse.status)}>
                  {warehouse.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className={`text-sm font-semibold ${getCapacityColor(warehouse.capacity)}`}>
                      {warehouse.capacity}
                    </span>
                  </div>
                  <Progress 
                    value={parseInt(warehouse.capacity)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {warehouse.usedSpace} / {warehouse.totalSpace}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-muted-foreground">Temperature</span>
                  </div>
                  <div className="text-xl font-bold">{warehouse.temperature}</div>
                  <p className="text-xs text-muted-foreground">Controlled environment</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Humidity</span>
                  </div>
                  <div className="text-xl font-bold">{warehouse.humidity}</div>
                  <p className="text-xs text-muted-foreground">Optimal levels</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">Items</span>
                  </div>
                  <div className="text-xl font-bold">{warehouse.itemsStored.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total items stored</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-muted-foreground">Active Zones</span>
                  </div>
                  <div className="text-xl font-bold">{warehouse.activeZones}</div>
                  <p className="text-xs text-muted-foreground">
                    {warehouse.zones.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Monitor Systems
                </Button>
                <Button variant="outline" size="sm">
                  Zone Management
                </Button>
                <Button variant="outline" size="sm">
                  Environmental Controls
                </Button>
                <Button variant="outline" size="sm">
                  Capacity Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environmental Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Temperature variance in WH001</span>
              <Badge variant="outline" className="text-yellow-600">Minor</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Humidity spike in WH002</span>
              <Badge variant="outline" className="text-red-600">Critical</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">All systems normal in WH003</span>
              <Badge variant="outline" className="text-green-600">Normal</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacity Warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">WH003 nearing capacity</span>
              <span className="text-sm font-semibold text-red-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">WH001 high utilization</span>
              <span className="text-sm font-semibold text-yellow-600">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">WH002 optimal levels</span>
              <span className="text-sm font-semibold text-green-600">67%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-semibold">15:30</span> - Large shipment received at WH001
            </div>
            <div className="text-sm">
              <span className="font-semibold">14:20</span> - Temperature adjusted in WH002
            </div>
            <div className="text-sm">
              <span className="font-semibold">13:45</span> - Zone A reorganization completed
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseControl;
