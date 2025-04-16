
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Truck, ChevronDown, BarChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const InventoryProduction = ({ selectedEntity }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Inventory & Production</h3>
      
      <Tabs defaultValue="dairy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dairy">Dairy Products</TabsTrigger>
          <TabsTrigger value="coffee">Coffee</TabsTrigger>
          <TabsTrigger value="fresh">Fresh Produce</TabsTrigger>
          <TabsTrigger value="farm">Farm Produce</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dairy" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fresh Milk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450 L</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Yogurt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">870 kg</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cheese</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320 kg</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>43%</span>
                  </div>
                  <Progress value={43} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Butter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">180 kg</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center bg-gray-100 rounded-md">
                <BarChart className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Production Trend Chart</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      {i % 2 === 0 ? (
                        <Box className="h-8 w-8 p-1.5 bg-green-100 rounded-full text-green-600 mr-3" />
                      ) : (
                        <Truck className="h-8 w-8 p-1.5 bg-blue-100 rounded-full text-blue-600 mr-3" />
                      )}
                      <div>
                        <div className="font-medium">{i % 2 === 0 ? 'Production Batch' : 'Outbound Shipment'}</div>
                        <div className="text-xs text-muted-foreground">
                          {i % 2 === 0 ? 'Added to inventory' : 'Shipped to customer'} • Apr {12 + i}, 2025
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{i % 2 === 0 ? '+' : '-'}{(Math.random() * 200 + 100).toFixed(0)} units</div>
                      <div className="text-xs text-muted-foreground">
                        {i % 4 === 0 ? 'Fresh Milk' : i % 4 === 1 ? 'Yogurt' : i % 4 === 2 ? 'Cheese' : 'Butter'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coffee" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Green Beans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Roasted Beans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ground Coffee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.8 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional coffee-related content would go here */}
        </TabsContent>
        
        <TabsContent value="fresh" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avocados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.8 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pineapples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.5 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            {/* Additional fresh produce items would go here */}
          </div>
          
          {/* Additional fresh produce related content would go here */}
        </TabsContent>
        
        <TabsContent value="farm" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maize</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.4 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Beans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7 tons</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stock level</span>
                    <span>82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            {/* Additional farm produce items would go here */}
          </div>
          
          {/* Additional farm produce related content would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryProduction;
