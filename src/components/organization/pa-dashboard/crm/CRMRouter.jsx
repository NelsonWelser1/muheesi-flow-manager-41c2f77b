
import React from 'react';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import ContactDetails from './ContactDetails';
import MessagesView from './MessagesView';
import CallLogView from './CallLogView';
import DocumentsView from './DocumentsView';
import CompaniesView from './CompaniesView';

const CRMRouter = ({ view = 'contacts' }) => {
  const renderView = () => {
    switch (view) {
      case 'contacts':
        return <ContactList />;
      case 'add-contact':
        return <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />;
      case 'messages':
        return <MessagesView />;
      case 'calls':
        return <CallLogView />;
      case 'documents':
        return <DocumentsView />;
      case 'companies':
        return <CompaniesView />;
      case 'email':
        return (
          <div className="flex items-center justify-center h-[calc(100vh-280px)]">
            <div className="text-center">
              <h3 className="text-lg font-medium">Email Integration</h3>
              <p className="text-muted-foreground mt-2">Email functionality is coming soon.</p>
            </div>
          </div>
        );
      default:
        return <ContactList />;
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
};

export default CRMRouter;
