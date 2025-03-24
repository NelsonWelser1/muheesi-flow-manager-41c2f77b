
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Draft' },
  { value: 'failed', label: 'Failed' }
];

const CommunicationStatusTabs = ({ messageStatus, setMessageStatus }) => {
  return (
    <div className="border-b">
      <Tabs defaultValue={messageStatus} onValueChange={setMessageStatus} className="w-full">
        <TabsList className="w-full justify-start">
          {STATUS_OPTIONS.map((status) => (
            <TabsTrigger key={status.value} value={status.value}>
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CommunicationStatusTabs;
