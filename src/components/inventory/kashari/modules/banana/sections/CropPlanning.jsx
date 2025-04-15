
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const produceTypes = [
  { name: 'Bananas', varieties: ['Bogoya', 'Gonja', 'Kibuzi', 'Ndizi'] },
  { name: 'Coffee', varieties: ['Arabica', 'Robusta'] },
  { name: 'Maize', varieties: ['Longe 5', 'Longe 7', 'Hybrid', 'Open-Pollinated'] },
  { name: 'Beans', varieties: ['K132', 'Nambale', 'NABE 15', 'NABE 16'] },
];

const CropPlanning = () => {
  const [selectedProduce, setSelectedProduce] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  
  // Get varieties for the selected produce
  const varieties = produceTypes.find(p => p.name.toLowerCase() === selectedProduce.toLowerCase())?.varieties || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Produce Type</label>
              <Select onValueChange={setSelectedProduce}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a produce type" />
                </SelectTrigger>
                <SelectContent>
                  {produceTypes.map(type => (
                    <SelectItem key={type.name} value={type.name.toLowerCase()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedProduce && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Variety</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {varieties.map(variety => (
                      <SelectItem key={variety} value={variety.toLowerCase()}>
                        {variety}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {selectedProduce && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="current">Current Season</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="space-y-4">
                <div className="bg-background p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-2">Current {selectedProduce} Plantation Status</h3>
                  <p className="mb-3">Detailed information about current plantations will be displayed here.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm opacity-70">Total Area</div>
                      <div className="text-2xl font-semibold">5.2 Acres</div>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm opacity-70">Plants Count</div>
                      <div className="text-2xl font-semibold">1,250</div>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <div className="text-sm opacity-70">Est. Harvest Date</div>
                      <div className="text-2xl font-semibold">Jun 2025</div>
                    </div>
                  </div>
                </div>
                <Button>View Detailed Report</Button>
              </TabsContent>
              
              <TabsContent value="planning" className="space-y-4">
                <div className="bg-background p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-2">Plan New Plantation</h3>
                  <p>Planning tools and scheduling options will be implemented here.</p>
                  <div className="flex justify-end mt-4">
                    <Button className="ml-auto">Create New Plan</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="bg-background p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-2">Plantation History</h3>
                  <p>Historical plantation data and performance metrics will be displayed here.</p>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline">Export History</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {!selectedProduce && (
            <div className="bg-muted p-8 rounded-md text-center">
              <p className="text-muted-foreground">Select a produce type to view and plan your crops</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CropPlanning;
