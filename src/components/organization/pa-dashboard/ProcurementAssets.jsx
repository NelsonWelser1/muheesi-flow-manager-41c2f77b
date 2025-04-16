
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Truck, Package, Building, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ProcurementAssets = ({ selectedEntity }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Procurement & Assets</h3>
      
      <Tabs defaultValue="procurement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="assets">Fixed Assets</TabsTrigger>
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="procurement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  Orders MTD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Total value: UGX 45.2M</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Pending Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Next delivery: Tomorrow</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Active Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">+3 since last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Total Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX 850M</div>
                <p className="text-xs text-muted-foreground">+12.3% YTD</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-medium">PO-2025-{i.toString().padStart(4, '0')}</div>
                      <div className="text-sm text-muted-foreground">
                        {i % 2 === 0 ? 'Packaging Materials' : 'Raw Materials'} • {i % 3 === 0 ? 'Grand Berna Dairies' : 'KAJON Coffee Limited'}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={i % 3 === 0 ? "outline" : i % 3 === 1 ? "default" : "secondary"}>
                        {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Approved" : "Delivered"}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">Apr {5 + i}, 2025</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fixed Assets Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <div>
                      <div className="font-medium">Asset #{i.toString().padStart(4, '0')}</div>
                      <div className="text-sm text-muted-foreground">
                        {i % 3 === 0 ? 'Land' : i % 3 === 1 ? 'Equipment' : 'Vehicle'} • 
                        {i % 4 === 0 ? ' Grand Berna Dairies' : i % 4 === 1 ? ' KAJON Coffee Limited' : i % 4 === 2 ? ' Bukomero Dairy Farm' : ' Fresheco Farming'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">UGX {(Math.random() * 100 + 50).toFixed(1)}M</div>
                      <div className="text-sm text-muted-foreground">Acquired: {2023 - (i % 3)} / {i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="po" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Draft</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Pending Approval</div>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">5</div>
                    <div className="text-xs text-muted-foreground">Processing</div>
                  </div>
                  <div className="bg-green-100 p-4 rounded-md text-center">
                    <div className="text-lg font-bold">18</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Upcoming Deliveries</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-3 border rounded-md">
                        <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                        <div>
                          <div className="font-medium">PO-2025-{(i + 10).toString().padStart(4, '0')}</div>
                          <div className="text-sm text-muted-foreground">
                            Expected: Apr {16 + i}, 2025 • Vendor: Supplier {i}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementAssets;
