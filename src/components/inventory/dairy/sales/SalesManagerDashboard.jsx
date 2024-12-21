import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import QuoteManagement from '../../kajon/export-business/quotations/QuoteManagement';
import ProformaInvoice from '../../kajon/export-business/quotations/ProformaInvoice';
import OrderManagement from '../../kajon/export-business/OrderManagement';
import DeliveryManagement from '../../kajon/export-business/modules/DeliveryManagement';
import InvoiceManagement from '../../kajon/export-business/modules/InvoiceManagement';
import PackingList from '../../kajon/export-business/modules/PackingList';

const SalesManagerDashboard = () => {
  console.log('Rendering GrandBerna SalesManagerDashboard');
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage-inventory/grand-berna-sales')}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{currentTime}</span>
          </div>
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-600">Sales Manager</p>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Grand Berna Dairies - Sales Manager Dashboard</h1>
      </div>

      <Tabs defaultValue="quotes" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="proforma">Proforma Invoices</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Notes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="packing">Packing List</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <QuoteManagement />
        </TabsContent>

        <TabsContent value="proforma">
          <ProformaInvoice />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="delivery">
          <DeliveryManagement />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceManagement />
        </TabsContent>

        <TabsContent value="packing">
          <PackingList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesManagerDashboard;