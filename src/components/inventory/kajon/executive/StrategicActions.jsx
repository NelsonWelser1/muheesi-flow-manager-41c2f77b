
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon, AlertCircle, Check, ArrowUpRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StrategicActions = () => {
  // Sample AI-generated recommended actions for executives
  const recommendations = [
    {
      id: 1,
      title: "Increase Arabica Processing Capacity",
      description: "Current arabica demand exceeds processing capacity by 18%. Consider expanding processing facilities.",
      impact: "high",
      category: "operations",
      ai: true
    },
    {
      id: 2,
      title: "Review European Export Pricing",
      description: "Recent market analysis shows opportunity to adjust pricing for European markets.",
      impact: "medium",
      category: "pricing",
      ai: true
    },
    {
      id: 3,
      title: "Quality Control in Buremba",
      description: "Recent shipments from Buremba showed quality inconsistencies. Schedule quality audit.",
      impact: "high",
      category: "quality",
      ai: false
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'operations': return 'bg-purple-100 text-purple-800';
      case 'pricing': return 'bg-blue-100 text-blue-800';
      case 'quality': return 'bg-green-100 text-green-800';
      case 'logistics': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>Strategic Actions</span>
          <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map(rec => (
            <div 
              key={rec.id} 
              className={`border rounded-lg p-3 ${getImpactColor(rec.impact)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  {rec.ai ? (
                    <LightbulbIcon className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-sm mt-1">{rec.description}</p>
                  </div>
                </div>
                <Badge className={`${getCategoryColor(rec.category)}`}>
                  {rec.category}
                </Badge>
              </div>
              
              <div className="flex justify-between mt-3">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    Defer
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="h-8">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicActions;
