
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Truck, Fuel, Wrench, MapPin, Plus } from 'lucide-react';

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const vehicles = [
    {
      id: 'VH001',
      type: 'Refrigerated Truck',
      driver: 'John Mukasa',
      status: 'Active',
      location: 'Kampala - Mbarara Route',
      mileage: '45,230 km',
      fuelLevel: '78%',
      nextMaintenance: '2024-06-15',
      temperature: '-18°C'
    },
    {
      id: 'VH002',
      type: 'Delivery Van',
      driver: 'Sarah Namuli',
      status: 'Maintenance',
      location: 'Kazo Workshop',
      mileage: '32,150 km',
      fuelLevel: '45%',
      nextMaintenance: '2024-06-08',
      temperature: 'N/A'
    },
    {
      id: 'VH003',
      type: 'Cargo Truck',
      driver: 'Peter Okello',
      status: 'Active',
      location: 'Entebbe - Jinja Route',
      mileage: '67,890 km',
      fuelLevel: '92%',
      nextMaintenance: '2024-07-02',
      temperature: 'N/A'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Driver: {vehicle.driver}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Fuel: {vehicle.fuelLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Next Service: {vehicle.nextMaintenance}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Mileage</p>
                  <p className="font-semibold">{vehicle.mileage}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{vehicle.temperature}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Track
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fleet Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.5%</div>
            <p className="text-xs text-muted-foreground">Overall efficiency rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Maintenance Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$12,450</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fuel Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8.5L/100km</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FleetManagement;
