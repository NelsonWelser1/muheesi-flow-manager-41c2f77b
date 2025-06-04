
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';

const QualityControlManagement = () => {
  const qualityTests = [
    {
      id: 1,
      batchNumber: "MCH-2024-001",
      product: "Mozzarella Cheese",
      testType: "Microbiological",
      status: "Passed",
      score: 98.5,
      inspector: "Dr. Sarah Johnson",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      batchNumber: "GCH-2024-005",
      product: "Gouda Cheese",
      testType: "Chemical Analysis",
      status: "Pending",
      score: null,
      inspector: "Lab Tech Mike",
      timestamp: "30 minutes ago"
    },
    {
      id: 3,
      batchNumber: "YOG-2024-012",
      product: "Greek Yogurt",
      testType: "Sensory Evaluation",
      status: "Passed",
      score: 96.8,
      inspector: "Chef Maria",
      timestamp: "1 hour ago"
    },
    {
      id: 4,
      batchNumber: "MLK-2024-008",
      product: "Pasteurized Milk",
      testType: "Physical Properties",
      status: "Failed",
      score: 78.2,
      inspector: "Dr. Sarah Johnson",
      timestamp: "4 hours ago"
    }
  ];

  const qualityStandards = [
    {
      category: "Microbiological Safety",
      parameters: ["E. coli", "Salmonella", "Listeria"],
      status: "Compliant",
      lastAudit: "Last week"
    },
    {
      category: "Chemical Composition",
      parameters: ["Fat content", "Protein", "Moisture"],
      status: "Compliant",
      lastAudit: "Yesterday"
    },
    {
      category: "Physical Properties",
      parameters: ["Texture", "Color", "pH level"],
      status: "Review Required",
      lastAudit: "3 days ago"
    },
    {
      category: "Sensory Quality",
      parameters: ["Taste", "Aroma", "Appearance"],
      status: "Compliant",
      lastAudit: "Today"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Passed':
      case 'Compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Review Required':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed':
      case 'Compliant':
        return 'default';
      case 'Failed':
        return 'destructive';
      case 'Review Required':
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
            <CardTitle>Recent Quality Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-semibold">{test.batchNumber}</h3>
                    <p className="text-sm text-muted-foreground">{test.product} - {test.testType}</p>
                    <p className="text-xs text-muted-foreground">
                      {test.inspector} • {test.timestamp}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {test.score && (
                    <p className="font-bold text-lg">{test.score}%</p>
                  )}
                  <Badge variant={getStatusColor(test.status)}>{test.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Standards Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityStandards.map((standard, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{standard.category}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(standard.status)}
                    <Badge variant={getStatusColor(standard.status)}>{standard.status}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Parameters: {standard.parameters.join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last audit: {standard.lastAudit}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quality Control Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Schedule QC Test
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Review Results
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Non-Conformance Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Generate QC Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControlManagement;
