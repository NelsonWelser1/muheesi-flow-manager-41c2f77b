
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Users, FileText } from 'lucide-react';

const IncidentManagement = () => {
  const incidents = [
    {
      id: "INC-2024-001",
      title: "Equipment Malfunction in Production Line A",
      severity: "High",
      status: "Open",
      category: "Operational",
      reportedBy: "John Smith",
      assignedTo: "Maintenance Team",
      reportedDate: "2024-05-20",
      description: "Conveyor belt motor failure causing production delays"
    },
    {
      id: "INC-2024-002",
      title: "Minor Chemical Spill in Lab Area",
      severity: "Medium",
      status: "Under Investigation",
      category: "Safety",
      reportedBy: "Dr. Sarah Johnson",
      assignedTo: "Safety Officer",
      reportedDate: "2024-05-18",
      description: "Small chemical spill contained but requires proper cleanup"
    },
    {
      id: "INC-2024-003",
      title: "Data Backup System Failure",
      severity: "High",
      status: "Resolved",
      category: "IT Security",
      reportedBy: "IT Admin",
      assignedTo: "IT Team",
      reportedDate: "2024-05-15",
      description: "Backup system failed, restored from secondary backup"
    },
    {
      id: "INC-2024-004",
      title: "Supplier Delivery Delay",
      severity: "Low",
      status: "Open",
      category: "Supply Chain",
      reportedBy: "Procurement Manager",
      assignedTo: "Logistics Team",
      reportedDate: "2024-05-22",
      description: "Raw materials delivery delayed by 2 days due to transport issues"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'under investigation': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'under investigation': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Incident Management</h3>
        <Button>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report New Incident
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {incidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{incident.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">{incident.title}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(incident.status)}
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{incident.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{incident.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reported Date</p>
                  <p className="font-medium">{incident.reportedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reported By</p>
                  <p className="font-medium">{incident.reportedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{incident.assignedTo}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Emergency Response
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Assign Investigator
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Close Incident
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentManagement;
