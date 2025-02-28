
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Search, Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const MarketingCampaignsDisplay = ({ onBack }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("week"); // day, week, month, year

  useEffect(() => {
    fetchCampaigns();
  }, [timeRange]);

  useEffect(() => {
    if (campaigns.length > 0) {
      filterCampaigns();
    }
  }, [searchQuery, campaigns]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // Determine date range based on timeRange
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case "day":
          startDate.setDate(now.getDate() - 1);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7); // Default to week
      }

      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        console.log('Campaigns fetched:', data);
        setCampaigns(data);
        setFilteredCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    if (!searchQuery.trim()) {
      setFilteredCampaigns(campaigns);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = campaigns.filter(campaign => 
      campaign.campaign_name.toLowerCase().includes(query) || 
      (campaign.platform && campaign.platform.toLowerCase().includes(query)) ||
      (campaign.engagement_metrics && campaign.engagement_metrics.toLowerCase().includes(query))
    );
    
    setFilteredCampaigns(filtered);
  };

  const increaseTimeRange = () => {
    switch (timeRange) {
      case "day":
        setTimeRange("week");
        break;
      case "week":
        setTimeRange("month");
        break;
      case "month":
        setTimeRange("year");
        break;
      case "year":
        // Already at max range
        break;
    }
  };

  const decreaseTimeRange = () => {
    switch (timeRange) {
      case "year":
        setTimeRange("month");
        break;
      case "month":
        setTimeRange("week");
        break;
      case "week":
        setTimeRange("day");
        break;
      case "day":
        // Already at min range
        break;
    }
  };

  const handleExport = (format) => {
    try {
      if (filteredCampaigns.length === 0) {
        toast({
          title: "Export Failed",
          description: "No data to export",
          variant: "destructive",
        });
        return;
      }

      // Convert campaigns data to CSV format
      let exportData;
      
      if (format === 'csv' || format === 'excel') {
        // CSV/Excel format
        const csvData = [
          // Header row
          ["ID", "Campaign Name", "Platform", "Start Date", "End Date", "Budget", "Engagement Metrics", "Created At"],
          // Data rows
          ...filteredCampaigns.map(campaign => [
            campaign.id,
            campaign.campaign_name,
            campaign.platform || "",
            campaign.start_date || "",
            campaign.end_date || "",
            campaign.budget || "",
            campaign.engagement_metrics || "",
            campaign.created_at || ""
          ])
        ];
        
        // Convert to CSV string
        exportData = csvData.map(row => row.map(cell => 
          typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
        ).join(',')).join('\n');
      } else if (format === 'pdf') {
        // For PDF, we'll just prepare the data
        // In a real app, you would use a library like jsPDF
        exportData = JSON.stringify(filteredCampaigns, null, 2);
        console.log("PDF export data prepared:", exportData);
        
        toast({
          title: "PDF Export",
          description: "PDF export functionality would be implemented with a library like jsPDF",
        });
        return;
      }

      // Create download
      const blob = new Blob([exportData], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `marketing-campaigns-${new Date().toISOString()}.${format === 'excel' ? 'xlsx' : format}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Marketing Campaigns</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={decreaseTimeRange}
              disabled={timeRange === "day"}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium capitalize">{timeRange}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={increaseTimeRange}
              disabled={timeRange === "year"}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="mr-2 h-4 w-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-4">Loading campaigns...</p>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found. {searchQuery ? "Try a different search term." : "Create your first marketing campaign."}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 font-medium">
                      <th className="p-3 text-left">Campaign Name</th>
                      <th className="p-3 text-left">Platform</th>
                      <th className="p-3 text-left">Start Date</th>
                      <th className="p-3 text-left">End Date</th>
                      <th className="p-3 text-left">Budget</th>
                      <th className="p-3 text-left">Engagement Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b">
                        <td className="p-3">{campaign.campaign_name}</td>
                        <td className="p-3">{campaign.platform || "—"}</td>
                        <td className="p-3">{campaign.start_date ? format(new Date(campaign.start_date), "MMM d, yyyy") : "—"}</td>
                        <td className="p-3">{campaign.end_date ? format(new Date(campaign.end_date), "MMM d, yyyy") : "—"}</td>
                        <td className="p-3">{campaign.budget ? `$${campaign.budget}` : "—"}</td>
                        <td className="p-3">{campaign.engagement_metrics || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingCampaignsDisplay;
