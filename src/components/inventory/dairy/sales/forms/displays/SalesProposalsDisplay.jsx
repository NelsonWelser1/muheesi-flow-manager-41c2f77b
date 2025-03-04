
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { showErrorToast } from "@/components/ui/notifications";

const SalesProposalsDisplay = ({ onBack }) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchSalesProposals();
  }, []);

  const fetchSalesProposals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching sales proposals:', error);
      showErrorToast(toast, "Failed to load sales proposals: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProposals = () => {
    if (activeTab === "all") return proposals;
    return proposals.filter(proposal => proposal.status === activeTab);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
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
          <CardTitle>Sales Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-8">Loading sales proposals...</div>
              ) : getFilteredProposals().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No sales proposals found.
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredProposals().map((proposal) => (
                    <Card key={proposal.proposal_id} className="overflow-hidden">
                      <div className="p-4 bg-muted/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">Proposal for {proposal.customer_name || 'Unnamed Customer'}</h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {proposal.proposal_id || 'N/A'} &bull; Created: {formatDate(proposal.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(proposal.status)}
                            <Button variant="ghost" size="icon" title="View Proposal">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Download Proposal">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                          <div>
                            <p className="text-sm font-medium">Proposal Date</p>
                            <p className="text-sm">{formatDate(proposal.proposal_date)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Valid For</p>
                            <p className="text-sm">{proposal.validity_period || 30} days</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Grand Total</p>
                            <p className="text-sm font-bold">{formatCurrency(proposal.grand_total)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium">Customer Details</p>
                            <p className="text-sm">{proposal.customer_name}</p>
                            <p className="text-sm">{proposal.customer_email}</p>
                            <p className="text-sm">{proposal.customer_phone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Products</p>
                            <p className="text-sm">{(proposal.products || []).length} items</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium mb-2">Products</p>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-full table-auto text-sm">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left p-2">Product</th>
                                  <th className="text-right p-2">Quantity</th>
                                  <th className="text-right p-2">Price</th>
                                  <th className="text-right p-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(proposal.products || []).slice(0, 3).map((product, idx) => (
                                  <tr key={idx} className="border-b border-gray-100">
                                    <td className="p-2">{product.name}</td>
                                    <td className="text-right p-2">{product.quantity}</td>
                                    <td className="text-right p-2">${parseFloat(product.price).toFixed(2)}</td>
                                    <td className="text-right p-2">${parseFloat(product.total).toFixed(2)}</td>
                                  </tr>
                                ))}
                                {(proposal.products || []).length > 3 && (
                                  <tr>
                                    <td colSpan="4" className="p-2 text-center text-muted-foreground">
                                      + {proposal.products.length - 3} more items
                                    </td>
                                  </tr>
                                )}
                                {(proposal.products || []).length === 0 && (
                                  <tr>
                                    <td colSpan="4" className="p-2 text-center text-muted-foreground">
                                      No products in this proposal
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

export default SalesProposalsDisplay;
