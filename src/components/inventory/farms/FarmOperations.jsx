
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FileText } from "lucide-react";
import PlantingHarvestingScheduleViewer from './PlantingHarvestingScheduleViewer';

const FarmOperations = ({ isKazo, selectedFarm }) => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState({
    planting: null,
    harvesting: null,
  });
  const [showScheduleRecords, setShowScheduleRecords] = useState(false);

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Next Planting Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {schedules.planting ? format(schedules.planting, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={schedules.planting}
                      onSelect={(date) => setSchedules(prev => ({ ...prev, planting: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Expected Harvest Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {schedules.harvesting ? format(schedules.harvesting, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={schedules.harvesting}
                      onSelect={(date) => setSchedules(prev => ({ ...prev, harvesting: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Inventory Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Seeds Stock (kg)</Label>
                  <Input type="number" placeholder="Enter seeds quantity" />
                </div>
                <div>
                  <Label>Fertilizer Stock (kg)</Label>
                  <Input type="number" placeholder="Enter fertilizer quantity" />
                </div>
                <div>
                  <Label>Tools Count</Label>
                  <Input type="number" placeholder="Enter tools count" />
                </div>
              </div>
            </div>

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
