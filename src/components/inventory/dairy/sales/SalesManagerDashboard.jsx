import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/manage-inventory/grand-berna-sales')}
              className="hover:bg-gray-100"
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

          <div className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold">Grand Berna Dairies - Sales Manager Dashboard</h1>
          </div>

          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto border-b border-gray-200">
              <TabsTrigger value="quotes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Quotes</TabsTrigger>
              <TabsTrigger value="proforma" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Proforma Invoices</TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Orders</TabsTrigger>
              <TabsTrigger value="delivery" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Delivery Notes</TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Invoices</TabsTrigger>
              <TabsTrigger value="packing" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">Packing List</TabsTrigger>
            </TabsList>

            <div className="mt-6 border-t border-gray-200">
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
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagerDashboard;