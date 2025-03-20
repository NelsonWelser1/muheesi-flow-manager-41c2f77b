
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmployeeRecordsForm from '../forms/EmployeeRecordsForm';
import TrainingEvaluationForm from '../forms/TrainingEvaluationForm';
import RecruitmentManagementForm from '../forms/RecruitmentManagementForm';
import DossierManagement from '../dossier/DossierManagement';

const ActiveComponent = ({ activeComponent, onBack }) => {
  if (!activeComponent) return null;

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Personnel Dashboard
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{activeComponent}</CardTitle>
        </CardHeader>
        <CardContent>
          {activeComponent === "Employee Records & Scheduling" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium">Employee Records Management</h3>
              </div>
              <EmployeeRecordsForm />
            </div>
          )}
          {activeComponent === "Training & Performance" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium">Training & Performance Management</h3>
              </div>
              <TrainingEvaluationForm />
            </div>
          )}
          {activeComponent === "Recruitment Management" && <RecruitmentManagementForm />}
          {activeComponent === "Employee Dossiers" && <DossierManagement />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveComponent;
