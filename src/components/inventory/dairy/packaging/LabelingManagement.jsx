
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode } from "lucide-react";
import LabelingForm from './LabelingForm';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const LabelingManagement = () => {
  const navigate = useNavigate();
  const [labelingData, setLabelingData] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  const handleLabelingSubmit = async data => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit records",
          variant: "destructive"
        });
        return;
      }
      const {
        error
      } = await supabase.from('packaging_labeling').insert([{
        date_time: data.productionDate,
        batch_id: data.batchId,
        cheese_type: data.productName,
        packaging_size: data.netWeight,
        operator_id: user.id,
        quantity: 1,
        expiry_date: new Date(data.productionDate),
        nutritional_info: data.nutritionalInfo,
        created_by: user.id,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
      fetchLabelingRecords();
      toast({
        title: "Success",
        description: "Labeling record saved successfully"
      });
    } catch (error) {
      console.error('Error saving labeling record:', error);
      toast({
        title: "Error",
        description: "Failed to save labeling record",
        variant: "destructive"
      });
    }
  };

  const fetchLabelingRecords = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }
      const {
        data,
        error
      } = await supabase.from('packaging_labeling').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setLabelingData(data);
    } catch (error) {
      console.error('Error fetching labeling records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch labeling records",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    fetchLabelingRecords();
  }, []);

  return <div className="space-y-6 container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate("/manage-inventory/grand-berna-dairies/packaging-and-labeling", { 
            state: { selectedTab: "labeling" } 
          })}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Packaging & Labeling
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Labeling Management</h2>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Label Entry</CardTitle>
              <Button variant="outline" size="icon" onClick={() => setShowScanner(!showScanner)}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LabelingForm onSubmit={handleLabelingSubmit} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Labeling Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Production Date</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Net Weight</TableHead>
                    <TableHead>Nutritional Info</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labelingData.map(item => <TableRow key={item.id}>
                      <TableCell>{item.batch_id}</TableCell>
                      <TableCell>{new Date(item.date_time).toLocaleDateString()}</TableCell>
                      <TableCell>{item.cheese_type}</TableCell>
                      <TableCell>{item.packaging_size}</TableCell>
                      <TableCell>{item.nutritional_info}</TableCell>
                      <TableCell>{new Date(item.expiry_date).toLocaleDateString()}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default LabelingManagement;
