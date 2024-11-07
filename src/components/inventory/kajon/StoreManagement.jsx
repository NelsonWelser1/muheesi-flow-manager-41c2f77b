import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Warehouse, Database, Users } from 'lucide-react';

const StoreManagement = () => {
  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  const coffeeTypes = ['Arabica', 'Robusta'];
  const qualityGrades = ['A', 'B', 'C', 'D'];

  return (
    <form className="space-y-6">
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
            <Label>Quality Metrics</Label>
            <div className="space-y-3 mt-2">
              <div>
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input id="moisture" type="number" placeholder="Enter moisture content" />
              </div>
              
              <div>
                <Label htmlFor="coffeeType">Coffee Type</Label>
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
                <Label htmlFor="qualityGrade">Quality Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityGrades.map(grade => (
                      <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Store Update</Button>
    </form>
  );
};

export default StoreManagement;