
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmployeeRecordsForm from '../forms/EmployeeRecordsForm';
import TrainingEvaluationForm from '../forms/TrainingEvaluationForm';
import RecruitmentManagementForm from '../forms/RecruitmentManagementForm';
import DossierManagement from '../dossier/DossierManagement';
import PersonnelDataDisplay from '../data-display/PersonnelDataDisplay';

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
            <EmployeeRecordsForm />
          )}
          {activeComponent === "Training & Performance" && <TrainingEvaluationForm />}
          {activeComponent === "Recruitment Management" && <RecruitmentManagementForm />}
          {activeComponent === "Employee Dossiers" && <DossierManagement />}
          {activeComponent === "Employee Records" && (
            <PersonnelDataDisplay 
              tableName="personnel_employee_records" 
              title="Employee"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveComponent;
