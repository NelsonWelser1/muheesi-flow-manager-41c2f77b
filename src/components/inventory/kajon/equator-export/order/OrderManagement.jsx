
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, FileText, ClipboardList, ShoppingCart, Truck, Receipt, 
  Package, FileCheck, RefreshCw, Search, Calendar, Download, ArrowUpDown,
  ChevronLeft, Filter, Plus, FileSpreadsheet
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import ExportButtons from "@/components/ui/data-export/ExportButtons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sub-components for Order Management
import OrderDashboard from './components/OrderDashboard';
import QuotationsList from './components/QuotationsList';
import QuotationForm from './components/QuotationForm';
import ProformaList from './components/ProformaList';
import ProformaForm from './components/ProformaForm';
import OrdersList from './components/OrdersList';
import OrderForm from './components/OrderForm';
import DeliveryNotesList from './components/DeliveryNotesList';
import DeliveryNoteForm from './components/DeliveryNoteForm';
import InvoicesList from './components/InvoicesList';
import InvoiceForm from './components/InvoiceForm';
import PackingLists from './components/PackingLists';
import PackingListForm from './components/PackingListForm';
import CertificatesList from './components/CertificatesList';
import CertificateForm from './components/CertificateForm';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('list');
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Handle going back from form to list view
  const handleBack = () => {
    setCurrentView('list');
  };

  // Handle creating new items
  const handleCreate = () => {
    setCurrentView('form');
  };

  // Handle refresh data
  const handleRefresh = () => {
    // Would normally fetch fresh data here
    console.log('Refreshing data for:', activeTab);
  };

  // Return to list view when changing tabs
  React.useEffect(() => {
    setCurrentView('list');
  }, [activeTab]);

  // Render the active content based on tab and view
  const renderContent = () => {
    if (currentView === 'form') {
      switch (activeTab) {
        case 'quotations':
          return <QuotationForm onBack={handleBack} />;
        case 'proforma':
          return <ProformaForm onBack={handleBack} />;
        case 'orders':
          return <OrderForm onBack={handleBack} />;
        case 'delivery':
          return <DeliveryNoteForm onBack={handleBack} />;
        case 'invoices':
          return <InvoiceForm onBack={handleBack} />;
        case 'packing':
          return <PackingListForm onBack={handleBack} />;
        case 'certificates':
          return <CertificateForm onBack={handleBack} />;
        default:
          return null;
      }
    }

    // List view for each tab
    switch (activeTab) {
      case 'dashboard':
        return <OrderDashboard />;
      case 'quotations':
        return <QuotationsList onCreateNew={handleCreate} />;
      case 'proforma':
        return <ProformaList onCreateNew={handleCreate} />;
      case 'orders':
        return <OrdersList onCreateNew={handleCreate} />;
      case 'delivery':
        return <DeliveryNotesList onCreateNew={handleCreate} />;
      case 'invoices':
        return <InvoicesList onCreateNew={handleCreate} />;
      case 'packing':
        return <PackingLists onCreateNew={handleCreate} />;
      case 'certificates':
        return <CertificatesList onCreateNew={handleCreate} />;
      default:
        return null;
    }
  };

  // Determine if we should show the toolbar (not shown on dashboard)
  const showToolbar = activeTab !== 'dashboard';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="quotations" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Quotations</span>
          </TabsTrigger>
          <TabsTrigger value="proforma" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Proforma</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Delivery Notes</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span>Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="packing" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Packing Lists</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span>Certificates</span>
          </TabsTrigger>
        </TabsList>

        {/* Toolbar for filter and actions, only shown when not in dashboard or form view */}
        {showToolbar && currentView === 'list' && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Status filter */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    size="sm" 
                    variant={statusFilter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('pending')}
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={statusFilter === 'processing' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('processing')}
                  >
                    Processing
                  </Button>
                  <Button 
                    size="sm" 
                    variant={statusFilter === 'completed' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('completed')}
                  >
                    Completed
                  </Button>
                </div>
                
                {/* Time range filter, search and actions */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Select defaultValue={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[160px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Last Hour</SelectItem>
                      <SelectItem value="day">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-8 w-[200px]" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleRefresh}
                    title="Refresh data"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <ExportButtons 
                    data={[]} 
                    filename={`export-${activeTab}`}
                  />
                  
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back button when in form view */}
        {currentView === 'form' && (
          <div className="mb-4">
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to List
            </Button>
          </div>
        )}

        {/* Content area */}
        <div className="space-y-4">
          {renderContent()}
        </div>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
