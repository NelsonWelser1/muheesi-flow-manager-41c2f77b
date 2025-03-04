
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { showErrorToast } from "@/components/ui/notifications";

const PricingSheetsDisplay = ({ onBack }) => {
  const [pricingSheets, setPricingSheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingSheets();
  }, []);

  const fetchPricingSheets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricing_sheets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPricingSheets(data || []);
    } catch (error) {
      console.error('Error fetching pricing sheets:', error);
      showErrorToast(toast, "Failed to load pricing sheets: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredPricingSheets = () => {
    if (activeTab === "all") return pricingSheets;
    return pricingSheets.filter(sheet => sheet.status === activeTab);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
          <CardTitle>Pricing Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-8">Loading pricing sheets...</div>
              ) : getFilteredPricingSheets().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pricing sheets found.
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredPricingSheets().map((sheet) => (
                    <Card key={sheet.id} className="overflow-hidden">
                      <div className="p-4 bg-muted/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{sheet.title || 'Untitled Pricing Sheet'}</h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {sheet.sheet_id || 'N/A'} &bull; Created on: {formatDate(sheet.created_at)}
                            </p>
                          </div>
                          <div>{getStatusBadge(sheet.status)}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <p className="text-sm font-medium">Effective Date</p>
                            <p className="text-sm">{formatDate(sheet.effective_date)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Expiry Date</p>
                            <p className="text-sm">{formatDate(sheet.expiry_date)}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm line-clamp-2">{sheet.description || 'No description'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Products ({(sheet.products || []).length})</p>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-full table-auto text-sm">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left p-2">Product</th>
                                  <th className="text-right p-2">Unit Price</th>
                                  <th className="text-right p-2">Discount(%)</th>
                                  <th className="text-right p-2">Final Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(sheet.products || []).slice(0, 3).map((product, idx) => (
                                  <tr key={idx} className="border-b border-gray-100">
                                    <td className="p-2">{product.name}</td>
                                    <td className="text-right p-2">${parseFloat(product.base_price).toFixed(2)}</td>
                                    <td className="text-right p-2">{parseFloat(product.discount || 0).toFixed(2)}%</td>
                                    <td className="text-right p-2">${parseFloat(product.final_price).toFixed(2)}</td>
                                  </tr>
                                ))}
                                {(sheet.products || []).length > 3 && (
                                  <tr>
                                    <td colSpan="4" className="p-2 text-center text-muted-foreground">
                                      + {sheet.products.length - 3} more products
                                    </td>
                                  </tr>
                                )}
                                {(sheet.products || []).length === 0 && (
                                  <tr>
                                    <td colSpan="4" className="p-2 text-center text-muted-foreground">
                                      No products in this pricing sheet
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
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

export default PricingSheetsDisplay;
