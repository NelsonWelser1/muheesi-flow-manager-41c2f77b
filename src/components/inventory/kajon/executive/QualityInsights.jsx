
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, AlertTriangle, Clock, Star } from 'lucide-react';

const QualityInsights = () => {
  // Sample quality metrics data
  const qualityMetrics = {
    averageArabicaScore: 92.5,
    averageRobustaScore: 88.7,
    premiumPercentage: 68,
    qualityIssues: 2,
    topOrigin: "Kanoni-Rwakahaya",
    topScore: 94.2
  };

  // Sample quality issues
  const qualityIssues = [
    {
      id: 1,
      title: "Humidity Levels High",
      location: "Buremba Warehouse",
      severity: "medium",
      timestamp: "2 days ago"
    },
    {
      id: 2,
      title: "Bean Size Inconsistency",
      location: "Kazo Processing Center",
      severity: "low",
      timestamp: "1 week ago"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="flex items-center mb-1">
              <Star className="h-4 w-4 text-amber-600 mr-1" />
              <p className="text-sm font-medium">Arabica Rating</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{qualityMetrics.averageArabicaScore}</p>
            <p className="text-xs text-green-600">out of 100</p>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
            <div className="flex items-center mb-1">
              <Star className="h-4 w-4 text-amber-600 mr-1" />
              <p className="text-sm font-medium">Robusta Rating</p>
            </div>
            <p className="text-2xl font-bold text-amber-700">{qualityMetrics.averageRobustaScore}</p>
            <p className="text-xs text-amber-600">out of 100</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BadgeCheck className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium">Premium Grade Percentage</h3>
            </div>
            <span className="text-xl font-bold">{qualityMetrics.premiumPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${qualityMetrics.premiumPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Percentage of coffee qualifying as premium grade</p>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="font-medium">Quality Alerts</h3>
          </div>
          
          {qualityIssues.length > 0 ? (
            <div className="space-y-2">
              {qualityIssues.map(issue => (
                <div key={issue.id} className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between">
                    <p className="font-medium">{issue.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{issue.location}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-400">{issue.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No quality issues detected</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityInsights;
