
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Barcode } from "lucide-react";
import PackagingForm from './PackagingForm';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from "@/integrations/supabase/auth";

const PackagingManagement = () => {
  const navigate = useNavigate();
  const [packagingData, setPackagingData] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();
  const { session } = useSupabaseAuth();

  const handlePackagingSubmit = async (data) => {
    try {
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save packaging records",
          variant: "destructive",
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
          created_at: new Date().toISOString(),
          created_by: session.user.id
        }]);

      if (error) throw error;

      fetchPackagingRecords();
      
      toast({
        title: "Success",
        description: "Packaging record saved successfully",
      });
    } catch (error) {
      console.error('Error saving packaging record:', error);
      toast({
        title: "Error",
        description: "Failed to save packaging record",
        variant: "destructive",
      });
    }
  };

  const fetchPackagingRecords = async () => {
    try {
      if (!session?.user) {
        console.log('No authenticated user');
        return;
      }

      const { data, error } = await supabase
        .from('packaging_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackagingData(data || []);
    } catch (error) {
      console.error('Error fetching packaging records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packaging records",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (session?.user) {
      fetchPackagingRecords();
    }
  }, [session]);

  if (!session?.user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access packaging management.</p>
            <Button onClick={() => navigate('/login')}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Packaging Management</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Back</Button>
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
            <PackagingForm onSubmit={handlePackagingSubmit} />
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
