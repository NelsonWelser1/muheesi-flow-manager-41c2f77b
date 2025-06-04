
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const TaxCompliance = () => {
  const taxObligations = [
    {
      type: "VAT Return",
      dueDate: "2024-06-15",
      status: "pending",
      amount: 125000,
      period: "May 2024"
    },
    {
      type: "Corporate Income Tax",
      dueDate: "2024-07-30",
      status: "in-progress",
      amount: 285000,
      period: "Q2 2024"
    },
    {
      type: "PAYE",
      dueDate: "2024-06-05",
      status: "overdue",
      amount: 45000,
      period: "May 2024"
    },
    {
      type: "Withholding Tax",
      dueDate: "2024-06-10",
      status: "completed",
      amount: 18000,
      period: "May 2024"
    }
  ];

  const complianceItems = [
    {
      item: "Financial Records Retention",
      status: "compliant",
      nextReview: "2024-12-31",
      description: "7-year retention policy implemented"
    },
    {
      item: "Audit Trail Documentation",
      status: "compliant",
      nextReview: "2024-08-15",
      description: "Complete transaction tracking"
    },
    {
      item: "Tax Registration Updates",
      status: "action-required",
      nextReview: "2024-06-30",
      description: "Business license renewal due"
    },
    {
      item: "International Transfer Pricing",
      status: "review-needed",
      nextReview: "2024-09-01",
      description: "Annual documentation update"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'compliant':
        return 'bg-green-500 text-white';
      case 'in-progress':
        return 'bg-blue-500 text-white';
      case 'pending':
      case 'review-needed':
        return 'bg-yellow-500 text-white';
      case 'overdue':
      case 'action-required':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Tax & Compliance Management</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Compliance Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tax Obligations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {taxObligations.map((tax, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{tax.type}</h4>
                    <p className="text-sm text-muted-foreground">{tax.period}</p>
                  </div>
                  <Badge className={getStatusColor(tax.status)}>
                    {tax.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    ${tax.amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Due: {tax.dueDate}
                  </span>
                </div>
                {tax.status === 'overdue' && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Immediate attention required
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{item.item}</h4>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  Next Review: {item.nextReview}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              File Returns
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              Compliance Check
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Risk Assessment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="h-6 w-6 mb-2" />
              Audit Preparation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCompliance;
