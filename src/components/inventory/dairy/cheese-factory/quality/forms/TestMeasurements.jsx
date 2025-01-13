import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TestMeasurements = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="pH">pH Level</Label>
        <Input
          id="pH"
          type="number"
          step="0.1"
          value={formData.pH}
          onChange={(e) => setFormData({ ...formData, pH: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="moisture">Moisture Content (%)</Label>
        <Input
          id="moisture"
          type="number"
          step="0.1"
          value={formData.moisture}
          onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="saltContent">Salt Content (%)</Label>
        <Input
          id="saltContent"
          type="number"
          step="0.1"
          value={formData.saltContent}
          onChange={(e) => setFormData({ ...formData, saltContent: e.target.value })}
          required
        />
      </div>
    </div>
  );
};

export default TestMeasurements;