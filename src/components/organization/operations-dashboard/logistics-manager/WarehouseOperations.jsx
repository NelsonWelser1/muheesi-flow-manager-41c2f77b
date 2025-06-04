
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, MapPin, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const WarehouseOperations = () => {
  const warehouses = [
    {
      id: 'WH001',
      name: 'Kampala Central Warehouse',
      location: 'Kampala, Uganda',
      capacity: '85%',
      totalSpace: '50,000 m²',
      usedSpace: '42,500 m²',
      status: 'Operational',
      inbound: 23,
      outbound: 31,
      processing: 12,
      temperature: '4°C'
    },
    {
      id: 'WH002',
      name: 'Mbarara Distribution Center',
      location: 'Mbarara, Uganda',
      capacity: '67%',
      totalSpace: '30,000 m²',
      usedSpace: '20,100 m²',
      status: 'Operational',
      inbound: 15,
      outbound: 19,
      processing: 8,
      temperature: '6°C'
    },
    {
      id: 'WH003',
      name: 'Kazo Processing Hub',
      location: 'Kazo, Uganda',
      capacity: '92%',
      totalSpace: '25,000 m²',
      usedSpace: '23,000 m²',
      status: 'Near Capacity',
      inbound: 18,
      outbound: 14,
      processing: 16,
      temperature: '2°C'
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
    if (numCapacity >= 90) return 'bg-red-500';
    if (numCapacity >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Warehouse Operations Center</h3>
          <p className="text-sm text-muted-foreground">Real-time warehouse monitoring and management</p>
        </div>
        <Button className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-xs text-muted-foreground">Average utilization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Daily Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <p className="text-xs text-muted-foreground">Items processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Efficiency Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94.8%</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {warehouses.map((warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{warehouse.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(warehouse.status)}>
                  {warehouse.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className="text-sm font-semibold">{warehouse.capacity}</span>
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
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">Inbound</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">{warehouse.inbound}</div>
                  <p className="text-xs text-muted-foreground">Shipments today</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Outbound</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{warehouse.outbound}</div>
                  <p className="text-xs text-muted-foreground">Shipments today</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-muted-foreground">Processing</span>
                  </div>
                  <div className="text-xl font-bold text-orange-600">{warehouse.processing}</div>
                  <p className="text-xs text-muted-foreground">Orders in queue</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Temperature: {warehouse.temperature}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Manage Inventory
                  </Button>
                  <Button variant="outline" size="sm">
                    Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WarehouseOperations;
