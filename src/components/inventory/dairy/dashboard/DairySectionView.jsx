import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell, DollarSign, Receipt, FileText, Calculator, CreditCard, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SalesOrderForm from '../sales/forms/SalesOrderForm';
import DeliveryNotesForm from '../sales/forms/DeliveryNotesForm';
import CustomerInvoiceForm from '../sales/forms/CustomerInvoiceForm';
import BillsExpensesForm from '../accounts/forms/BillsExpensesForm';
import PaymentsReceiptsForm from '../accounts/forms/PaymentsReceiptsForm';
import PayrollPayslipsForm from '../accounts/forms/PayrollPayslipsForm';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { useNotifications } from '@/hooks/useNotifications';
import { useOperationalAlerts } from '@/hooks/useOperationalAlerts';
const DairySectionView = ({
  section,
  onBack
}) => {
  const [activeForm, setActiveForm] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState(null);
  const {
    addNotification
  } = useNotifications();
  const {
    operationalAlerts
  } = useOperationalAlerts();
  console.log('Rendering DairySectionView for:', section.title);

  // Add sample notification when section loads
  React.useEffect(() => {
    if (section.title) {
      addNotification({
        title: `${section.title} Accessed`,
        message: `You have accessed the ${section.title} section`,
        type: 'info'
      });
    }
  }, [section.title, addNotification]);
  const renderContent = () => {
    if (activeForm === 'sales') {
      return <SalesOrderForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'invoice') {
      return <CustomerInvoiceForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'delivery') {
      return <DeliveryNotesForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'bills') {
      return <BillsExpensesForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'payments') {
      return <PaymentsReceiptsForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'payroll') {
      return <PayrollPayslipsForm onBack={() => setActiveForm(null)} />;
    }
    return section.component && <section.component />;
  };
  const renderSalesTiles = () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('sales')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Sales Orders</CardTitle>
          <DollarSign className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create and manage sales orders for customers.
          </p>
          <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700" onClick={() => setActiveForm('sales')}>
            Create Sales Order
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('delivery')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Delivery Notes</CardTitle>
          <Receipt className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generate delivery notes for product shipments.
          </p>
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" onClick={() => setActiveForm('delivery')}>
            Create Delivery Note
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('invoice')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Customer Invoices</CardTitle>
          <FileText className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generate and manage customer invoices.
          </p>
          <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700" onClick={() => setActiveForm('invoice')}>
            Create Invoice
          </Button>
        </CardContent>
      </Card>
    </div>;
  const renderAccountsTiles = () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('bills')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Bills & Expenses</CardTitle>
          <Calculator className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track and manage company expenses and bills.
          </p>
          <Button className="mt-4 w-full bg-red-600 hover:bg-red-700" onClick={() => setActiveForm('bills')}>
            Record Bills & Expenses
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('payments')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Payments & Receipts</CardTitle>
          <CreditCard className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track incoming and outgoing payments.
          </p>
          <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700" onClick={() => setActiveForm('payments')}>
            Manage Payments
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveForm('payroll')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">Payroll & Payslips</CardTitle>
          <Users className="h-5 w-5 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage employee payroll and generate payslips.
          </p>
          <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setActiveForm('payroll')}>
            Manage Payroll
          </Button>
        </CardContent>
      </Card>
    </div>;
  return <div className="max-w-[1200px] mx-auto p-4">
      <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        ← Back to Dashboard
      </button>
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{section.title}</h1>
        <div className="flex items-center gap-4">
          {/* Notification Center */}
          <NotificationCenter />
          
          {/* Section Status and Notifications */}
          <div className="flex items-center gap-2">
            <Badge className={`bg-${section.status === 'operational' ? 'green' : section.status === 'maintenance' ? 'yellow' : 'red'}-500`}>
              {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
            </Badge>
            {section.notifications > 0}
            {operationalAlerts.length > 0 && <Popover>
                <PopoverTrigger asChild>
                  
                </PopoverTrigger>
                <PopoverContent className="w-80 max-h-[400px] overflow-auto" align="end">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Operational Alerts</h4>
                    {operationalAlerts.map(alert => <div key={alert.id} className="p-3 rounded-lg border bg-red-50 border-red-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-red-900">
                              {alert.title}
                            </h5>
                            <p className="text-xs text-red-700 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </PopoverContent>
              </Popover>}
          </div>
        </div>
      </div>

      {section.title === "Sales & Accounts" && !activeForm && !activeCategory && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveCategory('sales')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Sales</CardTitle>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-md text-muted-foreground">
                Manage sales orders, deliveries, and customer invoices.
              </p>
              <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-lg py-6" onClick={() => setActiveCategory('sales')}>
                Access Sales Management
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveCategory('accounts')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Accounts</CardTitle>
              <Calculator className="h-8 w-8 text-red-600" />
            </CardHeader>
            <CardContent>
              <p className="text-md text-muted-foreground">
                Manage bills, payments, and payroll functions.
              </p>
              <Button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-lg py-6" onClick={() => setActiveCategory('accounts')}>
                Access Accounts Management
              </Button>
            </CardContent>
          </Card>
        </div>}

      {section.title === "Sales & Accounts" && !activeForm && activeCategory === 'sales' && <>
          <button onClick={() => setActiveCategory(null)} className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            ← Back to Categories
          </button>
          <h2 className="text-2xl font-bold mb-4">Sales Management</h2>
          {renderSalesTiles()}
        </>}

      {section.title === "Sales & Accounts" && !activeForm && activeCategory === 'accounts' && <>
          <button onClick={() => setActiveCategory(null)} className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            ← Back to Categories
          </button>
          <h2 className="text-2xl font-bold mb-4">Accounts Management</h2>
          {renderAccountsTiles()}
        </>}

      {renderContent()}
    </div>;
};
export default DairySectionView;