import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Warehouse, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmManagement from './FarmManagement';

const KazoCoffeeProject = () => {
  const { toast } = useToast();
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('');

  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  const coffeeStores = {
    'Kanoni Sub county': ['Mbogo Store', 'Rwakahaya Store'],
    'Engari Sub county': ['Kaichumu store', 'Kyengando store'],
    'Migina Sub county': ['Migina store'],
    'Nkungu Sub county': ['Kagarama store'],
    'Kyampangara Sub county': ['Kyampangara Store']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Data Submitted",
      description: "Store management information has been updated successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kazo Coffee Development Project</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="store" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="store">Store Management</TabsTrigger>
            <TabsTrigger value="farm">Farm & Farmer Management</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subCounty">Kazo Sub-County</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-county" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCounties.map(county => (
                          <SelectItem key={county} value={county}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {county}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="supervisor">Coffee Supervisor</Label>
                    <Input id="supervisor" placeholder="Enter supervisor name" />
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

                  <div>
                    <Label htmlFor="store">Coffee Store Assignment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(coffeeStores).map(([district, stores]) => (
                          stores.map(store => (
                            <SelectItem key={store} value={store}>
                              {store} ({district})
                            </SelectItem>
                          ))
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Submit Store Update</Button>
            </form>
          </TabsContent>

          <TabsContent value="farm">
            <FarmManagement />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KazoCoffeeProject;