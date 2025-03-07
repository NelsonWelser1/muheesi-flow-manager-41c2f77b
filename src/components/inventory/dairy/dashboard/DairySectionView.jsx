
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell, DollarSign, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesOrderForm from '../sales/forms/SalesOrderForm';
import DeliveryNotesForm from '../sales/forms/DeliveryNotesForm';
import CustomerInvoiceForm from '../sales/forms/CustomerInvoiceForm';

const DairySectionView = ({ section, onBack }) => {
  const [activeForm, setActiveForm] = React.useState(null);

  console.log('Rendering DairySectionView for:', section.title);

  const renderContent = () => {
    if (activeForm === 'sales') {
      return <SalesOrderForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'accounts') {
      return <CustomerInvoiceForm onBack={() => setActiveForm(null)} />;
    } else if (activeForm === 'delivery') {
      return <DeliveryNotesForm onBack={() => setActiveForm(null)} />;
    }
    return section.component && <section.component />;
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to Dashboard
      </button>
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{section.title}</h1>
        <div className="flex items-center gap-2">
          <Badge className={`bg-${section.status === 'operational' ? 'green' : section.status === 'maintenance' ? 'yellow' : 'red'}-500`}>
            {section.status.charAt(0).toUpperCase() + section.status.slice(1)}
          </Badge>
          {section.notifications > 0 && (
            <Badge variant="secondary">
              <Bell className="h-4 w-4 mr-1" />
              {section.notifications} notifications
            </Badge>
          )}
        </div>
      </div>

      {section.title === "Sales & Marketing" && !activeForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => setActiveForm('sales')}
            className="h-24 text-lg flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#0000a0', color: 'white' }}
          >
            <DollarSign className="h-6 w-6" />
            Sales
          </Button>
          <Button
            onClick={() => setActiveForm('accounts')}
            className="h-24 text-lg flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#0000a0', color: 'white' }}
          >
            <Receipt className="h-6 w-6" />
            Accounts
          </Button>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default DairySectionView;
