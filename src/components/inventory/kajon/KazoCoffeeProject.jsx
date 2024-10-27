import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Users, Coffee, Warehouse, Database } from 'lucide-react';

const KazoCoffeeProject = () => {
  const { toast } = useToast();

  const subCounties = [
    'Buremba', 'Burunga', 'Engari', 'Kanoni', 
    'Kazo', 'Nkungu', 'Rwemikoma', 'Kenshunga'
  ];

  const facilities = {
    'Kanoni': ['Coffee Wet Processing Facility at Katungi Farm'],
    'Buremba': ['Coffee Nursery Bed'],
    'Kazo': ['Kazo Shop - Farm Implements', 'Kazo Shop - Women\'s Clothes']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Data Submitted",
      description: "Project information has been updated successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-6 w-6" />
          Kazo Coffee Development Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="subCounty">Sub-County</Label>
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
                    <span>6 Coffee Stores</span>
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
                    {Array.from({ length: 6 }, (_, i) => (
                      <SelectItem key={i + 1} value={`store-${i + 1}`}>
                        Coffee Store {i + 1}
                      </SelectItem>
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
                <Label htmlFor="quality">Quality Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A</SelectItem>
                    <SelectItem value="B">Grade B</SelectItem>
                    <SelectItem value="C">Grade C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">Submit Project Update</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KazoCoffeeProject;