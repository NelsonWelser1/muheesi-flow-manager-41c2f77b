
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText, Loader2 } from "lucide-react";
import PlantingHarvestingScheduleViewer from './PlantingHarvestingScheduleViewer';
import { usePlantingHarvestingSchedule } from '@/hooks/usePlantingHarvestingSchedule';
import { useFarmInformation } from '@/hooks/useFarmInformation';

const FarmOperations = ({ isKazo, selectedFarm }) => {
  const [showScheduleRecords, setShowScheduleRecords] = useState(false);
  const { scheduleData, loading, saving, error, handleInputChange, handleDateChange, handleSelectChange, setFarmName, saveSchedule } = usePlantingHarvestingSchedule(selectedFarm?.id);
  const { fetchAllFarms } = useFarmInformation();
  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(false);

  useEffect(() => {
    // Fetch farms for farm selection
    const loadFarms = async () => {
      try {
        setLoadingFarms(true);
        const farmData = await fetchAllFarms();
        setFarms(farmData);
      } catch (error) {
        console.error("Error loading farms:", error);
      } finally {
        setLoadingFarms(false);
      }
    };
    
    loadFarms();
  }, []);

  // Set farm name when selectedFarm changes
  useEffect(() => {
    if (selectedFarm) {
      setFarmName(selectedFarm.farm_name);
    }
  }, [selectedFarm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSchedule();
  };

  if (showScheduleRecords) {
    return <PlantingHarvestingScheduleViewer onBack={() => setShowScheduleRecords(false)} isKazo={isKazo} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Planting & Harvesting Schedule</h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowScheduleRecords(true)}
              >
                <FileText className="h-4 w-4" />
                View Records
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedFarm && (
                <div className="space-y-2">
                  <Label htmlFor="farm_name">Farm Name</Label>
                  <Select 
                    value={scheduleData.farm_name} 
                    onValueChange={(value) => {
                      setFarmName(value);
                      // Find farm id and set it
                      const farm = farms.find(f => f.farm_name === value);
                      if (farm) {
                        scheduleData.farm_id = farm.id;
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a farm" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingFarms ? (
                        <div className="flex justify-center items-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        farms.map((farm) => (
                          <SelectItem key={farm.id} value={farm.farm_name}>
                            {farm.farm_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="activity_type">Activity Type</Label>
                <Select 
                  value={scheduleData.activity_type} 
                  onValueChange={(value) => handleSelectChange('activity_type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planting">Planting</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleData.scheduled_date ? format(scheduleData.scheduled_date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleData.scheduled_date}
                        onSelect={(date) => handleDateChange('scheduled_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Expected Completion Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleData.expected_completion_date ? format(scheduleData.expected_completion_date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleData.expected_completion_date}
                        onSelect={(date) => handleDateChange('expected_completion_date', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="Enter any additional notes" 
                  value={scheduleData.notes || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Schedule</>
                )}
              </Button>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Labor Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Workers Required</Label>
                  <Input type="number" placeholder="Enter number of workers" />
                </div>
                <div>
                  <Label>Work Hours</Label>
                  <Input type="number" placeholder="Enter work hours" />
                </div>
              </div>
            </div>

            <Button className="w-full">Update Farm Operations</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmOperations;
