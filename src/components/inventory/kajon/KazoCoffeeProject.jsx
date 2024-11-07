import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Users, Coffee, Warehouse, Database } from 'lucide-react';

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

  const coffeeGrades = {
    'robusta': [
      'Robusta Coffee: FAQ',
      'Robusta Coffee: Screen 18',
      'Robusta Coffee: Screen 15',
      'Robusta Coffee: Screen 12',
      'Robusta Coffee: Organic Robusta'
    ],
    'arabica': [
      'Arabica Coffee: Bugisu AA',
      'Arabica Coffee: Bugisu A',
      'Arabica Coffee: Bugisu PB',
      'Arabica Coffee: Bugisu B',
      'Arabica Coffee: DRUGAR',
      'Arabica Coffee: Parchment Arabica'
    ]
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
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-6 w-6" />
          Store Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Selection */}
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

              <div>
                <Label htmlFor="outGrowerName">Out-Grower Name</Label>
                <Input id="outGrowerName" placeholder="Enter out-grower name" />
              </div>

              <div>
                <Label htmlFor="outGrowers">Number of Out-Growers</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Input id="outGrowers" type="number" placeholder="Enter number of out-growers" />
                </div>
              </div>
            </div>

            {/* Facility Management */}
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

          {/* Quality Metrics */}
          <div className="space-y-4">
            <h3 className="font-medium">Quality Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input id="moisture" type="number" step="0.1" />
              </div>
              <div>
                <Label htmlFor="coffeeType">Coffee Type</Label>
                <Select onValueChange={setSelectedCoffeeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coffee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="robusta">Robusta Coffee</SelectItem>
                    <SelectItem value="arabica">Arabica Coffee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quality">Quality Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCoffeeType && coffeeGrades[selectedCoffeeType].map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Store Update</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KazoCoffeeProject;