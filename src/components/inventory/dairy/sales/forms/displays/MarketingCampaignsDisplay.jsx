
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Download, Calendar, DollarSign, Tag, Flag, Clock } from "lucide-react";
import { useAdvertisingPromotions } from '../hooks/useAdvertisingPromotions';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const MarketingCampaignsDisplay = ({ onBack }) => {
  const { promotions, isLoading } = useAdvertisingPromotions();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter promotions based on search term and active tab
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.promotion_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.material_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.promotion_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && promo.status?.toLowerCase() === activeTab.toLowerCase();
  });

  // Helper function to get badge variant based on status
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'planning': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Debug function
  const handleDebugClick = (promotion) => {
    console.log('Promotion details:', promotion);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Menu
        </Button>
        <h2 className="text-2xl font-bold">Marketing Campaigns & Promotions</h2>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Marketing Campaigns</CardTitle>
            <div className="relative w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="pt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading campaigns...</p>
                </div>
              ) : filteredPromotions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No marketing campaigns found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPromotions.map((promotion) => (
                    <Card key={promotion.id} className="overflow-hidden border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant={getStatusVariant(promotion.status)}>
                              {promotion.status || 'Unknown'}
                            </Badge>
                            <h3 className="text-lg font-semibold mt-2">{promotion.title}</h3>
                            <p className="text-sm text-muted-foreground">ID: {promotion.promotion_id}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDebugClick(promotion)}
                            title="Debug: Log promotion details to console"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{promotion.promotion_type || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{promotion.material_type || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{promotion.budget || 'N/A'}</span>
                            </div>
                          </div>
                          
                          {promotion.objectives && (
                            <div className="pt-2">
                              <h4 className="text-sm font-medium">Objectives:</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {promotion.objectives}
                              </p>
                            </div>
                          )}
                          
                          {promotion.assets_urls && promotion.assets_urls.length > 0 && (
                            <div className="pt-2">
                              <h4 className="text-sm font-medium">Files:</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {promotion.assets_urls.map((asset, index) => (
                                  <a
                                    key={index}
                                    href={asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded hover:bg-secondary/80"
                                  >
                                    <Download className="h-3 w-3" />
                                    {asset.name.length > 15 ? `${asset.name.substring(0, 12)}...` : asset.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
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

export default MarketingCampaignsDisplay;
