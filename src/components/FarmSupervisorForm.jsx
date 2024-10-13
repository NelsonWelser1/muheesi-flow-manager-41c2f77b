import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const FarmSupervisorForm = () => {
  const [formData, setFormData] = useState({
    responsibility: '',
    farmer_name: '',
    farm_name: '',
    phone_number: '',
    farm_size: '',
    gps_location: '',
    farm_activity: '',
    farm_compliance_standards: '',
    crop_health: '',
    soil_conditions: '',
    moisture_content: '',
    fertilizer_used: '',
    harvest_estimates: '',
    transportation_method: '',
    coffee_bean_quality: '',
    coffee_bean_quantity: '',
    quality_standards: '',
    projected_harvest_volumes: '',
    batch_processing_schedule: '',
    farm_inputs: '',
    inventory_update_log: '',
    farmer_feedback: '',
    farm_manager_directives: '',
    communication_channel: '',
    compliance_checklist: '',
    farm_safety_standards: '',
    mobile_app_usage_guidelines: '',
    training_materials: '',
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
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server or perform other actions
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="responsibility">Responsibility</Label>
        <Select name="responsibility" onValueChange={(value) => handleInputChange({ target: { name: 'responsibility', value } })} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a responsibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="farm_registration">Farm and Farmer Registration</SelectItem>
            <SelectItem value="monitoring_practices">Monitoring Coffee Farming Practices</SelectItem>
            <SelectItem value="data_collection">Data Collection and Reporting</SelectItem>
            <SelectItem value="logistics">Logistics Coordination</SelectItem>
            <SelectItem value="quality_control">Quality Control</SelectItem>
            <SelectItem value="scheduling">Scheduling and Forecasting</SelectItem>
            <SelectItem value="inventory">Inventory Tracking</SelectItem>
            <SelectItem value="communication">Communication and Feedback</SelectItem>
            <SelectItem value="health_safety">Health, Safety, and Compliance</SelectItem>
            <SelectItem value="technology">Technology Use and Training</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamically render input fields based on selected responsibility */}
      {formData.responsibility === 'farm_registration' && (
        <>
          <Input name="farmer_name" placeholder="Farmer Name" onChange={handleInputChange} required />
          <Input name="farm_name" placeholder="Farm Name" onChange={handleInputChange} required />
          <Input name="phone_number" placeholder="Phone Number" onChange={handleInputChange} required />
          <Input name="farm_size" placeholder="Farm Size" onChange={handleInputChange} required />
          <Input name="gps_location" placeholder="GPS Location" onChange={handleInputChange} required />
        </>
      )}

      {formData.responsibility === 'monitoring_practices' && (
        <>
          <Input name="farm_activity" placeholder="Farm Activity" onChange={handleInputChange} required />
          <Textarea name="farm_compliance_standards" placeholder="Farm Compliance Standards" onChange={handleInputChange} required />
        </>
      )}

      {/* Add similar conditional rendering for other responsibilities */}

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default FarmSupervisorForm;