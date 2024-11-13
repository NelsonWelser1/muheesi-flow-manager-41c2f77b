import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAddKAJONCoffee } from '@/integrations/supabase/hooks/useKAJONCoffee';

const FarmManagement = ({ subCounties }) => {
  const { toast } = useToast();
  const addFarmMutation = useAddKAJONCoffee();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await addFarmMutation.mutateAsync({
        subCounty: formData.get('subCounty'),
        supervisor: formData.get('supervisor'),
        outGrowerName: formData.get('outGrowerName'),
        outGrowersCount: formData.get('outGrowersCount'),
        type: 'farm',
      });

      toast({
        title: "Success",
        description: "Farm data updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update farm data",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="subCounty">Kazo Sub-County</Label>
          <Select name="subCounty">
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
          <Input id="supervisor" name="supervisor" placeholder="Enter supervisor name" />
        </div>

        <div>
          <Label htmlFor="outGrowerName">Out-Grower Name</Label>
          <Input id="outGrowerName" name="outGrowerName" placeholder="Enter out-grower name" />
        </div>

        <div>
          <Label htmlFor="outGrowersCount">Number of Out-Growers</Label>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <Input id="outGrowersCount" name="outGrowersCount" type="number" placeholder="Enter number of out-growers" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Farm Update</Button>
    </form>
  );
};

export default FarmManagement;