import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeliveryNoteForm from './delivery-note/DeliveryNoteForm';
import DeliveryNoteList from './delivery-note/DeliveryNoteList';

const DeliveryManagement = () => {
  const [view, setView] = useState('list');
  
  return (
    <div className="space-y-6">
      {view === 'list' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Delivery Notes</h2>
            <Button onClick={() => setView('form')}>Create New Delivery Note</Button>
          </div>
          <DeliveryNoteList />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create Delivery Note</h2>
            <Button variant="outline" onClick={() => setView('list')}>Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <DeliveryNoteForm onBack={() => setView('list')} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;