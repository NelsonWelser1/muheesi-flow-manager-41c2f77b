import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PackingListForm from './packing-list/PackingListForm';
import PackingListTable from './packing-list/PackingListTable';

const PackingList = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Packing List</CardTitle>
        </CardHeader>
        <CardContent>
          <PackingListForm />
        </CardContent>
      </Card>
      <PackingListTable />
    </div>
  );
};

export default PackingList;