
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportForm from './ReportForm';

const ReportFormCard = ({ 
  isKazo = false,
  recipient, 
  setRecipient, 
  report, 
  setReport, 
  handleSubmit,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isKazo ? "Kazo Coffee Development Project Reports" : "KAJON Coffee Limited Reports"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReportForm
          report={report}
          setReport={setReport}
          recipient={recipient}
          setRecipient={setRecipient}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default ReportFormCard;
