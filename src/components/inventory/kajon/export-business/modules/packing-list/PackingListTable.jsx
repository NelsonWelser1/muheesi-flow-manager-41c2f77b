import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PackingListTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Packing Lists</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Packing List #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Importer</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Add your table rows here */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PackingListTable;