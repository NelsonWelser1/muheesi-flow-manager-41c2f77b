
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart2, Tractor } from "lucide-react";

const CropPlanning = () => {
  const [activeTab, setActiveTab] = React.useState("calendar");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crop Planning</CardTitle>
          <Button>Create New Plan</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="forecast">
                <BarChart2 className="h-4 w-4 mr-2" />
                Yield Forecast
              </TabsTrigger>
              <TabsTrigger value="resources">
                <Tractor className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="p-4 border rounded-md">
              <div className="h-96 flex flex-col justify-center items-center text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Planting Calendar</h3>
                <p className="text-muted-foreground">
                  This will display the planting and harvesting schedule for banana crops
                  across different sections of the plantation.
                </p>
                <Button className="mt-4">View Full Calendar</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="forecast" className="p-4 border rounded-md">
              <div className="h-96 flex flex-col justify-center items-center text-center">
                <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Yield Forecast</h3>
                <p className="text-muted-foreground">
                  Projected harvest volumes and revenue based on current plantation data and historical performance.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="p-4 border rounded-md">
              <div className="h-96 flex flex-col justify-center items-center text-center">
                <Tractor className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Resource Planning</h3>
                <p className="text-muted-foreground">
                  Plan and allocate resources including labor, equipment, fertilizers, and other supplies
                  needed for optimal plantation management.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Planting - Section B2</p>
                  <p className="text-sm text-muted-foreground">300 suckers</p>
                </div>
                <span className="text-sm">Apr 28, 2025</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Fertilizer Application - Section A</p>
                  <p className="text-sm text-muted-foreground">NPK treatment</p>
                </div>
                <span className="text-sm">May 2, 2025</span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Irrigation System Maintenance</p>
                  <p className="text-sm text-muted-foreground">All sections</p>
                </div>
                <span className="text-sm">May 5, 2025</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Banana Varieties</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Gonja (Plantain)</p>
                  <p className="text-sm text-muted-foreground">Sections A1, B3</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">High Yield</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Bogoya (Gros Michel)</p>
                  <p className="text-sm text-muted-foreground">Sections A2, C1</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Export Grade</span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Ndizi (Apple Banana)</p>
                  <p className="text-sm text-muted-foreground">Section B2</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Premium</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropPlanning;
