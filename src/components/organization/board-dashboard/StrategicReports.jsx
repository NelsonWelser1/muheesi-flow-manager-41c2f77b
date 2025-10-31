
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, User } from 'lucide-react';

const StrategicReports = () => {
  const reports = [
    {
      title: "Q2 2024 Portfolio Performance Review",
      type: "Quarterly Report",
      author: "CFO Office",
      date: "2024-06-30",
      status: "Final",
      summary: "Comprehensive analysis of all company performance metrics, showing 8.5% growth in portfolio value.",
      downloadUrl: "#"
    },
    {
      title: "Risk Assessment Summary - All Companies",
      type: "Risk Report",
      author: "Risk Management",
      date: "2024-06-15",
      status: "Final",
      summary: "Updated risk profiles across all portfolio companies with recommendations for mitigation strategies.",
      downloadUrl: "#"
    },
    {
      title: "ESG Compliance Status Report",
      type: "Compliance Report",
      author: "Compliance Office",
      date: "2024-06-10",
      status: "Final",
      summary: "Environmental, Social, and Governance compliance status across all operations.",
      downloadUrl: "#"
    },
    {
      title: "Market Expansion Analysis",
      type: "Strategic Report",
      author: "Strategy Team",
      date: "2024-05-28",
      status: "Draft",
      summary: "Analysis of potential market expansion opportunities for coffee and dairy sectors.",
      downloadUrl: "#"
    },
    {
      title: "Operational Efficiency Benchmarking",
      type: "Operations Report",
      author: "Operations Office",
      date: "2024-05-20",
      status: "Final",
      summary: "Benchmarking study comparing operational efficiency across portfolio companies.",
      downloadUrl: "#"
    },
    {
      title: "Technology Investment Review",
      type: "Investment Report",
      author: "CTO Office",
      date: "2024-05-15",
      status: "Under Review",
      summary: "Evaluation of technology investments and digital transformation initiatives.",
      downloadUrl: "#"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Final': return 'bg-success';
      case 'Draft': return 'bg-warning';
      case 'Under Review': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Quarterly Report': return 'border-accent/30 bg-accent/10';
      case 'Risk Report': return 'border-destructive/30 bg-destructive/10';
      case 'Compliance Report': return 'border-success/30 bg-success/10';
      case 'Strategic Report': return 'border-primary/30 bg-primary/10';
      case 'Operations Report': return 'border-warning/30 bg-warning/10';
      case 'Investment Report': return 'border-secondary/30 bg-secondary/10';
      default: return 'border-muted/30 bg-muted/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reports.length}</p>
            <p className="text-xs text-muted-foreground">Available for review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {reports.filter(r => r.status === 'Under Review' || r.status === 'Draft').length}
            </p>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {reports.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}
            </p>
            <p className="text-xs text-muted-foreground">Reports generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {reports.map((report, index) => (
          <Card key={index} className={`border-l-4 ${getTypeColor(report.type)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {report.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
                <button 
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => window.open(report.downloadUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {report.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {report.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(report.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategicReports;
