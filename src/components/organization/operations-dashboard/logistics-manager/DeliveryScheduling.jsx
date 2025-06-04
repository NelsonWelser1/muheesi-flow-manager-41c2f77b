
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin, Package, User, Calendar as CalendarIcon } from 'lucide-react';

const DeliveryScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const deliveries = [
    {
      id: 'DEL001',
      customer: 'Kampala Supermarket Chain',
      address: 'Plot 123, Kampala Road',
      timeSlot: '08:00 - 10:00',
      products: ['Dairy Products', 'Cheese'],
      quantity: '150 units',
      priority: 'High',
      status: 'Scheduled',
      driver: 'John Mukasa',
      vehicle: 'VH001'
    },
    {
      id: 'DEL002',
      customer: 'Mbarara Distribution Center',
      address: 'Industrial Area, Mbarara',
      timeSlot: '10:30 - 12:00',
      products: ['Coffee Beans'],
      quantity: '500 kg',
      priority: 'Medium',
      status: 'In Progress',
      driver: 'Sarah Namuli',
      vehicle: 'VH003'
    },
    {
      id: 'DEL003',
      customer: 'Export Terminal',
      address: 'Entebbe International Airport',
      timeSlot: '14:00 - 16:00',
      products: ['Processed Coffee'],
      quantity: '2 tons',
      priority: 'High',
      status: 'Pending',
      driver: 'Peter Okello',
      vehicle: 'VH002'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Delivery Scheduling</h3>
          <p className="text-sm text-muted-foreground">Optimize delivery routes and time slots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Auto Schedule
          </Button>
          <Button className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            New Delivery
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Delivery Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Today's Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">6 completed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">On-Time Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">96.3%</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Delivery Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">45 min</div>
                <p className="text-xs text-muted-foreground">Per delivery</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Route Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <p className="text-xs text-muted-foreground">Optimization rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Today's Schedule</h4>
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-semibold text-lg">{delivery.customer}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-muted-foreground">{delivery.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(delivery.priority)}>
                        {delivery.priority}
                      </Badge>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time Slot</p>
                        <p className="font-semibold">{delivery.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{delivery.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Driver</p>
                        <p className="font-semibold">{delivery.driver}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="font-semibold">{delivery.vehicle}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Products</p>
                    <div className="flex gap-2">
                      {delivery.products.map((product, index) => (
                        <Badge key={index} variant="outline">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      View Route
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Customer
                    </Button>
                    <Button variant="outline" size="sm">
                      Track Delivery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryScheduling;
