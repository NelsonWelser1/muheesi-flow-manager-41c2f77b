
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Filter, 
  Calendar, 
  Target, 
  Users, 
  DollarSign 
} from "lucide-react";
import { format } from "date-fns";

const MarketingCampaignsDisplay = ({ onBack }) => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openCampaignDetails, setOpenCampaignDetails] = useState(false);

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Campaigns fetched:', data);
      setCampaigns(data || []);
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

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'planned':
        return 'secondary';
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    // Apply status filter
    if (statusFilter !== 'all' && campaign.progress_status?.toLowerCase() !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      campaign.campaign_name?.toLowerCase().includes(searchLower) ||
      campaign.campaign_id?.toLowerCase().includes(searchLower) ||
      campaign.objectives?.toLowerCase().includes(searchLower) ||
      campaign.target_audience?.toLowerCase().includes(searchLower)
    );
  });

  const openDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setOpenCampaignDetails(true);
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
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading campaigns...</div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No marketing campaigns found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="font-medium">{campaign.campaign_name}</div>
                        <div className="text-sm text-muted-foreground">{campaign.campaign_id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{campaign.budget ? `${campaign.budget}` : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(campaign.progress_status)}>
                          {campaign.progress_status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetails(campaign)}
                        >
                          <span className="sr-only">View details</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Details Dialog */}
      {selectedCampaign && (
        <Dialog open={openCampaignDetails} onOpenChange={setOpenCampaignDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.campaign_name}</DialogTitle>
              <DialogDescription>
                Campaign ID: {selectedCampaign.campaign_id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Timeline</div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDate(selectedCampaign.start_date)} - {formatDate(selectedCampaign.end_date)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Status</div>
                <Badge variant={getStatusBadgeVariant(selectedCampaign.progress_status)}>
                  {selectedCampaign.progress_status || 'Unknown'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Budget</div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedCampaign.budget || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm">
                  {formatDate(selectedCampaign.created_at)}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-base font-medium flex items-center mb-2">
                  <Target className="h-4 w-4 mr-2" /> Objectives
                </h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md">
                  {selectedCampaign.objectives || 'No objectives specified'}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2" /> Target Audience
                </h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md">
                  {selectedCampaign.target_audience || 'No target audience specified'}
                </div>
              </div>
              
              {selectedCampaign.strategies && selectedCampaign.strategies.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2">Marketing Strategies</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Strategy</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCampaign.strategies.map((strategy, index) => (
                          <TableRow key={index}>
                            <TableCell>{strategy.name}</TableCell>
                            <TableCell>{strategy.description}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={strategy.status ? 'success' : 'secondary'}>
                                {strategy.status ? 'Completed' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {selectedCampaign.kpis && selectedCampaign.kpis.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2">Key Performance Indicators</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>KPI</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCampaign.kpis.map((kpi, index) => (
                          <TableRow key={index}>
                            <TableCell>{kpi.name}</TableCell>
                            <TableCell>{kpi.target} {kpi.unit}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={kpi.status ? 'success' : 'secondary'}>
                                {kpi.status ? 'Achieved' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MarketingCampaignsDisplay;
