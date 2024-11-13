import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Warehouse, Database } from "lucide-react";
import ViewCurrentStock from '../ViewCurrentStock';
import MakeReports from '../MakeReports';
import ManageFarms from '../ManageFarms';
import ManageAssociations from '../ManageAssociations';
import MakeRequisitions from '../MakeRequisitions';

const KazoCoffeeProject = () => {
  const [activeTab, setActiveTab] = useState('store');

  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  const coffeeTypes = ['Arabica', 'Robusta'];
  
  const qualityGrades = {
    Arabica: ['Bugisu AA', 'Bugisu A', 'Bugisu PB', 'Bugisu B', 'DRUGAR', 'Parchment Arabica'],
    Robusta: ['FAQ', 'Screen 18', 'Screen 15', 'Screen 12', 'Organic Robusta']
  };

  return (
    <Tabs defaultValue="update-stock" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap md:flex-wrap">
        <TabsTrigger value="update-stock">Update Stock</TabsTrigger>
        <TabsTrigger value="view-stock">View Stock</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="farms">Farms</TabsTrigger>
        <TabsTrigger value="associations">Associations</TabsTrigger>
        <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
      </TabsList>

      <TabsContent value="update-stock">
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'store' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('store')}
              className="bg-navy-900"
            >
              Store Management
            </Button>
            <Button 
              variant={activeTab === 'farm' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('farm')}
            >
              Farm Management
            </Button>
          </div>

          {activeTab === 'store' ? (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Kazo Sub-County</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-county" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCounties.map(county => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Coffee Supervisor</Label>
                    <Input placeholder="Enter supervisor name" />
                  </div>

                  <div>
                    <Label>Out-Grower Name</Label>
                    <Input placeholder="Enter out-grower name" />
                  </div>

                  <div>
                    <Label>Number of Out-Growers</Label>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <Input type="number" placeholder="Enter number of out-growers" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Available Facilities</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Warehouse className="h-4 w-4" />
                        <span>7 Coffee Stores</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Database className="h-4 w-4" />
                        <span>2 Data Centers (Managed by Anatory and Eliab)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Moisture Content (%)</Label>
                      <Input type="number" placeholder="Enter moisture content" />
                    </div>
                    
                    <div>
                      <Label>Coffee Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coffee type" />
                        </SelectTrigger>
                        <SelectContent>
                          {coffeeTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Quality Grade</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {qualityGrades.Arabica.map(grade => (
                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Quantity (kg)</Label>
                      <Input type="number" placeholder="Enter quantity" />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Submit Store Update</Button>
            </form>
          ) : (
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Kazo Sub-County</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-county" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCounties.map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Out-Grower Name</Label>
                  <Input placeholder="Enter out-grower name" />
                </div>

                <div>
                  <Label>Coffee Supervisor</Label>
                  <Input placeholder="Enter supervisor name" />
                </div>

                <div>
                  <Label>Number of Out-Growers</Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <Input type="number" placeholder="Enter number of out-growers" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Submit Farm Update</Button>
            </form>
          )}
        </div>
      </TabsContent>

      <TabsContent value="view-stock">
        <ViewCurrentStock />
      </TabsContent>

      <TabsContent value="reports">
        <MakeReports />
      </TabsContent>

      <TabsContent value="farms">
        <ManageFarms />
      </TabsContent>

      <TabsContent value="associations">
        <ManageAssociations />
      </TabsContent>

      <TabsContent value="requisitions">
        <MakeRequisitions />
      </TabsContent>
    </Tabs>
  );
};

export default KazoCoffeeProject;