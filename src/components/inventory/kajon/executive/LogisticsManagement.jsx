
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  BarChart3,
  Map,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Route,
  Warehouse,
  PackageCheck,
  TrendingUp,
  Filter,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const LogisticsManagement = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  
  // Mock logistics data - in a real implementation, this would come from a hook or API
  const mockDeliveryData = [
    { id: 'DEL-18942', date: '2024-01-20', status: 'completed', from: 'Kazo-Kanoni', to: 'Kampala Warehouse', volume: '1,200kg' },
    { id: 'DEL-18936', date: '2024-01-18', status: 'in_transit', from: 'Buremba', to: 'Export Processing', volume: '850kg' },
    { id: 'DEL-18930', date: '2024-01-17', status: 'delayed', from: 'Engari', to: 'Kampala Factory', volume: '1,050kg' },
    { id: 'DEL-18927', date: '2024-01-16', status: 'completed', from: 'Nkungu', to: 'Kampala Warehouse', volume: '920kg' }
  ];
  
  const mockPerformanceData = [
    { metric: 'On-time Delivery', value: 92, target: 95, status: 'warning' },
    { metric: 'Average Transit Time', value: 2.3, target: 2.5, status: 'success', unit: 'days' },
    { metric: 'Delivery Cost per Kg', value: 420, target: 450, status: 'success', unit: 'UGX' },
    { metric: 'Vehicle Utilization', value: 84, target: 80, status: 'success', unit: '%' }
  ];
  
  const mockRoutesData = [
    { name: 'Kazo → Kampala', distance: 284, time: 5.2, efficiency: 87, volume: 4800 },
    { name: 'Buremba → Kampala', distance: 302, time: 5.5, efficiency: 82, volume: 3200 },
    { name: 'Engari → Kampala', distance: 270, time: 4.8, efficiency: 89, volume: 3850 },
    { name: 'Nkungu → Kampala', distance: 290, time: 5.3, efficiency: 85, volume: 2920 }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'in_transit':
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            In Transit
          </Badge>
        );
      case 'delayed':
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Delayed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Coffee Logistics Management
            </CardTitle>
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select 
                  className="text-sm border-0 bg-transparent focus:ring-0" 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Logistics Overview</TabsTrigger>
              <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
              <TabsTrigger value="routes">Route Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Active Shipments</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-blue-600">12</div>
                        <div className="ml-2 p-1 text-xs bg-blue-100 text-blue-800 rounded">4,650 kg</div>
                      </div>
                      <div className="flex justify-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-gray-600">8 On Time</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
                          <span className="text-gray-600">4 Delayed</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Pending Transfers</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-amber-600">7</div>
                        <div className="ml-2 p-1 text-xs bg-amber-100 text-amber-800 rounded">3,200 kg</div>
                      </div>
                      <div className="flex justify-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-amber-500 mr-1" />
                          <span className="text-gray-600">Avg. Wait: 1.8 days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-500 mb-1">Completed (This Month)</div>
                      <div className="flex items-center justify-center mb-2">
                        <div className="text-4xl font-bold text-green-600">42</div>
                        <div className="ml-2 p-1 text-xs bg-green-100 text-green-800 rounded">18,500 kg</div>
                      </div>
                      <div className="flex justify-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-gray-600">92% On-time Rate</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Transfer Volume by Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Kazo-Kanoni</div>
                          <div className="text-sm text-gray-500">4,800 kg</div>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Buremba</div>
                          <div className="text-sm text-gray-500">3,200 kg</div>
                        </div>
                        <Progress value={53} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Engari</div>
                          <div className="text-sm text-gray-500">3,850 kg</div>
                        </div>
                        <Progress value={64} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Nkungu</div>
                          <div className="text-sm text-gray-500">2,920 kg</div>
                        </div>
                        <Progress value={49} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Recent Deliveries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDeliveryData.map((delivery, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                          <div>
                            <div className="font-medium">{delivery.id}</div>
                            <div className="text-xs text-gray-500">{delivery.from} → {delivery.to}</div>
                            <div className="text-xs text-gray-400">{delivery.date} • {delivery.volume}</div>
                          </div>
                          {getStatusBadge(delivery.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Logistics Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-blue-700" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800 mb-1">AI-Driven Logistics Insights</h3>
                          <p className="text-sm text-blue-700">
                            Our analysis identifies opportunities to optimize the Buremba-Kampala route 
                            which currently has the highest cost per kg transported. Adjusting departure 
                            times to avoid peak traffic could reduce transit time by approximately 14%.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h3 className="font-medium text-green-800 mb-1">Efficiency Improvements</h3>
                        <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
                          <li>Vehicle utilization increased by 8% month-over-month</li>
                          <li>Reduced loading times at Kazo-Kanoni by 22 minutes</li>
                          <li>Consolidated 3 small shipments to optimize capacity</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <h3 className="font-medium text-amber-800 mb-1">Action Items</h3>
                        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                          <li>Schedule vehicle maintenance for Truck KBT-432R</li>
                          <li>Review delays on Engari route to identify bottlenecks</li>
                          <li>Optimize loading process at Buremba collection point</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipments" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Current Shipments Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-md h-80 flex items-center justify-center border">
                      <div className="text-center p-6">
                        <Map className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">Interactive Map View</h3>
                        <p className="text-gray-500 max-w-md">
                          Real-time tracking of coffee shipments across Uganda with route visualization 
                          and delivery status indicators.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Shipment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
                          <div className="text-sm text-blue-700 font-medium">In Transit</div>
                          <div className="text-xl font-bold text-blue-800">6</div>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-md border border-amber-100">
                          <div className="text-sm text-amber-700 font-medium">Delayed</div>
                          <div className="text-xl font-bold text-amber-800">4</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded-md border border-green-100">
                          <div className="text-sm text-green-700 font-medium">Arrived</div>
                          <div className="text-xl font-bold text-green-800">2</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {[
                          { id: 'TR-5923', from: 'Kazo-Kanoni', to: 'Kampala Warehouse', status: 'in_transit', eta: '4 hrs', progress: 72 },
                          { id: 'TR-5920', from: 'Buremba', to: 'Kampala Factory', status: 'in_transit', eta: '2 hrs', progress: 85 },
                          { id: 'TR-5916', from: 'Engari', to: 'Export Terminal', status: 'delayed', eta: '6 hrs', progress: 45 }
                        ].map((shipment, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <div className="font-medium">{shipment.id}</div>
                                <div className="text-xs text-gray-500">{shipment.from} → {shipment.to}</div>
                              </div>
                              {getStatusBadge(shipment.status)}
                            </div>
                            <div className="space-y-1 mt-2">
                              <div className="text-xs text-gray-500 flex justify-between">
                                <span>ETA: {shipment.eta}</span>
                                <span>{shipment.progress}% Complete</span>
                              </div>
                              <Progress value={shipment.progress} className="h-1.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Upcoming Scheduled Shipments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Origin</th>
                            <th className="px-4 py-3">Destination</th>
                            <th className="px-4 py-3">Volume</th>
                            <th className="px-4 py-3">Scheduled</th>
                            <th className="px-4 py-3">Driver</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { id: 'TR-5931', origin: 'Kagarama', dest: 'Kampala Warehouse', volume: '950kg', date: '2024-01-22', driver: 'A. Mugisha', status: 'scheduled' },
                            { id: 'TR-5932', origin: 'Kyampangara', dest: 'Kampala Factory', volume: '1,200kg', date: '2024-01-22', driver: 'J. Tumusiime', status: 'loading' },
                            { id: 'TR-5935', origin: 'Migina', dest: 'Export Terminal', volume: '850kg', date: '2024-01-23', driver: 'R. Kirabo', status: 'scheduled' },
                            { id: 'TR-5937', origin: 'Burunga', dest: 'Kampala Warehouse', volume: '1,100kg', date: '2024-01-23', driver: 'T. Mugume', status: 'scheduled' }
                          ].map((shipment, index) => (
                            <tr key={index} className="bg-white border-b">
                              <td className="px-4 py-3 font-medium">{shipment.id}</td>
                              <td className="px-4 py-3">{shipment.origin}</td>
                              <td className="px-4 py-3">{shipment.dest}</td>
                              <td className="px-4 py-3">{shipment.volume}</td>
                              <td className="px-4 py-3">{shipment.date}</td>
                              <td className="px-4 py-3">{shipment.driver}</td>
                              <td className="px-4 py-3">
                                <Badge className={shipment.status === 'loading' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}>
                                  {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="routes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRoutesData.map((route, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Route className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold">{route.name}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{route.distance} km • {route.time} hours avg</p>
                        </div>
                        <Badge className={`${
                          route.efficiency >= 85 ? 'bg-green-100 text-green-800' : 
                          route.efficiency >= 80 ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {route.efficiency}% Efficient
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Volume</span>
                          <span className="font-medium">{route.volume} kg</span>
                        </div>
                        <Progress value={(route.volume / 5000) * 100} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="p-2 bg-gray-50 rounded border text-center">
                            <div className="text-xs text-gray-500">Cost/kg</div>
                            <div className="font-medium">UGX 410</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded border text-center">
                            <div className="text-xs text-gray-500">Trips/Month</div>
                            <div className="font-medium">6</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Route Optimization Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-blue-700" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800 mb-1">AI Route Analysis</h3>
                          <p className="text-sm text-blue-700">
                            Our predictive model suggests consolidating Buremba and Engari shipments 
                            on select days could reduce overall logistics costs by 8-12%. This would 
                            optimize vehicle capacity utilization while maintaining delivery schedules.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h3 className="font-medium text-green-800 mb-1">Route Improvements</h3>
                        <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
                          <li>Alternative route through Kyegegwa reduces Kazo-Kampala transit by 32 min</li>
                          <li>New collection point at Rwemikoma optimizes eastern area coverage</li>
                          <li>Evening departures from Buremba avoid daytime traffic congestion</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <h3 className="font-medium text-amber-800 mb-1">Road Condition Alerts</h3>
                        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                          <li>Mbarara-Masaka section under maintenance until Jan 30</li>
                          <li>Bridge repair on Buremba route - use alternative crossing</li>
                          <li>Seasonal weather affecting Nkungu collection point access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Logistics Performance Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-2">
                      {mockPerformanceData.map((metric, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{metric.metric}</div>
                            <div className="text-sm">
                              {metric.value}{metric.unit ? ` ${metric.unit}` : '%'} 
                              <span className="text-gray-400 ml-1">/ Target: {metric.target}{metric.unit ? ` ${metric.unit}` : '%'}</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${metric.status === 'success' ? 'bg-green-500' : metric.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{width: `${(metric.value / (metric.target * 1.2)) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Transportation Fleet Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-green-50 rounded-md border border-green-100">
                          <div className="text-sm text-green-700 font-medium">Available</div>
                          <div className="text-xl font-bold text-green-800">8</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-md border border-blue-100">
                          <div className="text-sm text-blue-700 font-medium">In Use</div>
                          <div className="text-xl font-bold text-blue-800">10</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded-md border border-red-100">
                          <div className="text-sm text-red-700 font-medium">Maintenance</div>
                          <div className="text-xl font-bold text-red-800">2</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-2">
                        {[
                          { id: 'KBT-432R', type: 'Isuzu FTR', capacity: '8 tons', status: 'in_transit', location: 'Mbarara', maintenance: '25 days' },
                          { id: 'UBD-917Q', type: 'Mitsubishi Fuso', capacity: '10 tons', status: 'available', location: 'Kampala', maintenance: '12 days' },
                          { id: 'UAA-682B', type: 'Hino 300', capacity: '5 tons', status: 'maintenance', location: 'Kampala', maintenance: 'In Progress' }
                        ].map((vehicle, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{vehicle.id}</div>
                                <div className="text-xs text-gray-500">{vehicle.type} • {vehicle.capacity}</div>
                              </div>
                              <Badge className={`${
                                vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 
                                vehicle.status === 'in_transit' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {vehicle.status === 'in_transit' ? 'In Transit' : 
                                 vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>Location: {vehicle.location}</span>
                              <span>Next Maintenance: {vehicle.maintenance}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Warehouse Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                      <Warehouse className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm text-blue-700 font-medium">Average Processing Time</div>
                      <div className="text-2xl font-bold text-blue-800">1.2 days</div>
                      <div className="text-xs text-blue-600 mt-1">Target: 1.5 days</div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                      <PackageCheck className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="text-sm text-green-700 font-medium">Inventory Accuracy</div>
                      <div className="text-2xl font-bold text-green-800">98.5%</div>
                      <div className="text-xs text-green-600 mt-1">Target: 97%</div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                      <div className="text-sm text-amber-700 font-medium">Space Utilization</div>
                      <div className="text-2xl font-bold text-amber-800">82%</div>
                      <div className="text-xs text-amber-600 mt-1">Target: 85%</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-1">Performance Analysis</h3>
                    <p className="text-sm text-blue-700">
                      The Kampala warehouse has shown consistent improvement in processing times,
                      reducing average handling by 0.3 days in the past quarter. Space utilization 
                      remains a challenge due to seasonal volume fluctuations. Recommended actions 
                      include implementing dynamic storage allocation and optimizing the staging area layout.
                    </p>
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

export default LogisticsManagement;
