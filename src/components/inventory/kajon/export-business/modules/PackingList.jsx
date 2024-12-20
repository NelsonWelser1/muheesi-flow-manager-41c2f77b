import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PackingListForm from './packing-list/PackingListForm';
import PackingListTable from './packing-list/PackingListTable';

const PackingList = () => {
  const [view, setView] = useState('list');

  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Packing Lists</h2>
            <Button onClick={() => setView('form')}>Create New Packing List</Button>
          </div>
          <PackingListTable />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create Packing List</h2>
            <Button variant="outline" onClick={() => setView('list')}>Back to List</Button>
          </div>
          <PackingListForm onBack={() => setView('list')} />
        </div>
      )}
    </div>
  );
};

export default PackingList;