
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Barcode, ArrowLeft } from "lucide-react";
import PackagingForm from './PackagingForm';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

const PackagingManagement = () => {
  const navigate = useNavigate();
  const [packagingData, setPackagingData] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [batchIds, setBatchIds] = useState([]);
  const { toast } = useToast();

  // Fetch batch IDs from cold room inventory
  useEffect(() => {
    const fetchBatchIds = async () => {
      try {
        const { data, error } = await supabase
          .from('cold_room_inventory')
          .select('batch_id')
          .order('storage_date_time', { ascending: false });

        if (error) throw error;
        
        // Extract unique batch IDs
        const uniqueBatchIds = [...new Set(data.map(item => item.batch_id))];
        setBatchIds(uniqueBatchIds);
      } catch (error) {
        console.error('Error fetching batch IDs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch batch IDs",
          variant: "destructive"
        });
      }
    };

    fetchBatchIds();
  }, [toast]);

  // Handle form submission
  const handlePackagingSubmit = async (data) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit records",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('packaging_records')
        .insert([{
          batch_id: data.batchId,
          cheese_type: data.cheeseType,
          package_size: data.packageSize,
          quantity: data.quantity,
          package_material: data.packageMaterial,
          package_weight: data.packageWeight,
          created_by: user.id,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setPackagingData([...packagingData, { ...data, id: Date.now() }]);
      
      toast({
        title: "Success",
        description: "Packaging record saved successfully"
      });
    } catch (error) {
      console.error('Error saving packaging record:', error);
      toast({
        title: "Error",
        description: "Failed to save packaging record",
        variant: "destructive"
      });
    }
  };

  // Fetch packaging records
  useEffect(() => {
    const fetchPackagingRecords = async () => {
      try {
        const { data, error } = await supabase
          .from('packaging_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPackagingData(data);
      } catch (error) {
        console.error('Error fetching packaging records:', error);
        toast({
          title: "Error",
          description: "Failed to fetch packaging records",
          variant: "destructive"
        });
      }
    };

    fetchPackagingRecords();
  }, [toast]);

  // Navigate back to main packaging & labeling page
  const handleBack = () => {
    navigate("/manage-inventory/grand-berna-dairies/packaging-and-labeling", {
      state: { selectedTab: "packaging" }
    });
  };

  return (
    <div className="space-y-6 container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Packaging & Labeling
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Packaging Management</h2>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Packaging Entry</CardTitle>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowScanner(!showScanner)}
              >
                <Barcode className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PackagingForm onSubmit={handlePackagingSubmit} batchIds={batchIds} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Packaging Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Weight (g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packagingData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.batch_id}</TableCell>
                      <TableCell>{item.cheese_type}</TableCell>
                      <TableCell>{item.package_size}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.package_material}</TableCell>
                      <TableCell>{item.package_weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PackagingManagement;
