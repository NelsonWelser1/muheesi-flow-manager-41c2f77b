
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, Thermometer, Droplets } from "lucide-react";

const CheeseProductionProcedures = () => {
  const productionStages = [
    {
      stage: "Milk Preparation",
      duration: "30-45 minutes",
      steps: [
        "Heat milk to 32°C (90°F)",
        "Add calcium chloride if using pasteurized milk",
        "Test and adjust milk acidity if needed",
        "Add starter culture and mix gently"
      ]
    },
    {
      stage: "Coagulation",
      duration: "45-60 minutes",
      steps: [
        "Add rennet and mix for 30 seconds",
        "Allow milk to set undisturbed",
        "Test for clean break",
        "Cut curd into uniform pieces"
      ]
    },
    {
      stage: "Cooking and Draining",
      duration: "60-90 minutes",
      steps: [
        "Gradually heat curds to final temperature",
        "Stir gently to prevent matting",
        "Drain whey when curds reach proper moisture",
        "Test curd moisture content"
      ]
    },
    {
      stage: "Pressing",
      duration: "12-24 hours",
      steps: [
        "Place curds in cheese press",
        "Apply graduated pressure",
        "Flip cheese at specified intervals",
        "Check for proper consolidation"
      ]
    },
    {
      stage: "Aging/Ripening",
      duration: "2 weeks - 2 years",
      steps: [
        "Place in aging room at proper temperature",
        "Maintain correct humidity levels",
        "Turn cheeses regularly",
        "Monitor for proper aging characteristics"
      ]
    }
  ];

  const criticalParameters = [
    { parameter: "Milk Temperature", target: "32°C ± 1°C", monitoring: "Continuous" },
    { parameter: "pH Level", target: "6.4-6.6 initial", monitoring: "Every 30 min" },
    { parameter: "Moisture Content", target: "37-42%", monitoring: "End of process" },
    { parameter: "Salt Content", target: "1.5-2.0%", monitoring: "After salting" },
    { parameter: "Aging Temperature", target: "12-15°C", monitoring: "Daily" },
    { parameter: "Aging Humidity", target: "80-85% RH", monitoring: "Daily" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-yellow-600" />
                Cheese Production Standard Operating Procedures
              </CardTitle>
              <p className="text-gray-600 mt-1">Version 1.8 | Last Updated: December 2024</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Total Process Time</p>
                <p className="text-sm text-yellow-600">4-6 hours + aging</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Thermometer className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Temperature Control</p>
                <p className="text-sm text-blue-600">Critical ±1°C</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <Droplets className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Moisture Control</p>
                <p className="text-sm text-green-600">37-42% target</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Production Stages</h3>
            <div className="space-y-4">
              {productionStages.map((stage, index) => (
                <Card key={index} className="border-l-4 border-l-yellow-500">
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
            <h3 className="text-xl font-semibold mb-4">Critical Control Parameters</h3>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Parameter</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Target Range</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Monitoring Frequency</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-900">Action Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {criticalParameters.map((param, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 font-medium">{param.parameter}</td>
                          <td className="px-4 py-3">{param.target}</td>
                          <td className="px-4 py-3">{param.monitoring}</td>
                          <td className="px-4 py-3">
                            <Badge variant="destructive" className="text-xs">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Quality Requirements:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use only Grade A pasteurized milk</li>
                <li>• Maintain strict temperature controls</li>
                <li>• Test pH at each critical stage</li>
                <li>• Document all process parameters</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Safety Warnings:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Never exceed maximum heating rates</li>
                <li>• Always test equipment before use</li>
                <li>• Report any contamination immediately</li>
                <li>• Follow lockout/tagout procedures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheeseProductionProcedures;
