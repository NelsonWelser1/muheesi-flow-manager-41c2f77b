
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

const MaintenanceScheduling = () => {
  const maintenanceSchedule = [
    {
      id: 1,
      equipment: "Cheese Production Line A",
      type: "Preventive Maintenance",
      priority: "Medium",
      scheduledDate: "2024-01-15",
      estimatedDuration: "4 hours",
      assignedTo: "Tech Team Alpha",
      status: "Scheduled"
    },
    {
      id: 2,
      equipment: "Pasteurization Unit",
      type: "Emergency Repair",
      priority: "High",
      scheduledDate: "2024-01-10",
      estimatedDuration: "2 hours",
      assignedTo: "Emergency Team",
      status: "In Progress"
    },
    {
      id: 3,
      equipment: "Yogurt Processing Line",
      type: "Routine Inspection",
      priority: "Low",
      scheduledDate: "2024-01-12",
      estimatedDuration: "1 hour",
      assignedTo: "Inspector John",
      status: "Completed"
    },
    {
      id: 4,
      equipment: "Packaging Machine #2",
      type: "Component Replacement",
      priority: "Medium",
      scheduledDate: "2024-01-18",
      estimatedDuration: "6 hours",
      assignedTo: "Tech Team Beta",
      status: "Scheduled"
    },
    {
      id: 5,
      equipment: "Coffee Processing Unit",
      type: "Major Overhaul",
      priority: "High",
      scheduledDate: "2024-01-08",
      estimatedDuration: "2 days",
      assignedTo: "Specialist Team",
      status: "In Progress"
    }
  ];

  const equipmentStatus = [
    {
      name: "Cheese Production Line A",
      status: "Operational",
      uptime: "98.5%",
      lastMaintenance: "2 weeks ago",
      nextMaintenance: "In 2 weeks"
    },
    {
      name: "Cheese Production Line B",
      status: "Operational",
      uptime: "95.2%",
      lastMaintenance: "1 month ago",
      nextMaintenance: "Next week"
    },
    {
      name: "Yogurt Processing Line",
      status: "Operational",
      uptime: "97.8%",
      lastMaintenance: "3 days ago",
      nextMaintenance: "In 1 month"
    },
    {
      name: "Pasteurization Unit",
      status: "Under Repair",
      uptime: "89.3%",
      lastMaintenance: "Today",
      nextMaintenance: "TBD"
    },
    {
      name: "Coffee Processing Unit",
      status: "Under Maintenance",
      uptime: "85.7%",
      lastMaintenance: "Today",
      nextMaintenance: "TBD"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Under Repair':
      case 'Under Maintenance':
        return <Settings className="h-4 w-4 text-orange-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
      case 'Operational':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Under Repair':
      case 'Under Maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceSchedule.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{item.equipment}</h3>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">{item.scheduledDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{item.estimatedDuration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{item.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
                    <Badge variant={getPriorityColor(item.priority)} size="sm">{item.priority}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Equipment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipmentStatus.map((equipment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{equipment.name}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(equipment.status)}
                    <Badge variant={getStatusColor(equipment.status)}>{equipment.status}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-medium">{equipment.uptime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Maintenance</p>
                    <p className="font-medium">{equipment.lastMaintenance}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Next Maintenance</p>
                    <p className="font-medium">{equipment.nextMaintenance}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Schedule Maintenance
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Report Issue
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              Equipment Settings
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Maintenance History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceScheduling;
