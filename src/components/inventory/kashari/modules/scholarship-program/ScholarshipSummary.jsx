
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, School, Award } from "lucide-react";

const ScholarshipSummary = ({ summary }) => {
  // Format amount with commas
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-600 font-medium">Total Amount</p>
                <h3 className="text-2xl font-bold mt-1">UGX {formatAmount(summary.totalAmount)}</h3>
              </div>
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Total Scholarships</p>
                <h3 className="text-2xl font-bold mt-1">{summary.totalScholarships}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <School className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Active Scholarships</p>
                <h3 className="text-2xl font-bold mt-1">{summary.activeScholarships}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Completed</p>
                <h3 className="text-2xl font-bold mt-1">{summary.completedScholarships}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Scholarships by Education Level</h3>
            {Object.keys(summary.scholarshipsByLevel).length === 0 ? (
              <p className="text-muted-foreground">No scholarships recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(summary.scholarshipsByLevel).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <div className="font-medium">{level}</div>
                    <div className="text-blue-600">{count} scholarship(s)</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Scholarships by Type</h3>
            {Object.keys(summary.scholarshipsByType).length === 0 ? (
              <p className="text-muted-foreground">No scholarships recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(summary.scholarshipsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="font-medium">{type}</div>
                    <div className="text-purple-600">{count} scholarship(s)</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipSummary;
