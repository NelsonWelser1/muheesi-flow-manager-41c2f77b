
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrCode } from "lucide-react";
import LabelingForm from './LabelingForm';
import { useNavigate } from "react-router-dom";

const LabelingManagement = () => {
  const navigate = useNavigate();
  const [labelingData, setLabelingData] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const handleLabelingSubmit = (data) => {
    setLabelingData([...labelingData, { ...data, id: Date.now() }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Labeling Management</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Back</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Label Entry</CardTitle>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowScanner(!showScanner)}
              >
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
                    <TableHead>Brand</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Production Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labelingData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.batchId}</TableCell>
                      <TableCell>{item.brandName}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.productionDate}</TableCell>
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

export default LabelingManagement;
