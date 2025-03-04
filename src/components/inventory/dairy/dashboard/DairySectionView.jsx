
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingCampaignForm from '../marketing/MarketingCampaignForm';

const DairySectionView = ({ section, onBack }) => {
  const [activeForm, setActiveForm] = React.useState(null);

  console.log('Rendering DairySectionView for:', section.title);

  const renderContent = () => {
    switch (activeForm) {
      case 'marketing':
        return <MarketingCampaignForm onBack={() => setActiveForm(null)} />;
      default:
        return section.component && <section.component />;
    }
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
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Button
            onClick={() => setActiveForm('marketing')}
            className="h-24 text-lg flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#D946EF', color: 'white' }}
          >
            <Megaphone className="h-6 w-6" />
            Marketing Campaign Form
          </Button>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default DairySectionView;
