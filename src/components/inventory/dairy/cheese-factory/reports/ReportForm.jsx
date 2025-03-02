
import React from 'react';
import { Button } from "@/components/ui/button";
import { ReportTitleInput } from './form-components/ReportTitleInput';
import { ReportTypeSelect } from './form-components/ReportTypeSelect';
import { DateRangeSelector } from './form-components/DateRangeSelector';
import { ReportContentInput } from './form-components/ReportContentInput';
import { RecipientInfoInputs } from './form-components/RecipientInfoInputs';
import { SendViaOptions } from './form-components/SendViaOptions';

const ReportForm = ({ report, setReport, recipient, setRecipient, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <ReportTitleInput 
          title={report.title} 
          onChange={(value) => setReport({ ...report, title: value })} 
        />

        <ReportTypeSelect 
          value={report.type} 
          onValueChange={(value) => setReport({ ...report, type: value })} 
        />

        {report.startDate && report.endDate && (
          <DateRangeSelector
            startDate={report.startDate}
            endDate={report.endDate}
            onStartDateChange={(date) => setReport({ ...report, startDate: date })}
            onEndDateChange={(date) => setReport({ ...report, endDate: date })}
          />
        )}

        <ReportContentInput 
          content={report.content} 
          onChange={(value) => setReport({ ...report, content: value })} 
        />

        <RecipientInfoInputs 
          recipient={recipient} 
          setRecipient={setRecipient} 
        />

        <SendViaOptions 
          sendVia={report.sendVia} 
          onToggle={(method) => {
            setReport(prev => ({
              ...prev,
              sendVia: prev.sendVia.includes(method)
                ? prev.sendVia.filter(m => m !== method)
                : [...prev.sendVia, method]
            }));
          }} 
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        Generate and Send Report
      </Button>
    </form>
  );
};

export default ReportForm;
