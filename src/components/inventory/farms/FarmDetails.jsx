import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FarmDetails = ({ isKazo, selectedFarm }) => {
  const [formData, setFormData] = useState({
    managerName: '',
    supervisorName: '',
    farmName: '',
    coffeeType: '',
    farmSize: '',
    dailyProduction: '',
    weeklyProduction: '',
    monthlyProduction: '',
    quarterlyProduction: '',
    annualProduction: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managerName">Farm Manager</Label>
                <Input
                  id="managerName"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  placeholder="Enter farm manager name"
                />
              </div>

              <div>
                <Label htmlFor="supervisorName">Farm Supervisor</Label>
                <Input
                  id="supervisorName"
                  name="supervisorName"
                  value={formData.supervisorName}
                  onChange={handleInputChange}
                  placeholder="Enter farm supervisor name"
                />
              </div>

              <div>
                <Label htmlFor="farmName">Farm Name</Label>
                <Input
                  id="farmName"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  placeholder="Enter farm name"
                />
              </div>

              <div>
                <Label htmlFor="coffeeType">Coffee Type</Label>
                <Select
                  name="coffeeType"
                  onValueChange={(value) => handleInputChange({ target: { name: 'coffeeType', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coffee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arabica">Arabica</SelectItem>
                    <SelectItem value="robusta">Robusta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="farmSize">Farm Size (Acres)</Label>
                <Input
                  id="farmSize"
                  name="farmSize"
                  type="number"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  placeholder="Enter farm size"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Production Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dailyProduction">Daily Production (kg)</Label>
                  <Input
                    id="dailyProduction"
                    name="dailyProduction"
                    type="number"
                    value={formData.dailyProduction}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="weeklyProduction">Weekly Production (kg)</Label>
                  <Input
                    id="weeklyProduction"
                    name="weeklyProduction"
                    type="number"
                    value={formData.weeklyProduction}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyProduction">Monthly Production (kg)</Label>
                  <Input
                    id="monthlyProduction"
                    name="monthlyProduction"
                    type="number"
                    value={formData.monthlyProduction}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="quarterlyProduction">Quarterly Production (kg)</Label>
                  <Input
                    id="quarterlyProduction"
                    name="quarterlyProduction"
                    type="number"
                    value={formData.quarterlyProduction}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="annualProduction">Annual Production (kg)</Label>
                  <Input
                    id="annualProduction"
                    name="annualProduction"
                    type="number"
                    value={formData.annualProduction}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">Save Farm Details</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmDetails;