import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FarmSupervisor = () => {
  const [formData, setFormData] = useState({
    farmerName: '',
    farmName: '',
    farmSize: '',
    activity: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegisterFarm = (e) => {
    e.preventDefault();
    console.log("Registering farm:", formData);
    // Implement farm registration logic
  };

  const handleMonitorFarmingPractices = () => {
    console.log("Monitoring farming practices...");
    // Implement farming practices monitoring logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Farm Supervisor Responsibilities</h3>
      
      <form onSubmit={handleRegisterFarm}>
        <Label htmlFor="farmerName">Farmer Name</Label>
        <Input id="farmerName" name="farmerName" value={formData.farmerName} onChange={handleInputChange} required />
        
        <Label htmlFor="farmName">Farm Name</Label>
        <Input id="farmName" name="farmName" value={formData.farmName} onChange={handleInputChange} required />
        
        <Label htmlFor="farmSize">Farm Size (acres)</Label>
        <Input id="farmSize" name="farmSize" type="number" value={formData.farmSize} onChange={handleInputChange} required />
        
        <Label htmlFor="activity">Farm Activity</Label>
        <Select name="activity" onValueChange={(value) => handleInputChange({ target: { name: 'activity', value } })} required>
          <SelectTrigger>
            <SelectValue placeholder="Select an activity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planting">Planting</SelectItem>
            <SelectItem value="harvesting">Harvesting</SelectItem>
            <SelectItem value="pruning">Pruning</SelectItem>
          </SelectContent>
        </Select>
        
        <Button type="submit">Register Farm</Button>
      </form>
      
      <Button onClick={handleMonitorFarmingPractices}>Monitor Farming Practices</Button>
      {/* Add more buttons or forms for other responsibilities */}
    </div>
  );
};

export default FarmSupervisor;