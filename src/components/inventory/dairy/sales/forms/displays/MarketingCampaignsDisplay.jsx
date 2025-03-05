
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, RefreshCw, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdvertisingPromotion } from '../hooks/useAdvertisingPromotion';

const MarketingCampaignsDisplay = ({ onBack }) => {
  const { promotions, isLoading, fetchPromotions } = useAdvertisingPromotion();

  const handleRefresh = () => {
    fetchPromotions();
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper to parse JSON string for channels
  const parseChannels = (channelsString) => {
    try {
      const channels = JSON.parse(channelsString);
      return Object.keys(channels).filter(channel => channels[channel]);
    } catch (error) {
      console.error('Error parsing channels:', error);
      return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Marketing Campaigns</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> View Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading promotions...</div>
      ) : promotions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-muted-foreground mb-4">
              No advertising promotions found
            </p>
            <Button onClick={onBack} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create New Promotion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{promotion.title}</CardTitle>
                  <Badge>{promotion.promotion_type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-medium">Material Type:</p>
                    <p>{promotion.material_type}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status:</p>
                    <p>{promotion.status || 'Active'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Start Date:</p>
                    <p>{formatDate(promotion.start_date)}</p>
                  </div>
                  <div>
                    <p className="font-medium">End Date:</p>
                    <p>{formatDate(promotion.end_date)}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Target Audience:</p>
                  <p>{promotion.target_audience || 'N/A'}</p>
                </div>

                <div>
                  <p className="font-medium">Objectives:</p>
                  <p className="line-clamp-2">{promotion.objectives || 'N/A'}</p>
                </div>

                <div>
                  <p className="font-medium">Budget:</p>
                  <p>{promotion.budget || 'N/A'}</p>
                </div>

                <div>
                  <p className="font-medium">Channels:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {promotion.channels && parseChannels(promotion.channels).map(channel => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                    {(!promotion.channels || parseChannels(promotion.channels).length === 0) && 
                      <span className="text-muted-foreground">No channels specified</span>
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketingCampaignsDisplay;
