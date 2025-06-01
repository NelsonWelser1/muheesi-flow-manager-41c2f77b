
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const UrgentTasks = ({ urgentTasks, onScheduleMaintenance }) => {
  if (urgentTasks.length === 0) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="flex flex-row items-center space-y-0">
        <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
        <CardTitle>Urgent Maintenance Required</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {urgentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <div>
                <h4 className="font-medium">{task.equipment_name}</h4>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(task.next_maintenance).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onScheduleMaintenance(task.id)}
              >
                Schedule Now
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentTasks;
