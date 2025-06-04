
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const RiskAssessmentMatrix = () => {
  const riskCategories = [
    {
      category: "Operational",
      risks: [
        { id: 1, name: "Supply Chain Disruption", probability: "Medium", impact: "High", level: "High", status: "Active" },
        { id: 2, name: "Equipment Failure", probability: "Low", impact: "High", level: "Medium", status: "Monitored" },
        { id: 3, name: "Staff Shortage", probability: "Medium", impact: "Medium", level: "Medium", status: "Active" }
      ]
    },
    {
      category: "Financial",
      risks: [
        { id: 4, name: "Currency Fluctuation", probability: "High", impact: "Medium", level: "High", status: "Active" },
        { id: 5, name: "Credit Risk", probability: "Low", impact: "High", level: "Medium", status: "Monitored" }
      ]
    },
    {
      category: "Strategic",
      risks: [
        { id: 6, name: "Market Competition", probability: "High", impact: "High", level: "Critical", status: "Active" },
        { id: 7, name: "Regulatory Changes", probability: "Medium", impact: "Medium", level: "Medium", status: "Monitored" }
      ]
    },
    {
      category: "Compliance",
      risks: [
        { id: 8, name: "Data Privacy Breach", probability: "Low", impact: "High", level: "Medium", status: "Mitigated" },
        { id: 9, name: "Environmental Violations", probability: "Low", impact: "Medium", level: "Low", status: "Monitored" }
      ]
    }
  ];

  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'monitored': return 'bg-yellow-100 text-yellow-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Risk Assessment Matrix</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Risk
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {riskCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {category.category} Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.risks.map((risk) => (
                <div key={risk.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{risk.name}</h4>
                    <div className="flex gap-2">
                      <Badge className={getRiskLevelColor(risk.level)}>
                        {risk.level}
                      </Badge>
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Probability: {risk.probability}</div>
                    <div>Impact: {risk.impact}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Risk Assessment
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              Mitigation Plan
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Risk Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              New Risk Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentMatrix;
