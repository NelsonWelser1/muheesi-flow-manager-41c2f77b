
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, Users, CheckCircle } from "lucide-react";

const MilkProductionProcedures = () => {
  const procedures = [
    {
      title: "Pre-Production Setup",
      steps: [
        "Sanitize all equipment and surfaces",
        "Check temperature controls and calibration",
        "Verify milk quality and testing results",
        "Ensure proper staff attire and hygiene"
      ]
    },
    {
      title: "Milk Reception and Testing",
      steps: [
        "Record milk delivery temperature (≤4°C)",
        "Conduct organoleptic evaluation",
        "Perform antibiotic residue testing",
        "Test for somatic cell count and bacterial count",
        "Document all test results"
      ]
    },
    {
      title: "Processing Procedures",
      steps: [
        "Pasteurization at 72°C for 15 seconds",
        "Homogenization at appropriate pressure",
        "Cooling to storage temperature",
        "Quality control testing post-processing"
      ]
    },
    {
      title: "Packaging and Storage",
      steps: [
        "Use sanitized packaging materials",
        "Maintain cold chain temperature",
        "Label with production date and batch number",
        "Store in designated refrigerated areas"
      ]
    },
    {
      title: "Cleaning and Sanitation",
      steps: [
        "CIP (Clean-in-Place) procedures",
        "Chemical concentration verification",
        "Equipment disassembly and manual cleaning",
        "Final sanitization before next production"
      ]
    }
  ];

  const qualityParameters = [
    { parameter: "Temperature", specification: "≤4°C reception, 72°C pasteurization" },
    { parameter: "pH Level", specification: "6.5 - 6.8" },
    { parameter: "Fat Content", specification: "As per product specification" },
    { parameter: "Protein Content", specification: "≥3.0%" },
    { parameter: "Somatic Cell Count", specification: "≤400,000 cells/ml" },
    { parameter: "Total Bacterial Count", specification: "≤100,000 cfu/ml" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Milk Production Standard Operating Procedures
              </CardTitle>
              <p className="text-gray-600 mt-1">Version 2.1 | Last Updated: December 2024</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Processing Time</p>
                <p className="text-sm text-blue-600">2-4 hours per batch</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Required Staff</p>
                <p className="text-sm text-green-600">3-5 operators</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">Quality Checks</p>
                <p className="text-sm text-purple-600">15 control points</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Production Procedures</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {procedures.map((procedure, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{procedure.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {procedure.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-2">
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quality Control Parameters</h3>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Parameter</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Specification</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Testing Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {qualityParameters.map((param, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 font-medium">{param.parameter}</td>
                          <td className="px-4 py-3">{param.specification}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">Standard Method</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• All procedures must be followed exactly as specified</li>
              <li>• Record all critical control points and deviations</li>
              <li>• Report any equipment malfunctions immediately</li>
              <li>• Maintain proper documentation for traceability</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkProductionProcedures;
