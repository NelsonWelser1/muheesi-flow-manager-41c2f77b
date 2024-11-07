import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Users } from 'lucide-react';

const FarmManagement = () => {
  const { toast } = useToast();

  const subCounties = [
    'Kazo Town council', 'Buremba Town council', 'Kazo Sub county',
    'Buremba Sub county', 'Kanoni Sub county', 'Engari Sub county',
    'Kyampangara Sub county', 'Nkungu Sub county', 'Rwemikoma Sub county',
    'Burunga Sub county', 'Migina Sub county'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Data Submitted",
      description: "Farm management information has been updated successfully",
    });
  };

  return (
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
      </div>

      <Button type="submit" className="w-full">Submit Farm Update</Button>
    </form>
  );
};

export default FarmManagement;