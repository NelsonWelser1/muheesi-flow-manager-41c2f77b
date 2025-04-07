
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, FileText, Eye, Download, Filter } from 'lucide-react';
import { useLocalPurchaseAgreements } from '@/integrations/supabase/hooks/useLocalPurchaseAgreements';
import { format } from 'date-fns';

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const LocalPurchaseAgreementList = ({ onNewAgreement, onViewAgreement }) => {
  const { toast } = useToast();
  const { fetchAgreements, loading, error } = useLocalPurchaseAgreements();
  const [agreements, setAgreements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    loadAgreements();
  }, []);
  
  const loadAgreements = async () => {
    const result = await fetchAgreements();
    if (result.success) {
      setAgreements(result.data || []);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredAgreements = agreements.filter(agreement => 
    agreement.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Local Purchase Agreements</h2>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search agreements..." 
              className="pl-8" 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            onClick={onNewAgreement}
          >
            <Plus className="h-4 w-4" />
            <span>New Agreement</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Agreement ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading agreements...
                    </TableCell>
                  </TableRow>
                ) : filteredAgreements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {searchTerm 
                        ? "No agreements match your search" 
                        : "No local purchase agreements found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgreements.map((agreement) => (
                    <TableRow key={agreement.id}>
                      <TableCell className="font-medium">
                        {agreement.contract_number}
                      </TableCell>
                      <TableCell>
                        {formatDate(agreement.agreement_date)}
                      </TableCell>
                      <TableCell>
                        <div>{agreement.supplier_name}</div>
                        <div className="text-xs text-gray-500">{agreement.supplier_contact}</div>
                      </TableCell>
                      <TableCell>
                        {agreement.items && agreement.items.length > 0 ? (
                          <div className="text-sm">
                            {agreement.items.slice(0, 2).map((item, index) => (
                              <div key={index}>
                                {item.description} ({item.quantity} {item.unit})
                              </div>
                            ))}
                            {agreement.items.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{agreement.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No items</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(agreement.total_value)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[agreement.contract_status] || statusColors.draft}>
                          {agreement.contract_status.charAt(0).toUpperCase() + agreement.contract_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="View Agreement"
                            onClick={() => onViewAgreement(agreement.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Download Agreement"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Edit Agreement"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalPurchaseAgreementList;
