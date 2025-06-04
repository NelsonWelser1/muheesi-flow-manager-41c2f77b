
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Fuel, TrendingUp, Route, Navigation } from 'lucide-react';

const RouteOptimization = () => {
  const routes = [
    {
      id: 'RT001',
      name: 'Kampala → Mbarara → Kabale',
      distance: '287 km',
      estimatedTime: '4h 15m',
      fuelCost: '$45.20',
      status: 'Optimized',
      savings: '12%',
      vehicles: 3,
      efficiency: 94
    },
    {
      id: 'RT002',
      name: 'Entebbe → Jinja → Mbale',
      distance: '198 km',
      estimatedTime: '3h 30m',
      fuelCost: '$32.50',
      status: 'Under Review',
      savings: '8%',
      vehicles: 2,
      efficiency: 87
    },
    {
      id: 'RT003',
      name: 'Kazo → Kiruhura → Lyantonde',
      distance: '156 km',
      estimatedTime: '2h 45m',
      fuelCost: '$28.90',
      status: 'Active',
      savings: '15%',
      vehicles: 4,
      efficiency: 96
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimized': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Route Optimization Center</h3>
          <p className="text-sm text-muted-foreground">AI-powered route planning and optimization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Optimize All Routes
          </Button>
          <Button className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Create New Route
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Active routes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92.3%</div>
            <p className="text-xs text-muted-foreground">Route optimization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fuel Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$2,340</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">47h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{route.name}</h4>
                  <p className="text-sm text-muted-foreground">Route ID: {route.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    {route.savings} savings
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-semibold">{route.distance}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Time</p>
                    <p className="font-semibold">{route.estimatedTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Cost</p>
                    <p className="font-semibold">{route.fuelCost}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                    <p className="font-semibold">{route.efficiency}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-indigo-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicles</p>
                    <p className="font-semibold">{route.vehicles}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Map
                </Button>
                <Button variant="outline" size="sm">
                  Optimize
                </Button>
                <Button variant="outline" size="sm">
                  Edit Route
                </Button>
                <Button variant="outline" size="sm">
                  Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteOptimization;
