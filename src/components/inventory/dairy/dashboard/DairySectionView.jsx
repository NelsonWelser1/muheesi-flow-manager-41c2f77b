
import React from 'react';
import SectionHeader from './components/SectionHeader';
import CategorySelection from './components/CategorySelection';
import CategoryContent from './components/CategoryContent';
import SalesOrderForm from '../sales/forms/SalesOrderForm';
import DeliveryNotesForm from '../sales/forms/DeliveryNotesForm';
import CustomerInvoiceForm from '../sales/forms/CustomerInvoiceForm';
import BillsExpensesForm from '../accounts/forms/BillsExpensesForm';
import PaymentsReceiptsForm from '../accounts/forms/PaymentsReceiptsForm';
import PayrollPayslipsForm from '../accounts/forms/PayrollPayslipsForm';

const DairySectionView = ({ section, onBack }) => {
  const [activeForm, setActiveForm] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState(null);

  console.log('Rendering DairySectionView for:', section.title);

  const renderContent = () => {
    // Handle form rendering
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
    
    // If no form is active, render the section component or category UI
    return section.component && <section.component />;
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <SectionHeader 
        title={section.title}
        status={section.status}
        notifications={section.notifications}
        onBack={onBack}
      />

      {/* Sales & Accounts special handling */}
      {section.title === "Sales & Accounts" && !activeForm && !activeCategory && (
        <CategorySelection onSelectCategory={setActiveCategory} />
      )}

      {section.title === "Sales & Accounts" && !activeForm && activeCategory && (
        <CategoryContent 
          activeCategory={activeCategory}
          onBackToCategories={handleBackToCategories}
          onSelectForm={setActiveForm}
        />
      )}

      {renderContent()}
    </div>
  );
};

export default DairySectionView;
