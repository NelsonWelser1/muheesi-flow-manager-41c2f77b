
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

const ComplianceMonitoring = () => {
  const complianceAreas = [
    {
      area: "Food Safety Standards (HACCP)",
      status: "Compliant",
      score: 96,
      lastAudit: "2024-05-15",
      nextReview: "2024-11-15",
      requirements: 28,
      completed: 27
    },
    {
      area: "Environmental Regulations",
      status: "Minor Issues",
      score: 88,
      lastAudit: "2024-04-20",
      nextReview: "2024-10-20",
      requirements: 22,
      completed: 19
    },
    {
      area: "Labor Standards & Safety",
      status: "Compliant",
      score: 94,
      lastAudit: "2024-03-10",
      nextReview: "2024-09-10",
      requirements: 35,
      completed: 33
    },
    {
      area: "Export/Import Regulations",
      status: "Under Review",
      score: 82,
      lastAudit: "2024-05-01",
      nextReview: "2024-08-01",
      requirements: 18,
      completed: 15
    },
    {
      area: "Financial Compliance",
      status: "Compliant",
      score: 92,
      lastAudit: "2024-04-25",
      nextReview: "2024-10-25",
      requirements: 24,
      completed: 22
    },
    {
      area: "Data Protection (GDPR)",
      status: "Action Required",
      score: 76,
      lastAudit: "2024-02-15",
      nextReview: "2024-08-15",
      requirements: 16,
      completed: 12
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'bg-green-500 text-white';
      case 'minor issues': return 'bg-yellow-500 text-white';
      case 'under review': return 'bg-blue-500 text-white';
      case 'action required': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'minor issues': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'under review': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'action required': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Compliance Monitoring</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Compliance Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceAreas.map((area, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{area.area}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(area.status)}
                  <Badge className={getStatusColor(area.status)}>
                    {area.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Compliance Score</span>
                  <span className="font-medium">{area.score}%</span>
                </div>
                <Progress value={area.score} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Requirements</p>
                  <p className="font-medium">{area.completed}/{area.requirements}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Audit</p>
                  <p className="font-medium">{area.lastAudit}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Next Review: {area.nextReview}
              </div>
              
              <Button size="sm" variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Schedule Audit
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Update Policies
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              Non-Compliance Report
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Training Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceMonitoring;
