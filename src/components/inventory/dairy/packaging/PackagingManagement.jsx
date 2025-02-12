
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { barcode } from "lucide-react";
import PackagingForm from './PackagingForm';
import { useNavigate } from "react-router-dom";

const PackagingManagement = () => {
  const navigate = useNavigate();
  const [packagingData, setPackagingData] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const handlePackagingSubmit = (data) => {
    setPackagingData([...packagingData, { ...data, id: Date.now() }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Packaging Management</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Back</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Packaging Entry</CardTitle>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowScanner(!showScanner)}
              >
                <barcode className="h-4 w-4" />
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packagingData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.batchId}</TableCell>
                      <TableCell>{item.cheeseType}</TableCell>
                      <TableCell>{item.packageSize}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
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
