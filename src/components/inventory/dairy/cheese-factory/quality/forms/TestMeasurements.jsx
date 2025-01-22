import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const TestMeasurements = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">Test Measurements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="pH">pH Level</Label>
            <Input
              id="pH"
              type="number"
              step="0.1"
              value={formData.pH}
              onChange={(e) => setFormData({ ...formData, pH: e.target.value })}
              required
              className="text-lg"
            />
            <p className="text-sm text-gray-500">Standard range: 5.0 - 6.5</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="moisture">Moisture Content (%)</Label>
            <Input
              id="moisture"
              type="number"
              step="0.1"
              value={formData.moisture}
              onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
              required
              className="text-lg"
            />
            <p className="text-sm text-gray-500">Standard range: 35% - 45%</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="saltContent">Salt Content (%)</Label>
            <Input
              id="saltContent"
              type="number"
              step="0.1"
              value={formData.saltContent}
              onChange={(e) => setFormData({ ...formData, saltContent: e.target.value })}
              required
              className="text-lg"
            />
            <p className="text-sm text-gray-500">Standard range: 1.5% - 2.0%</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              required
              className="text-lg"
            />
            <p className="text-sm text-gray-500">Standard range: 10°C - 15°C</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="density">Density (g/cm³)</Label>
            <Input
              id="density"
              type="number"
              step="0.001"
              value={formData.density}
              onChange={(e) => setFormData({ ...formData, density: e.target.value })}
              required
              className="text-lg"
            />
            <p className="text-sm text-gray-500">Standard range: 1.1 - 1.2</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <Label htmlFor="fatContent">Fat Content (%)</Label>
            <Input
              id="fatContent"
              type="number"
              step="0.1"
              value={formData.fatContent}
              onChange={(e) => setFormData({ ...formData, fatContent: e.target.value })}
              required
              className="text-lg"
            />
            <p className="text-sm text-gray-500">Standard range: 30% - 35%</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestMeasurements;