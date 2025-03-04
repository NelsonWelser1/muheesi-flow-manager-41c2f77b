
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/supabase";
import { Loader2, Search, ArrowLeft, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from "@/components/ui/notifications";
import { format } from 'date-fns';

export const PricingSheetsDisplay = ({ onBack }) => {
  const [pricingSheets, setPricingSheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingSheets();
  }, []);

  const fetchPricingSheets = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching pricing sheets...');
      
      const { data, error } = await supabase
        .from('pricing_sheets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pricing sheets:', error);
        showErrorToast(toast, "Failed to load pricing sheets: " + error.message);
        throw error;
      }

      console.log('Pricing sheets fetched:', data);
      setPricingSheets(data || []);
      setFilteredSheets(data || []);
    } catch (error) {
      console.error('Error in fetchPricingSheets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim() && activeTab === "all") {
      setFilteredSheets(pricingSheets);
      return;
    }

    const filtered = pricingSheets.filter(sheet => {
      // Filter by search term
      const matchesSearch = searchTerm.trim() === '' || 
        sheet.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.sheet_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status tab
      const matchesTab = activeTab === "all" || sheet.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
    
    setFilteredSheets(filtered);
  }, [searchTerm, activeTab, pricingSheets]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing Sheets</CardTitle>
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pricing sheets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSheets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pricing sheets found.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sheet ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSheets.map((sheet) => (
                  <TableRow key={sheet.id}>
                    <TableCell className="font-medium">{sheet.sheet_id}</TableCell>
                    <TableCell>{sheet.title}</TableCell>
                    <TableCell>{getStatusBadge(sheet.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(sheet.effective_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sheet.expiry_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(sheet.expiry_date)}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {Array.isArray(sheet.products) ? sheet.products.length : 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingSheetsDisplay;
