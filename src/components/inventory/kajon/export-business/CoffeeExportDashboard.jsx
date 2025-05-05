
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import OrdersList from './modules/order-management/OrdersList';
import Shipments from '../equator-export/shipments/Shipments';
import QuoteManagement from './quotations/QuoteManagement';
import CustomerManagement from './customers/CustomerManagement';
import { useUserRole } from '@/integrations/supabase/hooks/useAuth';

const CoffeeExportDashboard = ({ viewOnly = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: userRole } = useUserRole();
  const isAdmin = userRole?.role === 'admin';

  const mockOrders = [
    {
      id: 'ORD-001',
      customer: 'Global Coffee Traders Ltd',
      date: '2023-06-15',
      total: '$45,600',
      status: 'Processing',
      items: [
        { product: 'Arabica AA', quantity: '1200 kg', price: '$28/kg' },
        { product: 'Robusta Screen 18', quantity: '600 kg', price: '$15/kg' }
      ]
    },
    {
      id: 'ORD-002',
      customer: 'European Coffee Imports GmbH',
      date: '2023-06-10',
      total: '$32,400',
      status: 'Shipped',
      items: [
        { product: 'Arabica AB', quantity: '900 kg', price: '$24/kg' },
        { product: 'Arabica PB', quantity: '400 kg', price: '$26/kg' }
      ]
    },
    {
      id: 'ORD-003',
      customer: 'North American Coffee Co.',
      date: '2023-06-05',
      total: '$64,800',
      status: 'Completed',
      items: [
        { product: 'Arabica AA', quantity: '1800 kg', price: '$28/kg' },
        { product: 'Robusta Organic', quantity: '800 kg', price: '$18/kg' }
      ]
    }
  ];

  const handleCreateOrder = () => {
    // In view-only mode, this wouldn't be allowed
    if (viewOnly) return;
    
    console.log('Creating new order');
    // Actual implementation to create a new order would go here
  };

  const handleGoHome = () => {
    navigate('/manage-inventory');
  };

  return (
    <div className="space-y-6">
      {viewOnly && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 mb-4">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            You are viewing the Export Dashboard in read-only mode. Data entry and modifications are only available to operational staff.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={handleGoHome} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
        {isAdmin && (
          <Button variant="secondary">Update About Us</Button>
        )}
      </div>
      
      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Orders & Contracts</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="quotes">Quotes & Pricing</TabsTrigger>
          <TabsTrigger value="customers">Customer Management</TabsTrigger>
          <TabsTrigger value="analytics">Export Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <Card>
            <CardContent className="pt-6">
              <OrdersList orders={mockOrders} onCreateOrder={handleCreateOrder} viewOnly={viewOnly} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipments">
          <Card>
            <CardContent className="pt-6">
              <Shipments viewOnly={viewOnly} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes">
          <Card>
            <CardContent className="pt-6">
              <QuoteManagement viewOnly={viewOnly} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardContent className="pt-6">
              <CustomerManagement viewOnly={viewOnly} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Export Analytics</h3>
              <p>Analyze export performance, trends, and opportunities.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoffeeExportDashboard;
