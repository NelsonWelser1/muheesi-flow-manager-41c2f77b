import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FarmManager = () => {
  const [formData, setFormData] = useState({
    farmName: '',
    cropType: '',
    harvestEstimate: '',
    activityReport: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Farm report:", formData);
    // Implement farm report submission logic
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Farm Manager</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="farmName">Farm Name</Label>
          <Input id="farmName" name="farmName" value={formData.farmName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="cropType">Crop Type</Label>
          <Input id="cropType" name="cropType" value={formData.cropType} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="harvestEstimate">Harvest Estimate (kg)</Label>
          <Input id="harvestEstimate" name="harvestEstimate" type="number" value={formData.harvestEstimate} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="activityReport">Activity Report</Label>
          <Textarea id="activityReport" name="activityReport" value={formData.activityReport} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Submit Farm Report</Button>
      </form>
    </div>
  );
};

export default FarmManager;