
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
          {activeComponent === "Training & Performance" && <TrainingEvaluationForm />}
          {activeComponent === "Recruitment Management" && <RecruitmentManagementForm />}
          {activeComponent === "Employee Dossiers" && <DossierManagement />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveComponent;
