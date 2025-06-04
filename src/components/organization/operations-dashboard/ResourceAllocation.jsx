
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, DollarSign, Calendar } from 'lucide-react';

const ResourceAllocation = () => {
  const staffAllocation = [
    {
      department: "Cheese Production",
      allocated: 12,
      required: 15,
      shift: "Morning",
      efficiency: 87
    },
    {
      department: "Yogurt Processing",
      allocated: 8,
      required: 8,
      shift: "Morning",
      efficiency: 94
    },
    {
      department: "Coffee Processing",
      allocated: 4,
      required: 6,
      shift: "Afternoon",
      efficiency: 72
    },
    {
      department: "Quality Control",
      allocated: 6,
      required: 6,
      shift: "All Day",
      efficiency: 96
    },
    {
      department: "Packaging",
      allocated: 10,
      required: 12,
      shift: "Afternoon",
      efficiency: 82
    }
  ];

  const equipmentUtilization = [
    {
      equipment: "Pasteurizer Unit 1",
      utilization: 92,
      status: "Operational",
      nextMaintenance: "2024-02-20"
    },
    {
      equipment: "Cheese Vat A",
      utilization: 85,
      status: "Operational",
      nextMaintenance: "2024-02-25"
    },
    {
      equipment: "Coffee Roaster",
      utilization: 45,
      status: "Maintenance",
      nextMaintenance: "2024-02-16"
    },
    {
      equipment: "Packaging Line 1",
      utilization: 78,
      status: "Operational",
      nextMaintenance: "2024-03-01"
    }
  ];

  const budgetAllocation = [
    {
      category: "Raw Materials",
      allocated: 45000000,
      used: 38500000,
      percentage: 85.6
    },
    {
      category: "Labor Costs",
      allocated: 25000000,
      used: 23200000,
      percentage: 92.8
    },
    {
      category: "Equipment Maintenance",
      allocated: 8000000,
      used: 6800000,
      percentage: 85.0
    },
    {
      category: "Utilities",
      allocated: 12000000,
      used: 10900000,
      percentage: 90.8
    }
  ];

  const getStaffingStatus = (allocated, required) => {
    const percentage = (allocated / required) * 100;
    if (percentage < 80) return { status: 'Understaffed', color: 'destructive' };
    if (percentage >= 100) return { status: 'Fully Staffed', color: 'default' };
    return { status: 'Adequate', color: 'secondary' };
  };

  const getEquipmentStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'default';
      case 'Maintenance':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const formatCurrency = (amount) => {
    return `UGX ${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Allocation by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staffAllocation.map((dept, index) => {
              const staffingStatus = getStaffingStatus(dept.allocated, dept.required);
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{dept.department}</h3>
                    <Badge variant={staffingStatus.color}>{staffingStatus.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Staff</p>
                      <p className="font-medium">{dept.allocated}/{dept.required}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shift</p>
                      <p className="font-medium">{dept.shift}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Efficiency</p>
                      <p className="font-medium">{dept.efficiency}%</p>
                    </div>
                  </div>
                  
                  <Progress value={(dept.allocated / dept.required) * 100} className="h-2" />
                </div>
              );
            })}
            <Button className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Manage Staff Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Equipment Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipmentUtilization.map((equipment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{equipment.equipment}</h3>
                  <Badge variant={getEquipmentStatusColor(equipment.status)}>
                    {equipment.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span>{equipment.utilization}%</span>
                  </div>
                  <Progress value={equipment.utilization} className="h-2" />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Next Maintenance: {equipment.nextMaintenance}
                </p>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget Allocation & Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetAllocation.map((budget, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{budget.category}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{budget.percentage}%</span>
                  </div>
                  <Progress value={budget.percentage} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    <p>{formatCurrency(budget.used)} / {formatCurrency(budget.allocated)}</p>
                    <p>Remaining: {formatCurrency(budget.allocated - budget.used)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <Button className="flex-1">
              <DollarSign className="h-4 w-4 mr-2" />
              Request Budget Adjustment
            </Button>
            <Button variant="outline" className="flex-1">
              Generate Budget Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceAllocation;
