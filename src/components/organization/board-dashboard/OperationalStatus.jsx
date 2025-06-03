
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Factory, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const OperationalStatus = () => {
  const operationalData = [
    {
      company: "Grand Berna Dairies",
      facilities: 8,
      capacity: 95,
      efficiency: 94,
      uptime: 98.5,
      activeProjects: 3,
      criticalAlerts: 0,
      status: "Optimal"
    },
    {
      company: "KAJON Coffee Limited",
      facilities: 5,
      capacity: 87,
      efficiency: 89,
      uptime: 96.8,
      activeProjects: 2,
      criticalAlerts: 1,
      status: "Good"
    },
    {
      company: "Kyalima Farmers Limited",
      facilities: 12,
      capacity: 82,
      efficiency: 85,
      uptime: 94.2,
      activeProjects: 4,
      criticalAlerts: 0,
      status: "Good"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Monitor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const totalFacilities = operationalData.reduce((sum, company) => sum + company.facilities, 0);
  const avgCapacity = operationalData.reduce((sum, company) => sum + company.capacity, 0) / operationalData.length;
  const avgEfficiency = operationalData.reduce((sum, company) => sum + company.efficiency, 0) / operationalData.length;
  const totalAlerts = operationalData.reduce((sum, company) => sum + company.criticalAlerts, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Total Facilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalFacilities}</p>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgCapacity.toFixed(1)}%</p>
            <p className="text-xs text-green-600">Within optimal range</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</p>
            <p className="text-xs text-green-600">Above target</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAlerts}</p>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Company Operations */}
      <div className="space-y-4">
        {operationalData.map((company, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{company.company}</CardTitle>
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Facilities</p>
                  <p className="text-xl font-bold">{company.facilities}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                  <div className="space-y-1">
                    <Progress value={company.capacity} className="h-2" />
                    <p className="text-sm font-medium">{company.capacity}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
                  <div className="space-y-1">
                    <Progress value={company.efficiency} className="h-2" />
                    <p className="text-sm font-medium">{company.efficiency}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                  <div className="space-y-1">
                    <Progress value={company.uptime} className="h-2" />
                    <p className="text-sm font-medium">{company.uptime}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {company.activeProjects}
                    <Clock className="h-4 w-4 text-blue-500" />
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    {company.criticalAlerts}
                    {company.criticalAlerts === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OperationalStatus;
