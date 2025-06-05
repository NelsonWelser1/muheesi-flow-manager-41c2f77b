
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Coffee, Thermometer, Scale } from "lucide-react";

const CoffeeProductionProcedures = () => {
  const processingStages = [
    {
      stage: "Cherry Reception",
      duration: "30-60 minutes",
      steps: [
        "Visual inspection of cherry quality",
        "Weigh incoming cherries and record",
        "Sort cherries by ripeness and quality",
        "Remove damaged or overripe cherries"
      ]
    },
    {
      stage: "Pulping Process",
      duration: "2-4 hours",
      steps: [
        "Feed cherries into pulping machine",
        "Separate pulp from beans and mucilage",
        "Grade beans by size and density",
        "Channel beans to fermentation tanks"
      ]
    },
    {
      stage: "Fermentation",
      duration: "12-48 hours",
      steps: [
        "Place beans in fermentation tanks",
        "Monitor temperature (22-25°C)",
        "Test mucilage breakdown every 6 hours",
        "Determine completion by feel test"
      ]
    },
    {
      stage: "Washing",
      duration: "1-2 hours",
      steps: [
        "Wash fermented beans thoroughly",
        "Remove remaining mucilage",
        "Grade beans through washing channels",
        "Prepare for drying process"
      ]
    },
    {
      stage: "Drying",
      duration: "5-15 days",
      steps: [
        "Spread beans on drying beds/patios",
        "Maintain proper thickness (2-3 cm)",
        "Turn beans regularly (every 2 hours)",
        "Monitor moisture content (target 10-12%)"
      ]
    },
    {
      stage: "Hulling & Grading",
      duration: "2-4 hours",
      steps: [
        "Remove parchment layer from beans",
        "Screen beans by size",
        "Sort by color and defects",
        "Package according to grade"
      ]
    }
  ];

  const qualityStandards = [
    { parameter: "Moisture Content", specification: "10-12%", testing: "Every batch" },
    { parameter: "Bean Size", specification: "Screen 14+ (AA grade)", testing: "Every lot" },
    { parameter: "Defect Count", specification: "<5 defects per 300g", testing: "Random sampling" },
    { parameter: "Color Uniformity", specification: "Blue-green, uniform", testing: "Visual inspection" },
    { parameter: "Acidity Level", specification: "pH 5.8-6.2", testing: "Sample testing" },
    { parameter: "Cup Quality", specification: "Score 80+ (SCA scale)", testing: "Cupping sessions" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-6 w-6 text-orange-600" />
                Coffee Production Standard Operating Procedures
              </CardTitle>
              <p className="text-gray-600 mt-1">Version 3.2 | Last Updated: December 2024</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
              <Coffee className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Processing Method</p>
                <p className="text-sm text-orange-600">Washed Arabica</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <Thermometer className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Fermentation Temp</p>
                <p className="text-sm text-green-600">22-25°C optimal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Scale className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Target Moisture</p>
                <p className="text-sm text-blue-600">10-12% final</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Processing Stages</h3>
            <div className="space-y-4">
              {processingStages.map((stage, index) => (
                <Card key={index} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{stage.stage}</CardTitle>
                      <Badge variant="outline">{stage.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stage.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-2">
                          <Badge variant="secondary" className="mt-0.5 text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quality Standards & Testing</h3>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Quality Parameter</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Specification</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Testing Frequency</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Grade Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {qualityStandards.map((standard, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 font-medium">{standard.parameter}</td>
                          <td className="px-4 py-3">{standard.specification}</td>
                          <td className="px-4 py-3">{standard.testing}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              Critical
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Environmental Controls:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Fermentation: 22-25°C, 70-80% RH</li>
                <li>• Drying: Ambient temp, <60% RH</li>
                <li>• Storage: 15-20°C, <60% RH</li>
                <li>• Processing area: Clean, ventilated</li>
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Equipment Maintenance:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Daily cleaning of pulping machines</li>
                <li>• Weekly calibration of scales</li>
                <li>• Monthly maintenance of drying beds</li>
                <li>• Quarterly equipment overhaul</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Traceability Requirements:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Record farm source and delivery date</li>
              <li>• Track processing batch numbers</li>
              <li>• Document all quality test results</li>
              <li>• Maintain chain of custody records</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoffeeProductionProcedures;
