
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Upload, Calendar, FileText, Check, Clock } from "lucide-react";

const getStatusColor = (status) => {
  const statusMap = {
    'Active': 'bg-green-100 text-green-800',
    'Onboarding': 'bg-blue-100 text-blue-800',
    'Terminated': 'bg-red-100 text-red-800',
    'Retired': 'bg-purple-100 text-purple-800',
    'On Leave': 'bg-yellow-100 text-yellow-800'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

const getEmployeeStatus = (employee) => {
  const now = new Date();
  const shiftStart = new Date(employee.shift_start);
  const shiftEnd = new Date(employee.shift_end);
  const reviewDate = new Date(employee.review_date_time);
  
  // Simple logic to determine status - can be enhanced with actual status field
  if (employee.performance_rating < 2) return 'Terminated';
  if (now < shiftStart) return 'Onboarding';
  if (now > reviewDate) return 'On Leave';
  return 'Active';
};

const DossierList = ({ dossiers, viewMode, onView, onUpload, onSchedule }) => {
  if (!dossiers.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No employee dossiers found.</div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dossiers.map((dossier) => {
          const status = getEmployeeStatus(dossier);
          
          return (
            <Card key={dossier.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{dossier.employee_id}</h3>
                      <p className="text-sm text-gray-600">{dossier.job_title}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(status)}>{status}</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-400" />
                    <span>Performance: {dossier.performance_rating}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Next Review: {new Date(dossier.review_date_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Documents: {Math.floor(Math.random() * 5) + 1}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 p-3 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => onView(dossier)}>View Profile</Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onUpload(dossier)}>
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onSchedule(dossier)}>
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Employee</th>
              <th className="text-left p-3">Position</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Performance</th>
              <th className="text-left p-3">Next Review</th>
              <th className="text-left p-3">Documents</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((dossier) => {
              const status = getEmployeeStatus(dossier);
              
              return (
                <tr key={dossier.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span>{dossier.employee_id}</span>
                    </div>
                  </td>
                  <td className="p-3">{dossier.job_title}</td>
                  <td className="p-3">
                    <Badge className={getStatusColor(status)}>{status}</Badge>
                  </td>
                  <td className="p-3">{dossier.performance_rating}/5</td>
                  <td className="p-3">{new Date(dossier.review_date_time).toLocaleDateString()}</td>
                  <td className="p-3">{Math.floor(Math.random() * 5) + 1}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onView(dossier)}>
                        <User className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onUpload(dossier)}>
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onSchedule(dossier)}>
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DossierList;
