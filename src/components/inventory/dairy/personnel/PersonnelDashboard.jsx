
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import EmployeeRecordsForm from './forms/EmployeeRecordsForm';
import TrainingEvaluationForm from './forms/TrainingEvaluationForm';
import RecruitmentManagementForm from './forms/RecruitmentManagementForm';

const PersonnelDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    setActiveComponent(null);
  };

  if (activeComponent) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          ← Back to Personnel Dashboard
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{activeComponent}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeComponent === "Employee Records & Scheduling" && <EmployeeRecordsForm />}
            {activeComponent === "Training & Performance" && <TrainingEvaluationForm />}
            {activeComponent === "Recruitment Management" && <RecruitmentManagementForm />}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Personnel Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100"
          onClick={() => setActiveComponent("Employee Records & Scheduling")}
        >
          <Users className="h-8 w-8" />
          <span className="text-lg font-semibold">Employee Records & Scheduling</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100"
          onClick={() => setActiveComponent("Training & Performance")}
        >
          <GraduationCap className="h-8 w-8" />
          <span className="text-lg font-semibold">Training & Performance</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100"
          onClick={() => setActiveComponent("Recruitment Management")}
        >
          <UserPlus className="h-8 w-8" />
          <span className="text-lg font-semibold">Recruitment Management</span>
        </Button>
      </div>
    </div>
  );
};

export default PersonnelDashboard;
