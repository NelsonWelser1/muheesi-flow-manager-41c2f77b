
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useCRMReports } from '../hooks/useCRMReports';
import { format } from 'date-fns';

const CRMReportsDisplay = ({ onBack }) => {
  const { reports, isLoading, fetchReports } = useCRMReports();
  const [expandedReports, setExpandedReports] = useState({});

  const toggleReportExpansion = (reportId) => {
    setExpandedReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button 
          variant="outline" 
          onClick={fetchReports}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CRM Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading CRM reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No CRM reports found. Create a new report to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-accent/50"
                    onClick={() => toggleReportExpansion(report.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{report.report_title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(report.created_at)}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {report.report_type?.replace(/_/g, ' ')}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        {report.department}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                        {report.distribution}
                      </span>
                    </div>
                  </div>
                  
                  {expandedReports[report.id] && (
                    <div className="p-4 border-t bg-muted/20">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Date Range</h4>
                          <p className="mt-1">{formatDate(report.date_range_start)} to {formatDate(report.date_range_end)}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Summary</h4>
                          <p className="mt-1 whitespace-pre-line">{report.summary}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Key Findings</h4>
                          <p className="mt-1 whitespace-pre-line">{report.key_findings}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">Recommendations</h4>
                          <p className="mt-1 whitespace-pre-line">{report.recommendations}</p>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Created by {report.created_by_name || 'Anonymous User'}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMReportsDisplay;
