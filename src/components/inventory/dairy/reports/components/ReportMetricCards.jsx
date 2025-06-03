
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, PieChart, Download } from "lucide-react";
import MetricDetailsPopover from './MetricDetailsPopover';

const ReportMetricCards = ({ reportCounts }) => {
  const getMetricDetails = (metricType) => {
    switch (metricType) {
      case 'daily':
        return {
          title: "Daily Reports Overview",
          description: "Summary of all reports generated today across different departments and production lines.",
          details: [
            { label: "Production Reports", value: Math.floor((reportCounts.daily || 0) * 0.4) },
            { label: "Quality Control", value: Math.floor((reportCounts.daily || 0) * 0.3) },
            { label: "Inventory Updates", value: Math.floor((reportCounts.daily || 0) * 0.2) },
            { label: "Safety Reports", value: Math.floor((reportCounts.daily || 0) * 0.1) }
          ],
          trend: { type: 'positive', value: '+15%' },
          additionalInfo: "Reports are automatically generated at 6 AM, 2 PM, and 10 PM daily."
        };
      
      case 'growth':
        return {
          title: "Production Growth Analysis",
          description: "Year-to-date production growth compared to the same period last year.",
          details: [
            { label: "Milk Production", value: "+18.5%" },
            { label: "Cheese Production", value: "+8.2%" },
            { label: "Yogurt Production", value: "+12.1%" },
            { label: "Overall Efficiency", value: "+6.3%" }
          ],
          trend: { type: 'positive', value: '+4.2%' },
          additionalInfo: "Growth is calculated based on volume, quality metrics, and operational efficiency."
        };
      
      case 'quality':
        return {
          title: "Quality Score Breakdown",
          description: "Average quality rating across all products and production lines.",
          details: [
            { label: "Raw Milk Quality", value: "94.2%" },
            { label: "Processing Standards", value: "91.8%" },
            { label: "Final Product Quality", value: "96.1%" },
            { label: "Customer Satisfaction", value: "88.7%" }
          ],
          trend: { type: 'positive', value: '+2.1%' },
          additionalInfo: "Quality scores are updated in real-time based on laboratory tests and customer feedback."
        };
      
      case 'downloads':
        return {
          title: "Report Downloads Summary",
          description: "Total number of report downloads by stakeholders this week.",
          details: [
            { label: "Management Reports", value: Math.floor((reportCounts.downloads || 0) * 0.35) },
            { label: "Technical Reports", value: Math.floor((reportCounts.downloads || 0) * 0.25) },
            { label: "Financial Reports", value: Math.floor((reportCounts.downloads || 0) * 0.25) },
            { label: "Compliance Reports", value: Math.floor((reportCounts.downloads || 0) * 0.15) }
          ],
          trend: { type: 'positive', value: '+8%' },
          additionalInfo: "Most downloads occur on Monday mornings and Friday afternoons."
        };
      
      default:
        return {
          title: "Metric Details",
          description: "Detailed information about this metric.",
          details: [],
          additionalInfo: "No additional details available."
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportCounts.daily || 0}</div>
              <p className="text-xs text-muted-foreground">Generated today</p>
            </CardContent>
          </Card>
        }
        {...getMetricDetails('daily')}
        value={reportCounts.daily || 0}
      />

      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportCounts.growthPercent || "0%"}</div>
              <p className="text-xs text-muted-foreground">From last period</p>
            </CardContent>
          </Card>
        }
        {...getMetricDetails('growth')}
        value={reportCounts.growthPercent || "0%"}
      />

      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportCounts.qualityScore || "0%"}</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        }
        {...getMetricDetails('quality')}
        value={reportCounts.qualityScore || "0%"}
      />

      <MetricDetailsPopover
        trigger={
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportCounts.downloads || 0}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        }
        {...getMetricDetails('downloads')}
        value={reportCounts.downloads || 0}
      />
    </div>
  );
};

export default ReportMetricCards;
