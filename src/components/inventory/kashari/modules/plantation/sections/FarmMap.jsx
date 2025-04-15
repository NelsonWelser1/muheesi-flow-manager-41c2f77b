
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FarmMap = () => {
  const [activeView, setActiveView] = useState('satellite');
  const [selectedBlock, setSelectedBlock] = useState(null);
  
  // In a real implementation, we would use a mapping library like Mapbox or Leaflet
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Farm Map</CardTitle>
        <div className="flex space-x-2">
          <Select 
            onValueChange={(value) => setSelectedBlock(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select farm block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eastern-a">Eastern Block A</SelectItem>
              <SelectItem value="eastern-b">Eastern Block B</SelectItem>
              <SelectItem value="western-a">Western Block A</SelectItem>
              <SelectItem value="western-b">Western Block B</SelectItem>
              <SelectItem value="northern-a">Northern Block A</SelectItem>
              <SelectItem value="southern-a">Southern Block A</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            Refresh Map
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full mb-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="satellite">Satellite View</TabsTrigger>
            <TabsTrigger value="soil">Soil Map</TabsTrigger>
            <TabsTrigger value="plantation">Plantation View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full h-[600px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">Interactive Farm Map</h3>
            <p className="text-sm text-gray-500 mb-4">
              This feature will display an interactive map of your farm with detailed information about each section, 
              including crop placement, soil health, irrigation systems, and more.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium">Total Farm Area:</span> 120 acres
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium">Plantations:</span> 4 major blocks
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium">Soil Types:</span> Clay loam, Sandy loam
              </div>
              {selectedBlock && (
                <div className="bg-primary/10 p-3 rounded shadow-sm mt-4">
                  <span className="font-medium">Selected Block:</span> {selectedBlock.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmMap;
