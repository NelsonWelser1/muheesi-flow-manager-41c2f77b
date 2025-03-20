
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmployeeRecordsForm from '../forms/EmployeeRecordsForm';
import TrainingEvaluationForm from '../forms/TrainingEvaluationForm';
import RecruitmentManagementForm from '../forms/RecruitmentManagementForm';
import DossierManagement from '../dossier/DossierManagement';
import PersonnelDataDisplay from '../data-display/PersonnelDataDisplay';

const ActiveComponent = ({ activeComponent, onBack }) => {
  const [showEmployeeRecords, setShowEmployeeRecords] = useState(false);
  const [showTrainingRecords, setShowTrainingRecords] = useState(false);
  
  if (!activeComponent) return null;

  if (showEmployeeRecords && activeComponent === "Employee Records & Scheduling") {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowEmployeeRecords(false)} className="mb-4">
          ← Back to Employee Records Form
        </Button>
        <PersonnelDataDisplay 
          tableName="personnel_employee_records" 
          title="Employee"
        />
      </div>
    );
  }

  if (showTrainingRecords && activeComponent === "Training & Performance") {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowTrainingRecords(false)} className="mb-4">
          ← Back to Training & Performance Form
        </Button>
        <PersonnelDataDisplay 
          tableName="personnel_training_evaluations" 
          title="Training"
        />
      </div>
    );
  }

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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Employee Records Management</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmployeeRecords(true)}
                >
                  View Employee Records
                </Button>
              </div>
              <EmployeeRecordsForm />
            </div>
          )}
          {activeComponent === "Training & Performance" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Training & Performance Management</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTrainingRecords(true)}
                >
                  View Training Records
                </Button>
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
