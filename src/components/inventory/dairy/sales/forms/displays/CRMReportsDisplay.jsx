
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, ExternalLink, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { showErrorToast } from "@/components/ui/notifications";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CRMReportsDisplay = ({ onBack }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchCRMReports();
  }, []);

  const fetchCRMReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching CRM reports:', error);
      showErrorToast(toast, "Failed to load CRM reports: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredReports = () => {
    if (activeTab === "all") return reports;
    return reports.filter(report => report.report_type === activeTab);
  };

  const getReportTypeBadge = (type) => {
    switch (type) {
      case 'customer_segmentation':
        return <Badge variant="success">Customer Segmentation</Badge>;
      case 'sales_performance':
        return <Badge variant="info">Sales Performance</Badge>;
      case 'lead_generation':
        return <Badge variant="warning">Lead Generation</Badge>;
      case 'customer_retention':
        return <Badge variant="outline">Customer Retention</Badge>;
      case 'customer_satisfaction':
        return <Badge variant="secondary">Customer Satisfaction</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CRM Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="customer_segmentation">Customer Segmentation</TabsTrigger>
              <TabsTrigger value="sales_performance">Sales Performance</TabsTrigger>
              <TabsTrigger value="lead_generation">Lead Generation</TabsTrigger>
              <TabsTrigger value="customer_retention">Customer Retention</TabsTrigger>
              <TabsTrigger value="customer_satisfaction">Customer Satisfaction</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-8">Loading CRM reports...</div>
              ) : getFilteredReports().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No CRM reports found.
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredReports().map((report, index) => (
                    <Card key={report.id || index} className="overflow-hidden">
                      <div className="p-4 bg-muted/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{report.report_title || 'Untitled Report'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Generated: {formatDate(report.created_at)} &bull; Period: {formatDate(report.date_range_start)} - {formatDate(report.date_range_end)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getReportTypeBadge(report.report_type)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Filter className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  <span>View Report</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download PDF</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  <span>Share Report</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-sm font-medium">Summary</p>
                          <p className="text-sm">
                            {report.summary || 'No summary provided for this report.'}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Created By</p>
                            <p className="text-sm">{report.created_by_name || 'System Generated'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Department</p>
                            <p className="text-sm">{report.department || 'Sales & Marketing'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Distribution</p>
                            <p className="text-sm">{report.distribution || 'Internal'}</p>
                          </div>
                        </div>
                        
                        {report.key_findings && (
                          <div className="mb-4">
                            <p className="text-sm font-medium">Key Findings</p>
                            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                              {report.key_findings.split('\n').map((finding, i) => (
                                <li key={i}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {report.recommendations && (
                          <div>
                            <p className="text-sm font-medium">Recommendations</p>
                            <p className="text-sm whitespace-pre-line">{report.recommendations}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t flex justify-end">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" /> View Full Report
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMReportsDisplay;
