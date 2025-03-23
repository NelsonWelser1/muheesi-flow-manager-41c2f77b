
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import FarmRecordsViewer from './FarmRecordsViewer';
import { useFarmInformation } from '@/hooks/useFarmInformation';

const FarmDetails = ({ isKazo, selectedFarm }) => {
  const [showRecordsViewer, setShowRecordsViewer] = useState(false);
  
  const {
    formData,
    loading,
    saving,
    error,
    handleInputChange,
    handleSelectChange,
    saveFarmInformation
  } = useFarmInformation(selectedFarm?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveFarmInformation();
  };

  if (showRecordsViewer) {
    return <FarmRecordsViewer onBack={() => setShowRecordsViewer(false)} isKazo={isKazo} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Farm Information</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowRecordsViewer(true)}
            >
              <FileText className="h-4 w-4" />
              View Records
            </Button>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager_name">Farm Manager</Label>
                <Input
                  id="manager_name"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleInputChange}
                  placeholder="Enter farm manager name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="supervisor_name">Farm Supervisor</Label>
                <Input
                  id="supervisor_name"
                  name="supervisor_name"
                  value={formData.supervisor_name}
                  onChange={handleInputChange}
                  placeholder="Enter farm supervisor name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="farm_name">Farm Name</Label>
                <Input
                  id="farm_name"
                  name="farm_name"
                  value={formData.farm_name}
                  onChange={handleInputChange}
                  placeholder="Enter farm name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="coffee_type">Coffee Type</Label>
                <Select
                  name="coffee_type"
                  value={formData.coffee_type}
                  onValueChange={(value) => handleSelectChange('coffee_type', value)}
                  required
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
                <Label htmlFor="farm_size">Farm Size (Acres)</Label>
                <Input
                  id="farm_size"
                  name="farm_size"
                  type="number"
                  value={formData.farm_size}
                  onChange={handleInputChange}
                  placeholder="Enter farm size"
                  required
                  min="0.1"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Production Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="daily_production">Daily Production (kg)</Label>
                  <Input
                    id="daily_production"
                    name="daily_production"
                    type="number"
                    value={formData.daily_production}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="weekly_production">Weekly Production (kg)</Label>
                  <Input
                    id="weekly_production"
                    name="weekly_production"
                    type="number"
                    value={formData.weekly_production}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="monthly_production">Monthly Production (kg)</Label>
                  <Input
                    id="monthly_production"
                    name="monthly_production"
                    type="number"
                    value={formData.monthly_production}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="quarterly_production">Quarterly Production (kg)</Label>
                  <Input
                    id="quarterly_production"
                    name="quarterly_production"
                    type="number"
                    value={formData.quarterly_production}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label htmlFor="annual_production">Annual Production (kg)</Label>
                  <Input
                    id="annual_production"
                    name="annual_production"
                    type="number"
                    value={formData.annual_production}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Save Farm Details</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmDetails;
