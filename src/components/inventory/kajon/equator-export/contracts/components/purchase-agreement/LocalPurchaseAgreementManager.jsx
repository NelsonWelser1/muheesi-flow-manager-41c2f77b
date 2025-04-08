
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, ArrowUpDown, FileText, Loader } from "lucide-react";
import { useLocalPurchaseAgreements } from "@/hooks/useLocalPurchaseAgreements";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { initializeDatabase } from '@/integrations/supabase/hooks/runMigration';

const LocalPurchaseAgreementManager = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { agreements, fetchAgreements } = useLocalPurchaseAgreements();
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDatabase();
        const result = await fetchAgreements();
        setLoading(false);
      } catch (error) {
        console.error("Error loading agreements:", error);
        toast({
          title: "Error",
          description: "Failed to load purchase agreements",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchAgreements, toast]);
  
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (error) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading purchase agreements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Purchase Agreements</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Agreement
        </Button>
      </div>
      
      {agreements && agreements.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Agreement #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agreements.map((agreement) => (
                    <TableRow key={agreement.id}>
                      <TableCell className="font-medium">{agreement.contract_number}</TableCell>
                      <TableCell>{agreement.supplier_name}</TableCell>
                      <TableCell>{formatDate(agreement.agreement_date)}</TableCell>
                      <TableCell>{formatCurrency(agreement.total_value)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {agreement.contract_status || 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20">
          <FileText className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">No purchase agreements found</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Create your first purchase agreement to keep track of your agreements with suppliers.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Agreement
          </Button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">New Purchase Agreement</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  Close
                </Button>
              </div>
              
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  The full purchase agreement form is still under development.
                </p>
                <Button onClick={() => setShowForm(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LocalPurchaseAgreementManager;
