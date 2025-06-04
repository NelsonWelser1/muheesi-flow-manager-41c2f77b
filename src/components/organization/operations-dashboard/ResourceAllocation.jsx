
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, Clock, Calendar, Settings } from 'lucide-react';

const ResourceAllocation = () => {
  const resources = [
    {
      department: "Cheese Production",
      allocated: 12,
      available: 15,
      utilization: 80,
      shift: "Morning"
    },
    {
      department: "Yogurt Processing",
      allocated: 8,
      available: 10,
      utilization: 80,
      shift: "Morning"
    },
    {
      department: "Coffee Processing",
      allocated: 0,
      available: 6,
      utilization: 0,
      shift: "Maintenance"
    },
    {
      department: "Quality Control",
      allocated: 4,
      available: 5,
      utilization: 80,
      shift: "Full Day"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resource Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.map((resource, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{resource.department}</h3>
                <span className="text-sm text-muted-foreground">{resource.shift} Shift</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Allocated</p>
                  <p className="font-bold">{resource.allocated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="font-bold">{resource.available}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                  <p className="font-bold">{resource.utilization}%</p>
                </div>
              </div>
              
              <Progress value={resource.utilization} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-16 flex-col">
          <Calendar className="h-5 w-5 mb-1" />
          Schedule Resources
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Clock className="h-5 w-5 mb-1" />
          Shift Planning
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Settings className="h-5 w-5 mb-1" />
          Optimize Allocation
        </Button>
      </div>
    </div>
  );
};

export default ResourceAllocation;
