
import React from 'react';
import { useReportForm } from './reports/useReportForm';
import ReportFormCard from './reports/ReportFormCard';

const MakeReports = ({ isKazo = false }) => {
  const { 
    recipient, 
    setRecipient, 
    report, 
    setReport, 
    isLoading, 
    handleSubmit 
  } = useReportForm();

  return (
    <div className="space-y-6">
      <ReportFormCard
        isKazo={isKazo}
        recipient={recipient}
        setRecipient={setRecipient}
        report={report}
        setReport={setReport}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MakeReports;
