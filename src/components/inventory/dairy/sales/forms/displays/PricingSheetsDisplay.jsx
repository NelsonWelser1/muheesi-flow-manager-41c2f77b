
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/supabase";
import { Input } from "@/components/ui/input";
import { showErrorToast } from "@/components/ui/notifications";
import { useToast } from "@/components/ui/use-toast";

export const PricingSheetsDisplay = ({ onBack }) => {
  const [pricingSheets, setPricingSheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingSheets();
  }, []);

  const fetchPricingSheets = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching pricing sheets...');
      
      const { data, error } = await supabase
        .from('pricing_sheets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching pricing sheets:', error);
        showErrorToast(toast, "Failed to fetch pricing sheets");
        return;
      }
      
      console.log('Pricing sheets fetched successfully:', data);
      setPricingSheets(data || []);
    } catch (error) {
      console.error('Error in fetchPricingSheets:', error);
      showErrorToast(toast, "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (pricingSheet) => {
    try {
      // Convert pricing sheet to JSON string
      const dataStr = JSON.stringify(pricingSheet, null, 2);
      // Create a blob with the data
      const blob = new Blob([dataStr], { type: 'application/json' });
      // Create an object URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = `pricing-sheet-${pricingSheet.sheet_id}.json`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting pricing sheet:', error);
      showErrorToast(toast, "Failed to export pricing sheet");
    }
  };

  const filteredSheets = searchTerm.trim() === '' 
    ? pricingSheets 
    : pricingSheets.filter(sheet => 
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.sheet_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.status.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing Sheets</CardTitle>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Form
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pricing sheets..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading pricing sheets...</div>
          ) : filteredSheets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm.trim() !== '' 
                ? "No pricing sheets match your search criteria" 
                : "No pricing sheets found. Create one to get started!"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSheets.map((sheet, index) => (
                <Card key={sheet.id} className="overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{sheet.title}</h3>
                      <p className="text-sm text-muted-foreground">ID: {sheet.sheet_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(sheet)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" /> Export
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm">{sheet.status}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Effective Date</p>
                        <p className="text-sm">{new Date(sheet.effective_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Expiry Date</p>
                        <p className="text-sm">{sheet.expiry_date ? new Date(sheet.expiry_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Products</p>
                        <p className="text-sm">{sheet.products.length} products</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">{sheet.description || 'No description provided'}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium">Products</p>
                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-1">Name</th>
                              <th className="text-left py-2 px-1">Category</th>
                              <th className="text-right py-2 px-1">Base Price</th>
                              <th className="text-right py-2 px-1">Discount</th>
                              <th className="text-right py-2 px-1">Final Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sheet.products.map((product, idx) => (
                              <tr key={idx} className="border-b last:border-b-0">
                                <td className="py-2 px-1">{product.name}</td>
                                <td className="py-2 px-1">{product.category}</td>
                                <td className="py-2 px-1 text-right">${parseFloat(product.base_price).toFixed(2)}</td>
                                <td className="py-2 px-1 text-right">{parseFloat(product.discount).toFixed(2)}%</td>
                                <td className="py-2 px-1 text-right">${parseFloat(product.final_price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
