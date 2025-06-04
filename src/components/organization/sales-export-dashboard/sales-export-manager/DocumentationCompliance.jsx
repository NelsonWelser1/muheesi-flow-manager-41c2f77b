
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const DocumentationCompliance = () => {
  const exportDocuments = [
    {
      type: "Certificate of Origin",
      shipment: "SH-2024-015",
      status: "approved",
      issuedDate: "2024-06-08",
      expiryDate: "2024-12-08"
    },
    {
      type: "Phytosanitary Certificate",
      shipment: "SH-2024-016",
      status: "pending",
      issuedDate: "2024-06-10",
      expiryDate: "2024-09-10"
    },
    {
      type: "Export License",
      shipment: "SH-2024-017",
      status: "processing",
      issuedDate: "-",
      expiryDate: "2024-12-31"
    },
    {
      type: "Quality Certificate",
      shipment: "SH-2024-015",
      status: "approved",
      issuedDate: "2024-06-07",
      expiryDate: "2024-12-07"
    }
  ];

  const complianceChecklist = [
    {
      requirement: "Export Registration",
      status: "compliant",
      description: "Valid export license on file",
      deadline: "2025-03-15"
    },
    {
      requirement: "Product Certification",
      status: "compliant", 
      description: "All products certified for export",
      deadline: "2024-12-31"
    },
    {
      requirement: "Customs Documentation",
      status: "review-needed",
      description: "Update customs procedures manual",
      deadline: "2024-07-01"
    },
    {
      requirement: "Insurance Coverage",
      status: "compliant",
      description: "Export insurance policy active",
      deadline: "2025-01-15"
    },
    {
      requirement: "Banking Compliance",
      status: "action-required",
      description: "Update foreign exchange documentation",
      deadline: "2024-06-30"
    }
  ];

  const getDocStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-500 text-white';
      case 'processing': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getComplianceStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'bg-green-500 text-white';
      case 'review-needed': return 'bg-yellow-500 text-white';
      case 'action-required': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Documentation & Compliance</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Documents
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {exportDocuments.map((doc, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{doc.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      Shipment: {doc.shipment}
                    </p>
                  </div>
                  <Badge className={getDocStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Issued</p>
                    <p className="font-medium">{doc.issuedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires</p>
                    <p className="font-medium">{doc.expiryDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceChecklist.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{item.requirement}</h4>
                  <Badge className={getComplianceStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  Deadline: {item.deadline}
                </div>
                {item.status === 'action-required' && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Immediate action required
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentation Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Document Generator
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              Compliance Check
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Approval Tracker
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Alert System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationCompliance;
