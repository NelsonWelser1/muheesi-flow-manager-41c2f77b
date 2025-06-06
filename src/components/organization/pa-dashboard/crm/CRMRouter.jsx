
import React, { useState } from 'react';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import ContactDetails from './ContactDetails';
import MessagesView from './MessagesView';
import CallLogView from './CallLogView';
import DocumentsView from './DocumentsView';
import CompaniesView from './CompaniesView';
import BluetoothConnectionPanel from './BluetoothConnectionPanel';
import BluetoothCRMIntegration from './BluetoothCRMIntegration';

const CRMRouter = ({ view = 'contacts' }) => {
  const [selectedContactId, setSelectedContactId] = useState(null);
  
  // Sample data for demonstration purposes
  const [contacts, setContacts] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      type: 'Client',
      company: 'KAJON Coffee Limited',
      email: 'john.doe@example.com',
      phone: '+256 123-456-7890',
      city: 'Kampala',
      country: 'Uganda',
      avatarUrl: null,
      notes: 'Key client for coffee exports. Has been with us for 5 years.'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      type: 'Vendor',
      company: 'Grand Berna Dairies',
      email: 'jane.smith@example.com',
      phone: '+256 987-654-3210',
      city: 'Entebbe',
      country: 'Uganda',
      avatarUrl: null,
      notes: 'Supplies dairy products for office events.'
    },
    {
      id: 3,
      firstName: 'David',
      lastName: 'Brown',
      type: 'Partner',
      company: 'FreshEco Farms',
      email: 'david.brown@example.com',
      phone: '+256 234-567-8901',
      city: 'Jinja',
      country: 'Uganda',
      avatarUrl: null
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Johnson',
      type: 'Lead',
      company: 'Organic Harvest Ltd',
      email: 'sarah.johnson@example.com',
      phone: '+256 345-678-9012',
      city: 'Mbarara',
      country: 'Uganda',
      avatarUrl: null
    }
  ]);

  const [callLogs, setCallLogs] = useState([
    {
      id: 1,
      contactName: 'John Doe',
      company: 'KAJON Coffee Limited',
      type: 'outgoing',
      duration: '5:23',
      date: '2025-04-18',
      time: '09:30 AM',
      notes: 'Discussed upcoming coffee shipment',
      avatarUrl: null
    },
    {
      id: 2,
      contactName: 'Jane Smith',
      company: 'Grand Berna Dairies',
      type: 'incoming',
      duration: '3:12',
      date: '2025-04-17',
      time: '02:15 PM',
      notes: 'Inquired about invoice payment',
      avatarUrl: null
    },
    {
      id: 3,
      contactName: 'David Brown',
      company: 'FreshEco Farms',
      type: 'missed',
      duration: '0:00',
      date: '2025-04-15',
      time: '11:45 AM',
      notes: '',
      avatarUrl: null
    }
  ]);

  const handleSelectContact = (contactId) => {
    setSelectedContactId(contactId);
  };

  const handleAddContact = () => {
    console.log('Add contact clicked');
    // This would typically navigate to the add contact form
  };

  const handleImportContacts = (importedContacts) => {
    // Generate new IDs for imported contacts to avoid conflicts
    const newContacts = importedContacts.map(contact => ({
      ...contact,
      id: Math.max(...contacts.map(c => c.id), 0) + Math.floor(Math.random() * 1000) + 1
    }));
    
    setContacts(prev => [...prev, ...newContacts]);
  };

  const handleImportCalls = (importedCalls) => {
    // Generate new IDs for imported call logs to avoid conflicts
    const newCalls = importedCalls.map(call => ({
      ...call,
      id: Math.max(...callLogs.map(c => c.id), 0) + Math.floor(Math.random() * 1000) + 1
    }));
    
    setCallLogs(prev => [...prev, ...newCalls]);
  };

  const renderView = () => {
    switch (view) {
      case 'contacts': {
        const selectedContact = selectedContactId 
          ? contacts.find(contact => contact.id === selectedContactId) 
          : null;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactList 
              contacts={contacts} 
              selectedContactId={selectedContactId} 
              onSelectContact={handleSelectContact}
              onAddContact={handleAddContact}
            />
            <ContactDetails contact={selectedContact} />
          </div>
        );
      }
      case 'add-contact':
        return <ContactForm onSubmit={(data) => console.log('Form submitted:', data)} />;
      case 'messages':
        return <MessagesView />;
      case 'calls':
        return <CallLogView callLogs={callLogs} />;
      case 'documents':
        return <DocumentsView />;
      case 'companies':
        return <CompaniesView />;
      case 'bluetooth':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BluetoothConnectionPanel />
            <BluetoothCRMIntegration 
              onImportContacts={handleImportContacts}
              onImportCalls={handleImportCalls}
            />
          </div>
        );
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
        return (
          <ContactList 
            contacts={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
            onAddContact={handleAddContact}
          />
        );
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
};

export default CRMRouter;
