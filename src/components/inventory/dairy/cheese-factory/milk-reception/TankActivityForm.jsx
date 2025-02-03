import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMilkReception } from '@/hooks/useMilkReception';

const TankActivityForm = () => {
  const { toast } = useToast();
  const { addMilkReception } = useMilkReception();
  const [formData, setFormData] = useState({
    tank_number: '',
    activity_type: '',
    milk_volume: '',
    temperature: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        milk_volume: parseFloat(formData.milk_volume),
        temperature: parseFloat(formData.temperature),
        supplier_name: formData.activity_type === 'offload' ? `Offload from ${formData.tank_number}` : 'Tank Reception',
      };

      await addMilkReception.mutateAsync(data);

      toast({
        title: "Success",
        description: "Tank activity recorded successfully",
      });

      setFormData({
        tank_number: '',
        activity_type: '',
        milk_volume: '',
        temperature: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record tank activity",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Tank Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tank_number">Tank</Label>
              <Select 
                value={formData.tank_number}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tank_number: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tank A">Tank A</SelectItem>
                  <SelectItem value="Tank B">Tank B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_type">Activity Type</Label>
              <Select
                value={formData.activity_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receive">Receive Milk</SelectItem>
                  <SelectItem value="offload">Offload Milk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="milk_volume">Volume (L)</Label>
              <Input
                id="milk_volume"
                name="milk_volume"
                type="number"
                value={formData.milk_volume}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes"
            />
          </div>

          <Button type="submit" className="w-full">
            Record Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TankActivityForm;