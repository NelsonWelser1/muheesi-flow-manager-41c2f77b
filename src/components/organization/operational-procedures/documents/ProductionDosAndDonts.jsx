
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const ProductionDosAndDonts = () => {
  const safetyGuidelines = {
    general: {
      dos: [
        "Always wear appropriate personal protective equipment (PPE)",
        "Follow proper hand washing and sanitization procedures",
        "Report all incidents and near-misses immediately",
        "Keep work areas clean and organized at all times",
        "Use equipment only after proper training and authorization",
        "Follow lockout/tagout procedures for equipment maintenance"
      ],
      donts: [
        "Never enter production areas without proper authorization",
        "Don't operate equipment without proper training",
        "Never ignore safety warnings or bypass safety devices",
        "Don't eat, drink, or smoke in production areas",
        "Never work alone in hazardous areas",
        "Don't use damaged or malfunctioning equipment"
      ]
    },
    milk: {
      dos: [
        "Maintain cold chain temperature (≤4°C) at all times",
        "Test every batch for quality parameters",
        "Use only food-grade sanitizers and cleaning agents",
        "Record all critical control points",
        "Inspect packaging materials before use",
        "Follow proper CIP (Clean-in-Place) procedures"
      ],
      donts: [
        "Never process milk that fails quality tests",
        "Don't mix different milk batches without authorization",
        "Never use expired ingredients or additives",
        "Don't skip pasteurization temperature verification",
        "Never reuse single-use packaging materials",
        "Don't store processed milk at improper temperatures"
      ]
    },
    cheese: {
      dos: [
        "Monitor and record temperature at all critical stages",
        "Test pH levels at specified intervals",
        "Use only approved cultures and rennet",
        "Maintain proper humidity in aging rooms",
        "Turn aging cheeses according to schedule",
        "Document all process deviations"
      ],
      donts: [
        "Never exceed maximum heating rates during cooking",
        "Don't use equipment that hasn't been properly sanitized",
        "Never skip moisture content testing",
        "Don't allow cross-contamination between batches",
        "Never age cheese in non-approved environments",
        "Don't use damaged or contaminated molds"
      ]
    },
    coffee: {
      dos: [
        "Sort cherries immediately upon receipt",
        "Maintain proper fermentation temperatures (22-25°C)",
        "Turn drying coffee beans every 2 hours during daylight",
        "Test moisture content before storage",
        "Keep processing equipment clean and calibrated",
        "Maintain detailed processing records"
      ],
      donts: [
        "Never process overripe or damaged cherries",
        "Don't allow fermentation to exceed 48 hours",
        "Never dry coffee directly on concrete floors",
        "Don't store coffee above 12% moisture content",
        "Never mix different processing batches",
        "Don't use contaminated processing water"
      ]
    }
  };

  const emergencyProcedures = [
    {
      emergency: "Equipment Malfunction",
      actions: [
        "Stop operation immediately",
        "Isolate affected equipment",
        "Notify supervisor and maintenance",
        "Document incident details"
      ]
    },
    {
      emergency: "Contamination Detected",
      actions: [
        "Quarantine affected products",
        "Stop related production",
        "Notify quality control manager",
        "Begin investigation procedure"
      ]
    },
    {
      emergency: "Personal Injury",
      actions: [
        "Provide immediate first aid",
        "Call emergency services if serious",
        "Notify safety officer",
        "Complete incident report"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Production Area Safety Guidelines - Do's and Don'ts
              </CardTitle>
              <p className="text-gray-600 mt-1">Version 4.1 | Last Updated: December 2024</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* General Safety Guidelines */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              General Production Area Guidelines
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    DO's - Required Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {safetyGuidelines.general.dos.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    DON'Ts - Prohibited Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {safetyGuidelines.general.donts.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Production-Specific Guidelines */}
          {Object.entries(safetyGuidelines).filter(([key]) => key !== 'general').map(([area, guidelines]) => (
            <div key={area}>
              <h3 className="text-xl font-semibold mb-4 capitalize">
                {area} Production Specific Guidelines
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      DO's
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {guidelines.dos.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      DON'Ts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {guidelines.donts.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}

          {/* Emergency Procedures */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Emergency Procedures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyProcedures.map((emergency, index) => (
                <Card key={index} className="border-orange-200">
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="text-orange-800 text-lg">
                      {emergency.emergency}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {emergency.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {actionIndex + 1}
                          </Badge>
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Important Reminders */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Critical Safety Reminders
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h5 className="font-medium mb-2">Before Starting Work:</h5>
                <ul className="space-y-1">
                  <li>• Check all safety equipment</li>
                  <li>• Review daily safety briefing</li>
                  <li>• Inspect work area for hazards</li>
                  <li>• Ensure proper PPE is worn</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">During Production:</h5>
                <ul className="space-y-1">
                  <li>• Follow all SOPs exactly</li>
                  <li>• Report unsafe conditions immediately</li>
                  <li>• Maintain constant vigilance</li>
                  <li>• Help colleagues follow safety rules</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionDosAndDonts;
